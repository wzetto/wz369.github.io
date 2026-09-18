import { selectVariant, isPagedVariant, rendererProfile, modelOptions, startLabel,
  requireByteRanges, createRenderGate, guardPagedLoads, disposeSpark, coordinateViewers,
  installRadTransport, releaseSiblingRuntime } from './scene-delivery.js?v=20260918-rad3';

const $ = (id) => document.getElementById(id);
const root = $('scene');
let manifest, renderer, scene, camera, controls, mesh, spark, THREE, SplatMesh;
let cameraNavigation, OrbitControls;
let busy = false;
let currentVariant;
let visible = true;
let assetBaseUrl = new URL('./', location.href);
let resizeObserver, visibilityObserver, renderGate, sceneEvents, loadAbort, radTransport;
let generation = 0;
let runtimeRequested = false, retiring = false;
const viewerCoordinator = coordinateViewers(() => {
  if (retiring) return;
  retiring = runtimeRequested;
  releaseSiblingRuntime({ release: () => releaseScene(true), runtimeRequested });
});

root.addEventListener('keydown', (event) => {
  const disclosure = root.querySelector('.camera-controls');
  if (event.key !== 'Escape' || !disclosure?.open) return;
  disclosure.open = false;
  cameraNavigation?.clear();
  disclosure.querySelector('summary').focus({ preventScroll: true });
  event.preventDefault();
});

function resolveAssetBase(value, pageUrl = location.href) {
  if (value == null || value === '') return new URL('./', pageUrl);
  if (typeof value !== 'string' || /[\s\\?#]/.test(value)) throw new Error('Invalid asset base URL.');
  const url = new URL(value);
  const localHttp = url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !localHttp) || url.username || url.password || url.search || url.hash) {
    throw new Error('Asset base URL must be a public HTTPS directory without credentials, query, or fragment.');
  }
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url;
}

function fail(message, error) {
  console.error(message, error);
  releaseScene(false);
  root.dataset.state = 'error';
  $('error-message').textContent = message;
  $('error').hidden = false;
  $('loading').hidden = true;
  $('welcome').hidden = true;
}

function setupPoster() {
  const poster = $('poster');
  if (!poster || !manifest.poster) return;
  if (poster.getAttribute('src')) return;
  try {
    // New packages keep this small image beside the page; legacy packages may
    // still store their poster with the externally hosted model files.
    const base = manifest.poster_base_url === './' ? new URL('./', location.href)
      : manifest.poster_base_url ? resolveAssetBase(manifest.poster_base_url) : assetBaseUrl;
    const url = new URL(manifest.poster, base);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return;
    poster.addEventListener('load', () => { poster.hidden = false; }, { once: true });
    poster.addEventListener('error', () => { poster.hidden = true; }, { once: true });
    poster.src = url.href;
  } catch { /* A missing preview must never prevent loading the 3D scene. */ }
}

function setEnabled(enabled) {
  $('reset').disabled = !enabled;
  cameraNavigation?.setEnabled(enabled);
}

function disposeScene(group) {
  if (!group) return;
  group.removeFromParent();
  for (const child of [...group.children]) { group.remove(child); child.dispose(); }
}

function releaseScene(showWelcome) {
  ++generation;
  loadAbort?.abort();
  loadAbort = undefined;
  radTransport?.dispose();
  radTransport = undefined;
  renderGate?.cancel();
  renderGate = undefined;
  busy = false;
  setEnabled(false);
  sceneEvents?.abort();
  resizeObserver?.disconnect();
  visibilityObserver?.disconnect();
  renderer?.setAnimationLoop(null);
  cameraNavigation?.dispose();
  controls?.dispose();
  disposeScene(mesh);
  disposeSpark(spark);
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  }
  renderer = scene = camera = controls = mesh = spark = cameraNavigation = undefined;
  root.querySelector('.camera-controls').open = false;
  if (showWelcome && manifest) {
    root.dataset.state = 'idle';
    $('loading').hidden = $('error').hidden = true;
    $('welcome').hidden = false;
  }
}

