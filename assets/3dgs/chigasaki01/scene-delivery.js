// Delivery policy for the pinned Spark 2.1.0 runtime; no browser-side LoD build for RAD.
export function defaultQuality(device = {}) {
  const ua = device.userAgent || '';
  if (/iPhone|iPod|iPad|Android/i.test(`${ua} ${device.platform || ''}`)
    || device.userAgentData?.mobile === true) return 'lite';
  // iPadOS Safari requests desktop pages with a Macintosh user agent.
  if (/Mac/i.test(device.platform || ua) && (device.maxTouchPoints || 0) > 1) return 'lite';
  return 'full';
}

export function selectVariant(variants, device = {}, search = '') {
  const override = new URLSearchParams(search).get('quality');
  const quality = ['full', 'lite'].includes(override) ? override : defaultQuality(device);
  return variants.find(item => item.id === quality)
    || variants.find(item => item.id === 'full') || variants[0];
}

export function isPagedVariant(variant) {
  return variant?.format === 'rad';
}

export function rendererProfile(quality, paged) {
  if (!paged) return {}; // Retain the existing precision and LoD behavior of SPZ packages.
  return quality === 'lite' ? {
    lodSplatCount: 750000, maxPagedSplats: 24 * 65536, numLodFetchers: 1,
    lodRenderScale: 1.5, pagedExtSplats: false,
  } : {
    lodSplatCount: 2500000, maxPagedSplats: 64 * 65536, numLodFetchers: 3,
    lodRenderScale: 1, pagedExtSplats: true,
  };
}

export function modelOptions(variant, url, onProgress) {
  return isPagedVariant(variant) ? { url, paged: true }
    : { url, extSplats: true, lod: true, onProgress };
}

export function startLabel(variant) {
  return isPagedVariant(variant) ? `View 3D · ${variant.id === 'lite' ? 'Lite' : 'Full'}`
    : `Download ~${Math.round(variant.bytes / 1e6)} MB`;
}

export async function requireByteRanges(url, totalBytes, { fetchImpl = fetch, signal } = {}) {
  if (!Number.isSafeInteger(totalBytes) || totalBytes < 32) throw new Error('Invalid RAD size.');
  const controller = new AbortController();
  const abort = () => controller.abort(signal?.reason);
  if (signal?.aborted) abort();
  else signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(() => controller.abort(new Error('The streaming check timed out.')), 20000);
  let response;
  try {
    response = await fetchImpl(url, {
      headers: { Range: 'bytes=0-31' }, credentials: 'omit', signal: controller.signal,
    });
    // Never consume a 200 response: doing so could allocate the complete RAD file.
    if (response.status !== 206
      || response.headers.get('Content-Range') !== `bytes 0-31/${totalBytes}`
      || response.headers.get('Content-Length') !== '32') {
      controller.abort();
      await response.body?.cancel().catch(() => {});
      throw new Error('Streaming requires byte-range responses (HTTP 206) and exposed range headers.');
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length !== 32) throw new Error('The streaming check returned an incomplete range.');
    return bytes;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}

// Spark 2.1.0's internal fetchRange accepts HTTP 200 and buffers its complete body.
// Intercept only this iframe's exact selected RAD URL, including its metadata/page requests.
export function installRadTransport(url, totalBytes, {
  scope = globalThis, signal, timeoutMs = 60000, maxRangeBytes = 32 * 1024 * 1024,
} = {}) {
  const selectedUrl = new URL(url).href;
  if (!Number.isSafeInteger(totalBytes) || totalBytes < 32) throw new Error('Invalid RAD size.');
  const original = scope.fetch;
  const requests = new Set();
  const stats = { requestCount: 0, receivedBytes: 0 };
  let disposed = false;
  const guarded = async (input, init) => {
    const href = new URL(input instanceof Request ? input.url : input, scope.location?.href).href;
    if (href !== selectedUrl) return original.call(scope, input, init);
    if (disposed || signal?.aborted) throw signal?.reason || new DOMException('Scene released', 'AbortError');
    const request = new Request(input, init);
    const range = /^bytes=(\d+)-(\d+)$/.exec(request.headers.get('Range') || '');
    const start = Number(range?.[1]), requestedEnd = Number(range?.[2]);
    const end = Math.min(requestedEnd, totalBytes - 1);
    const length = end - start + 1;
    if (request.method !== 'GET' || !range || !Number.isSafeInteger(start)
      || !Number.isSafeInteger(requestedEnd) || start < 0 || start >= totalBytes
      || end < start || length > maxRangeBytes) {
      throw new Error('RAD streaming requires a bounded byte-range request.');
    }
    const controller = new AbortController();
    requests.add(controller);
    const abortSession = () => controller.abort(signal.reason);
    const abortRequest = () => controller.abort(request.signal.reason);
    signal?.addEventListener('abort', abortSession, { once: true });
    request.signal.addEventListener('abort', abortRequest, { once: true });
    if (request.signal.aborted) abortRequest();
    const timeout = setTimeout(() => controller.abort(new Error('A scene detail request timed out.')), timeoutMs);
    let reader;
    const cancelReader = () => { reader?.cancel(controller.signal.reason).catch(() => {}); };
    controller.signal.addEventListener('abort', cancelReader, { once: true });
    try {
      ++stats.requestCount;
      const response = await original.call(scope, request, { signal: controller.signal });
      if (controller.signal.aborted) throw controller.signal.reason;
      if (response.status !== 206
        || response.headers.get('Content-Range') !== `bytes ${start}-${end}/${totalBytes}`
        || response.headers.get('Content-Length') !== String(length) || !response.body) {
        controller.abort();
        await response.body?.cancel().catch(() => {});
        throw new Error('A scene range returned invalid HTTP 206/range headers; full-file loading was blocked.');
      }
      // Keep the deadline and abort signal alive through the body, not just HTTP headers.
      // Allocate at most one requested page; an ignored Range never reaches this allocation.
      const bytes = new Uint8Array(length);
      reader = response.body.getReader();
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (controller.signal.aborted) throw controller.signal.reason;
        if (done) break;
        stats.receivedBytes += value.length;
        if (received + value.length > length) throw new Error('A scene range body exceeded its declared size.');
        bytes.set(value, received);
        received += value.length;
      }
      if (received !== length) throw new Error('A scene range body was incomplete.');
      // Spark's own arrayBuffer() now receives only the validated, bounded range.
      return new Response(bytes, { status: 206, headers: response.headers });
    } catch (error) {
      controller.abort(error);
      throw error;
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', abortSession);
      request.signal.removeEventListener('abort', abortRequest);
      controller.signal.removeEventListener('abort', cancelReader);
      reader?.releaseLock();
      requests.delete(controller);
    }
  };
  scope.fetch = guarded;
  return {
    getStats() { return { ...stats }; },
    dispose() {
      disposed = true;
      for (const request of requests) request.abort(new DOMException('Scene released', 'AbortError'));
      if (scope.fetch === guarded) scope.fetch = original;
    },
  };
}