function overview() {
  if (manifest.overview) return manifest.overview;
  const bounds = manifest.cleanup?.retained_bounds;
  if (!bounds) throw new Error('The scene overview is missing.');
  const min = new THREE.Vector3().fromArray(bounds.min);
  const max = new THREE.Vector3().fromArray(bounds.max);
  const target = min.clone().add(max).multiplyScalar(.5);
  const radius = min.distanceTo(max) * .5;
  const fov = 50;
  const distance = 1.12 * radius / Math.sin(THREE.MathUtils.degToRad(fov / 2));
  const position = target.clone().add(new THREE.Vector3(1, -1.3, 1).normalize().multiplyScalar(distance));
  return { position: position.toArray(), target: target.toArray(), fov, aspect: 1 };
}

function replaceCamera(next) {
  const target = controls?.target.clone();
  const maxDistance = controls?.maxDistance ?? 8;
  controls?.dispose();
  camera = next;
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false;
  controls.minDistance = .015;
  controls.maxDistance = Math.max(maxDistance, target ? next.position.distanceTo(target) * 1.01 : 0);
  camera.far = Math.max(camera.far, controls.maxDistance * 2);
  camera.updateProjectionMatrix();
  controls.zoomSpeed = .8;
  controls.panSpeed = .8;
  if (target) controls.target.copy(target);
  controls.addEventListener('change', () => cameraNavigation?.sync());
  controls.update();
  if (spark) {
    spark.sortRadial = !camera.isOrthographicCamera;
    spark.sortDirty = true;
    spark.setDirty();
  }
}

function resetView() {
  if (!camera) return;
  const view = overview();
  cameraNavigation?.clear();
  if (camera.isOrthographicCamera) {
    replaceCamera(new THREE.PerspectiveCamera(view.fov, camera.aspect, .003, camera.far));
  }
  camera.position.fromArray(view.position);
  camera.up.fromArray(view.up || [0, 0, 1]);
  camera.fov = view.fov;
  camera.updateProjectionMatrix();
  controls.target.fromArray(view.target);
  // A narrower viewport needs more distance to keep the same horizontal coverage.
  const fit = Math.max(1, (view.aspect ?? 1) / camera.aspect);
  const offset = camera.position.clone().sub(controls.target).multiplyScalar(fit);
  camera.position.copy(controls.target).add(offset);
  controls.maxDistance = Math.max(8, offset.length() * 4);
  camera.far = Math.max(100, controls.maxDistance * 2);
  camera.updateProjectionMatrix();
  camera.lookAt(controls.target);
  // OrbitControls caches its up basis at construction; refresh it after axis/reset changes.
  replaceCamera(camera);
  cameraNavigation?.sync();
}

function zoom(factor) {
  if (!controls || busy) return;
  if (camera.isOrthographicCamera) {
    camera.zoom = Math.max(.02, Math.min(100, camera.zoom / factor));
    camera.updateProjectionMatrix();
    controls.update();
    return;
  }
  const offset = camera.position.clone().sub(controls.target);
  const length = Math.max(controls.minDistance, Math.min(controls.maxDistance, offset.length() * factor));
  camera.position.copy(controls.target).add(offset.setLength(length));
  controls.update();
}