export function releaseSiblingRuntime({ release, runtimeRequested, win = window }) {
  release();
  // Spark's shared decode WorkerPool is module-scoped. Only document teardown frees it.
  // The fresh document is click-to-load, so this never starts another model download.
  if (runtimeRequested) win.location.reload();
}

export function createRenderGate(timeoutMs = 120000) {
  let resolve, reject, settled = false, frames = 0, lastFrame = -1;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  const finish = (error) => {
    if (settled) return;
    settled = true;
    clearTimeout(timeout);
    if (error) reject(error); else resolve();
  };
  const timeout = setTimeout(() => finish(new Error('No visible 3D details arrived. Please try again.')), timeoutMs);
  return {
    promise,
    observe({ frame, activeSplats, instanceCount, pagedSplats }) {
      if (settled || frame === lastFrame) return;
      lastFrame = frame;
      frames = activeSplats > 0 && instanceCount > 0 && pagedSplats > 0 ? frames + 1 : 0;
      if (frames >= 2) finish();
    },
    cancel(reason = new DOMException('Scene released', 'AbortError')) { finish(reason); },
  };
}

export function guardPagedLoads(paged, { isActive, onError }) {
  const fetchChunk = paged.fetchDecodeChunk.bind(paged);
  paged.fetchDecodeChunk = async (...args) => {
    if (!isActive()) throw new DOMException('Scene released', 'AbortError');
    try {
      const result = await fetchChunk(...args);
      if (!isActive()) throw new DOMException('Scene released', 'AbortError');
      return result;
    } catch (error) {
      // Spark otherwise logs and retries failed chunks indefinitely.
      if (isActive()) onError(error);
      throw error;
    }
  };
}

export function disposeSpark(spark) {
  if (!spark) return;
  spark.autoUpdate = false;
  spark.enableDriveLod = false;
  spark.enableLodFetching = false;
  clearTimeout(spark.updateTimeoutId);
  clearTimeout(spark.sortTimeoutId);
  if (spark.pager) {
    spark.pager.autoDrive = false;
    spark.pager.numFetchers = 0;
    for (const key of ['fetchPriority', 'fetched', 'newUploads', 'readyUploads', 'lodTreeUpdates']) {
      spark.pager[key].length = 0;
    }
  }
  spark.dispose(); // Includes the page textures and private sort/LoD workers.
  spark.material.dispose();
}

export function knownViewerFrame(frame, pageUrl) {
  try {
    const url = new URL(frame.getAttribute('src'), pageUrl);
    return url.origin === new URL(pageUrl).origin
      && /\/assets\/3dgs\/[^/]+\/(?:index\.html)?$/.test(url.pathname);
  } catch { return false; }
}

export function coordinateViewers(onRelease, win = window) {
  const siblings = () => {
    try {
      if (win.parent === win || win.parent.location.origin !== win.location.origin) return [];
      return [...win.parent.document.querySelectorAll('iframe[src]')]
        .filter(frame => knownViewerFrame(frame, win.parent.location.href))
        .map(frame => frame.contentWindow).filter(Boolean);
    } catch { return []; }
  };
  const onMessage = event => {
    if (event.origin !== win.location.origin || event.data?.type !== '3dgs-viewer-activate'
      || event.source === win || !siblings().includes(event.source)) return;
    onRelease();
  };
  win.addEventListener('message', onMessage);
  return {
    activate() {
      for (const sibling of siblings()) {
        if (sibling !== win) sibling.postMessage({ type: '3dgs-viewer-activate' }, win.location.origin);
      }
    },
    dispose() { win.removeEventListener('message', onMessage); },
  };
}