async function setup(variant, token) {
  runtimeRequested = true;
  const [three, sparkModule, orbit, navigation] = await Promise.all([
    import('three'), import('@sparkjsdev/spark'), import('three/addons/controls/OrbitControls.js'),
    import('./camera-navigation.js?v=20260917-glass3')
  ]);
  if (token !== generation) throw new DOMException('Scene released', 'AbortError');
  THREE = three;
  OrbitControls = orbit.OrbitControls;
  SplatMesh = sparkModule.SplatMesh;
  // Ensure the shared WASM is initialized before a paged constructor can schedule metadata fetching.
  await SplatMesh.staticInitialized;
  if (token !== generation) throw new DOMException('Scene released', 'AbortError');
  sceneEvents = new AbortController();
  const listen = (element, type, callback) => element.addEventListener(type, callback, { signal: sceneEvents.signal });
  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
  renderer.setPixelRatio(variant.id === 'lite' ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x192732, 1);
  $('canvas').appendChild(renderer.domElement);
  listen(renderer.domElement, 'webglcontextlost', (event) => {
    event.preventDefault();
    fail('The graphics context was lost. Reload the scene to try again.');
  });
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, 1, .003, 100);
  camera.up.set(0, 0, 1); // The exported model and camera poses share Nerfstudio's Z-up coordinates.
  replaceCamera(camera);
  spark = new sparkModule.SparkRenderer({ renderer, ...rendererProfile(variant.id, isPagedVariant(variant)) });
  scene.add(spark);
  const resize = () => {
    const width = root.clientWidth, height = root.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / Math.max(1, height);
    if (camera.isOrthographicCamera) {
      const halfHeight = (camera.top - camera.bottom) / 2;
      camera.left = -halfHeight * camera.aspect;
      camera.right = halfHeight * camera.aspect;
    }
    camera.updateProjectionMatrix();
  };
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(root);
  resize();
  resetView();
  cameraNavigation = navigation.createCameraNavigation({
    THREE, root, canvas: $('canvas'), getCamera: () => camera, getControls: () => controls,
    replaceCamera, getFov: () => overview().fov
  });
  visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  visibilityObserver.observe(root);
  renderer.setAnimationLoop((time) => {
    if (token !== generation) return;
    if (!document.hidden && visible) {
      try {
        cameraNavigation.update(time);
        renderer.render(scene, camera);
        renderGate?.observe({ frame: renderer.info.render.frame, activeSplats: spark.activeSplats,
          instanceCount: spark.geometry.instanceCount, pagedSplats: mesh?.children[0]?.paged?.numSplats ?? 0 });
      } catch (error) { fail('The graphics renderer stopped. Try the scene again.', error); }
    } else cameraNavigation.clear();
  });
  listen($('canvas'), 'keydown', (event) => {
    if (busy || !mesh || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === '+' || event.key === '=') zoom(.8);
    else if (event.key === '-') zoom(1.25);
    else if (event.key.toLowerCase() === 'r') resetView();
    else if (event.key.startsWith('Arrow')) {
      const distance = camera.position.distanceTo(controls.target) * .06;
      const delta = new THREE.Vector3();
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') delta.setFromMatrixColumn(camera.matrix, 0).multiplyScalar(event.key === 'ArrowLeft' ? -distance : distance);
      else delta.setFromMatrixColumn(camera.matrix, 1).multiplyScalar(event.key === 'ArrowDown' ? -distance : distance);
      camera.position.add(delta);
      controls.target.add(delta);
      controls.update();
    } else return;
    event.preventDefault();
  });
  listen(renderer.domElement, 'pointerdown', () => $('canvas').focus({ preventScroll: true }));
  listen(renderer.domElement, 'dblclick', (event) => {
    if (!mesh || busy) return;
    const rect = renderer.domElement.getBoundingClientRect();
    const pointer = new THREE.Vector2(2*(event.clientX-rect.left)/rect.width-1, 1-2*(event.clientY-rect.top)/rect.height);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(pointer, camera);
    const [hit] = ray.intersectObject(mesh, true);
    if (hit) { controls.target.copy(hit.point); controls.update(); }
  });
}

async function load(variantId) {
  if (busy || retiring) return;
  releaseScene(false);
  const token = generation;
  loadAbort = new AbortController();
  const active = () => token === generation;
  busy = true;
  setEnabled(false);
  $('error').hidden = true;
  $('welcome').hidden = true;
  $('loading').hidden = false;
  $('progress').textContent = 'Preparing 3D scene…';
  root.dataset.state = 'loading';
  let candidate;
  try {
    const variant = manifest.variants.find((item) => item.id === variantId);
    if (!variant) throw new Error('Unknown model variant');
    const paged = isPagedVariant(variant);
    if (paged) {
      if (variant.files || !variant.file) throw new Error('This viewer expects one streaming RAD file per variant.');
      const url = new URL(variant.file, assetBaseUrl).href;
      radTransport = installRadTransport(url, variant.bytes, { signal: loadAbort.signal });
      $('progress').textContent = 'Checking scene streaming…';
      await requireByteRanges(url, variant.bytes, { signal: loadAbort.signal });
      if (!active()) return;
    }
    // Do not retire another model until the selected endpoint has passed its streaming check.
    viewerCoordinator.activate();
    await setup(variant, token);
    if (!active()) return;
    candidate = new THREE.Group();
    // Spark discovers paged meshes during rendering, before they have loaded any splats.
    mesh = candidate;
    scene.add(candidate);
    const files = variant.files || [{file: variant.file, bytes: variant.bytes}];
    let completedBytes = 0;
    // Spatial chunks bound decoding memory. Spark sorts the meshes together.
    for (const file of files) {
      const part = new SplatMesh(modelOptions(variant, new URL(file.file, assetBaseUrl).href, (event) => {
        if (!active()) return;
        const loaded = completedBytes + Math.min(event.loaded, file.bytes);
        const percent = Math.min(100, Math.round(100*loaded/variant.bytes));
        $('progress').textContent = percent < 100 ? `Downloading scene ${percent}%` : 'Preparing 3D details…';
      }));
      part.scale.setScalar(variant.render_scale ?? 1);
      candidate.add(part);
      if (paged) {
        guardPagedLoads(part.paged, { isActive: active, onError: (error) => {
          queueMicrotask(() => { if (active()) fail('Streaming stopped. Check your connection and try again.', error); });
        } });
        $('progress').textContent = `Streaming ${variant.id === 'lite' ? 'Lite' : 'Full'} overview…`;
        // initialized only prepares the object. RAD metadata and real drawn frames are the readiness gate.
        const deadline = setTimeout(() => {
          if (active()) fail('Scene streaming timed out. Check your connection and try again.');
        }, 120000);
        try {
          await part.initialized;
          await part.paged.getRadMeta();
        } finally { clearTimeout(deadline); }
        if (!active()) return;
        $('progress').textContent = 'Drawing the first details…';
        renderGate = createRenderGate();
        await renderGate.promise;
        if (!active()) return;
        renderGate = undefined;
      } else {
        await part.initialized;
        if (!active()) { part.dispose(); return; }
      }
      completedBytes += file.bytes;
    }
    currentVariant = variant.id;
    $('loading').hidden = true;
    root.dataset.state = 'ready';
    root.dataset.variant = currentVariant;
    root.dataset.splats = String(variant.count ?? '');
    root.dataset.delivery = paged ? 'paged-rad' : 'spz';
    console.info('[3dgs ready]', JSON.stringify({
      sceneId: manifest.delivery?.scene_id ?? manifest.id ?? manifest.scene_id ?? null, quality: variant.id,
      delivery: root.dataset.delivery, sourceCount: variant.count ?? null,
      activeSplats: spark.activeSplats, maxPagedSplats: spark.pager?.maxSplats ?? null,
      pixelRatio: renderer.getPixelRatio(),
      radRequests: radTransport?.getStats() ?? null,
    }));
    setEnabled(true);
    $('canvas').focus({ preventScroll: true });
  } catch (error) {
    if (active()) fail('The scene could not load. Check your connection and try again.', error);
  } finally { if (active()) busy = false; }
}

$('start').addEventListener('click', () => load(currentVariant));
$('retry').addEventListener('click', () => {
  // Recreate WebGL as well when its context was lost.
  if (renderer?.getContext().isContextLost()) location.reload();
  else if (manifest) load(currentVariant);
  else location.reload();
});
$('reset').addEventListener('click', resetView);
$('fullscreen').addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (root.requestFullscreen) await root.requestFullscreen();
    else window.open(location.href, '_blank', 'noopener');
  } catch { window.open(location.href, '_blank', 'noopener'); }
});
document.addEventListener('fullscreenchange', () => {
  $('fullscreen').textContent = document.fullscreenElement ? 'Exit fullscreen ↙' : 'Fullscreen ↗';
  $('fullscreen').setAttribute('aria-label', document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen');
});
// Release the GPU pool even for bfcache; navigating back shows the lightweight poster again.
window.addEventListener('pagehide', () => releaseScene(true));

try {
  const manifestUrl = new URL('scene.json', import.meta.url);
  manifestUrl.search = new URL(import.meta.url).search;
  const response = await fetch(manifestUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Manifest HTTP ${response.status}`);
  manifest = await response.json();
  assetBaseUrl = resolveAssetBase(manifest.asset_base_url);
  setupPoster();
  const variant = selectVariant(manifest.variants, navigator, location.search);
  if (!variant) throw new Error('No model files are available.');
  currentVariant = variant.id;
  $('start').disabled = false;
  $('start').textContent = startLabel(variant);
  $('start').title = isPagedVariant(variant) ? 'Streams details as you explore. Only one scene stays active per article.' : '';
  root.dataset.variant = currentVariant;
  root.dataset.state = 'idle';
} catch (error) { fail('Scene information could not load. Refresh the page to try again.', error); }
