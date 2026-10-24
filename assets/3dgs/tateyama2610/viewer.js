import { selectVariant, isPagedVariant, rendererProfile, modelOptions, startLabel,
  requireByteRanges, createRenderGate, guardPagedLoads, disposeSpark, coordinateViewers,
  installRadTransport, releaseSiblingRuntime, skyQuality } from './scene-delivery.js?v=20261007-eye7';

const $ = (id) => document.getElementById(id);
const root = $('scene');
let manifest, renderer, scene, camera, controls, mesh, spark, THREE, SplatMesh;
let cameraNavigation, OrbitControls, skyField;
let busy = false;
let currentVariant;
let visible = true;
let assetBaseUrl = new URL('./', location.href);
let resizeObserver, visibilityObserver, renderGate, sceneEvents, loadAbort, radTransport;
let generation = 0;
let runtimeRequested = false, retiring = false;
// Eye-level viewing: the start view keeps a real standing position; the view turns about the eye like
// a head instead of orbiting a far point, and the shorter screen side spans EYE_FOV degrees
// (~29 mm full-frame on a landscape screen) instead of the 90° capture lens. Zoom narrows the
// field of view only. The start view looks EYE_GAZE degrees below the horizon (a relaxed standing gaze).
// capture_rad_poster.py (eye runtime) mirrors EYE_FOV, EYE_PIVOT and EYE_GAZE; keep them in step.
// EYE_FOV_MAX lets a zoom-out shrink the view to a third of the 90° lens scale (tan 71.6° = 3 tan 45°).
// Right-drag pans as if grabbing content EYE_PAN_DEPTH away (about the median scene depth).
const EYE_FOV = 45, EYE_FOV_MIN = 15, EYE_FOV_MAX = 2 * Math.atan(3) * 180 / Math.PI, EYE_PIVOT = .002, EYE_WALK = .03,
  EYE_GAZE = -5, EYE_PAN_DEPTH = .12;
// Axis (orthographic) views frame this far ahead of the eye, the scale of the old orbit target.
const EYE_AXIS_FOCUS = .5;
// Walking speed multiplier for EYE_WALK (W A S D and the on-screen move arrows, via getWalkSpeed). The round
// button in the Move section steps through WALK_SPEEDS; every page load starts at 1×.
const WALK_SPEEDS = [1, 2, 8];
let eyeFov = EYE_FOV, savedEye, walkSpeed = WALK_SPEEDS[0];
// Input modality for focus rings: pointer presses hide them, real keyboard navigation shows them.
const setInputModality = (mode) => { if (document.documentElement.dataset.input !== mode) document.documentElement.dataset.input = mode; };
addEventListener('pointerdown', () => setInputModality('pointer'), { capture: true, passive: true });
addEventListener('keydown', (event) => {
  if (!event.metaKey && !event.ctrlKey && !event.altKey && /^(Tab|Arrow|Enter| |Escape|Home|End)/.test(event.key)) setInputModality('keyboard');
}, { capture: true });
let frameProbe, interacting = false;
const viewerCoordinator = coordinateViewers(() => {
  if (retiring) return;
  retiring = runtimeRequested;
  releaseSiblingRuntime({ release: () => releaseScene(true), runtimeRequested });
});

// The start button keeps its glyph; only the label text changes.
const setStartLabel = (text) => { $('start').querySelector('.start-label').textContent = text; };

// Liquid Glass feedback: light starts under the pointer (--px/--py) and pressed glass springs.
const glassTargets = '.glass-press, .glass-item, .controls-popover button:not(.cube-face)';
let pressedGlass;
const glassAt = (event) => {
  const element = event.target instanceof Element ? event.target.closest(glassTargets) : null;
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  element.style.setProperty('--px', `${Math.round(event.clientX - rect.left)}px`);
  element.style.setProperty('--py', `${Math.round(event.clientY - rect.top)}px`);
  return element;
};
const releaseGlass = () => { pressedGlass?.classList.remove('is-pressed'); pressedGlass = undefined; };
root.addEventListener('pointermove', glassAt, { passive: true });
root.addEventListener('pointerdown', (event) => {
  releaseGlass();
  const element = glassAt(event);
  // Native selects open their own menu and may never report pointerup.
  if (!element || element.matches(':disabled') || event.target.closest('select')) return;
  pressedGlass = element;
  element.classList.add('is-pressed');
}, { passive: true });
for (const type of ['pointerup', 'pointercancel']) window.addEventListener(type, releaseGlass, true);
window.addEventListener('blur', releaseGlass);

root.addEventListener('keydown', (event) => {
  const disclosure = root.querySelector('.camera-controls');
  if (event.key !== 'Escape' || !disclosure?.open) return;
  disclosure.open = false;
  cameraNavigation?.clear();
  disclosure.querySelector('summary').focus({ preventScroll: true });
  event.preventDefault();
});

// ---------- Backdrop-adaptive chrome ----------
// Liquid Glass adapts to what is behind it: small controls, the title and the hint switch to a light
// appearance over bright sky or snow (viewer.css [data-backdrop="light"]). Hysteresis keeps them from
// flickering at the boundary. Before the scene is ready they sample the poster, then the rendered frame.
const LIGHT_ON = .45, LIGHT_OFF = .33;
const linear = Float32Array.from({ length: 256 }, (_, i) => {
  const c = i / 255;
  return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
});
const luminance = (data, i) => .2126 * linear[data[i]] + .7152 * linear[data[i + 1]] + .0722 * linear[data[i + 2]];
const backdropTargets = [...root.querySelectorAll('[data-backdrop-probe]')];
const probeRects = () => backdropTargets.map(element => [element, element.getBoundingClientRect()])
  .filter(([, rect]) => rect.width >= 1 && rect.height >= 1);
function setBackdrop(element, value) {
  if (!Number.isFinite(value)) return;
  const light = element.dataset.backdrop === 'light';
  const next = light ? value > LIGHT_OFF : value > LIGHT_ON;
  if (next !== light || !element.dataset.backdrop) element.dataset.backdrop = next ? 'light' : 'dark';
}

let posterSample;
function probePoster() {
  if (root.dataset.state === 'ready') return;
  const poster = $('poster'), box = root.getBoundingClientRect();
  if (!box.width || !box.height) return;
  // Without a poster the backdrop is the page's dark blue.
  if (poster.hidden || !poster.naturalWidth) { for (const [element] of probeRects()) setBackdrop(element, 0); return; }
  try {
    const w = Math.max(1, Math.round(box.width / 4)), h = Math.max(1, Math.round(box.height / 4));
    if (posterSample?.src !== poster.currentSrc || posterSample.w !== w || posterSample.h !== h) {
      const canvas = Object.assign(document.createElement('canvas'), { width: w, height: h });
      const context = canvas.getContext('2d', { willReadFrequently: true });
      const fit = Math.max(w / poster.naturalWidth, h / poster.naturalHeight); // object-fit: cover, centred
      const dw = poster.naturalWidth * fit, dh = poster.naturalHeight * fit;
      context.drawImage(poster, (w - dw) / 2, (h - dh) / 2, dw, dh);
      posterSample = { src: poster.currentSrc, w, h, data: context.getImageData(0, 0, w, h).data };
    }
    const { data } = posterSample, sx = w / box.width, sy = h / box.height;
    for (const [element, rect] of probeRects()) {
      const x0 = Math.max(0, Math.floor((rect.left - box.left) * sx)), x1 = Math.min(w, Math.ceil((rect.right - box.left) * sx));
      const y0 = Math.max(0, Math.floor((rect.top - box.top) * sy)), y1 = Math.min(h, Math.ceil((rect.bottom - box.top) * sy));
      let sum = 0, count = 0;
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { sum += luminance(data, (y * w + x) * 4); count++; }
      if (count) setBackdrop(element, sum / count);
    }
  } catch { /* A cross-origin poster without CORS cannot be read; keep the current appearance. */ }
}
let posterProbeTimer;
const schedulePosterProbe = () => { clearTimeout(posterProbeTimer); posterProbeTimer = setTimeout(probePoster, 120); };
window.addEventListener('resize', schedulePosterProbe);
$('poster').addEventListener('load', schedulePosterProbe);
root.querySelector('.camera-controls').addEventListener('toggle', () => { schedulePosterProbe(); frameProbe?.invalidate(); });

// ---------- Walking speed ----------
// One round glass button in the Move section shows the multiplier and steps 1× → 2× → 8× → 1×. Its name and
// tooltip carry the value; a polite status line announces a change.
const walkSpeedButton = root.querySelector('.walk-speed');
const walkSpeedStatus = root.querySelector('.walk-speed-status');
let walkSpeedPointer = '';
function showWalkSpeed() {
  walkSpeedButton.querySelector('.walk-speed-value').textContent = `${walkSpeed}×`;
  walkSpeedButton.dataset.speed = String(walkSpeed);
  walkSpeedButton.setAttribute('aria-label', `Walking speed: ${walkSpeed}×; click to change`);
  walkSpeedButton.title = `Walking speed ${walkSpeed}× · click to change`;
}
walkSpeedButton.addEventListener('pointerdown', (event) => { walkSpeedPointer = event.pointerType; }, { passive: true });
walkSpeedButton.addEventListener('click', (event) => {
  if (walkSpeedButton.disabled) return;
  walkSpeed = WALK_SPEEDS[(WALK_SPEEDS.indexOf(walkSpeed) + 1) % WALK_SPEEDS.length];
  showWalkSpeed();
  walkSpeedStatus.textContent = `Walking speed: ${walkSpeed}×`;
  // A mouse click hands the keys back to the scene, as the move arrows do; keyboard and touch keep focus here.
  if (event.detail !== 0 && walkSpeedPointer !== 'touch') $('canvas').focus({ preventScroll: true });
  walkSpeedPointer = '';
});
showWalkSpeed();

// Reads a few rows under each target straight after a render, into a pixel-pack buffer, and collects
// them a frame or two later behind a fence, so sampling never stalls the render loop.
function createFrameProbe(renderer) {
  const gl = renderer.getContext();
  let pending, last = -Infinity, dirty = true;
  const release = () => {
    if (!pending) return;
    gl.deleteSync(pending.sync);
    gl.deleteBuffer(pending.buffer);
    pending = undefined;
  };
  const collect = () => {
    const status = gl.clientWaitSync(pending.sync, 0, 0);
    if (status === gl.TIMEOUT_EXPIRED) return;
    const { buffer, regions, bytes } = pending;
    let data;
    if (status !== gl.WAIT_FAILED) {
      data = new Uint8Array(bytes);
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buffer);
      gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, data);
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    }
    release();
    if (!data) return;
    for (const { element, rows } of regions) {
      let sum = 0, count = 0;
      for (const { offset, width } of rows) {
        const step = Math.max(1, Math.floor(width / 48));
        for (let x = 0; x < width; x += step) { sum += luminance(data, offset + x * 4); count++; }
      }
      if (count) setBackdrop(element, sum / count);
    }
  };
  const request = () => {
    const box = renderer.domElement.getBoundingClientRect();
    const width = gl.drawingBufferWidth, height = gl.drawingBufferHeight;
    if (!box.width || !box.height || renderer.getRenderTarget()) return;
    const sx = width / box.width, sy = height / box.height, regions = [];
    let bytes = 0;
    for (const [element, rect] of probeRects()) {
      const x0 = Math.max(0, Math.floor((rect.left - box.left) * sx)), x1 = Math.min(width, Math.ceil((rect.right - box.left) * sx));
      if (x1 - x0 < 1) continue;
      const count = Math.min(6, Math.max(2, Math.round(rect.height / 24))), rows = [];
      for (let row = 0; row < count; row++) {
        const y = Math.floor((rect.top - box.top + rect.height * (row + .5) / count) * sy);
        if (y < 0 || y >= height) continue;
        rows.push({ x: x0, y: height - 1 - y, width: x1 - x0, offset: bytes });
        bytes += (x1 - x0) * 4;
      }
      if (rows.length) regions.push({ element, rows });
    }
    if (!bytes) return;
    // A fresh buffer per sample (as three's readRenderTargetPixelsAsync does) keeps Chrome's readback shadow valid.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buffer);
    gl.bufferData(gl.PIXEL_PACK_BUFFER, bytes, gl.STREAM_READ);
    renderer.state.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
    for (const { rows } of regions) for (const row of rows) gl.readPixels(row.x, row.y, row.width, 1, gl.RGBA, gl.UNSIGNED_BYTE, row.offset);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    pending = { buffer, sync: gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0), regions, bytes };
    gl.flush();
  };
  return {
    invalidate() { dirty = true; },
    // Call right after renderer.render(): the drawing buffer is only readable until the frame is shown.
    afterRender(time) {
      if (pending) { collect(); return; }
      if (root.dataset.state !== 'ready' || time - last < (dirty ? 250 : 1000)) return;
      last = time;
      dirty = false;
      request();
    },
    dispose() {
      if (!gl.isContextLost()) release();
      pending = undefined;
    },
  };
}

function resolveAssetBase(value, pageUrl = location.href) {
  if (value == null || value === '') return new URL('./', pageUrl);
  if (typeof value !== 'string' || /[\s\\?#]/.test(value)) throw new Error('Invalid asset base URL.');
  const url = new URL(value, pageUrl);
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
  walkSpeedButton.disabled = !enabled;
  cameraNavigation?.setEnabled(enabled);
}

// The camera is free: the page starts at scene.json `overview` and Reset (or R) returns there.
function setupQualitySelector(variant) {
  const quality = $('quality-select');
  for (const option of quality.options) {
    option.disabled = !manifest.variants.some(item => item.id === option.value);
  }
  quality.value = variant.id;
  quality.disabled = false;
}

$('quality-select').addEventListener('change', (event) => {
  const quality = event.target.value;
  if (!['full', 'lite'].includes(quality) || !manifest?.variants.some(item => item.id === quality)) return;
  const url = new URL(location.href);
  url.searchParams.set('quality', quality);
  location.assign(url.href);
});

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
  frameProbe?.dispose();
  frameProbe = undefined;
  interacting = false;
  cameraNavigation?.dispose();
  controls?.dispose();
  disposeScene(mesh);
  skyField?.dispose();
  disposeSpark(spark);
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  }
  renderer = scene = camera = controls = mesh = spark = cameraNavigation = skyField = undefined;
  root.querySelector('.camera-controls').open = false;
  if (showWelcome && manifest) {
    root.dataset.state = 'idle';
    $('loading').hidden = $('error').hidden = true;
    $('welcome').hidden = false;
  }
  schedulePosterProbe();
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
  const maxDistance = Math.max(8, controls?.maxDistance ?? 8);
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
  controls.addEventListener('start', () => { interacting = true; });
  controls.addEventListener('end', () => { interacting = false; });
  controls.addEventListener('change', () => {
    cameraNavigation?.sync();
    frameProbe?.invalidate();
    // The bottom hint fades once someone has explored by hand.
    if (interacting && root.dataset.state === 'ready') root.dataset.explored = '';
  });
  if (camera.isPerspectiveCamera) {
    // Turn about the eye: the pivot sits a hair in front of it and wheel/pinch change the field of
    // view (never the distance). Right-drag / two-finger pan steps the eye, scaled to scene depth
    // rather than the 2 mm pivot; W A S D walk level at a human pace.
    controls.minDistance = EYE_PIVOT * .5;
    controls.maxDistance = EYE_PIVOT * 2;
    controls.enablePan = true;
    controls._pan = (deltaX, deltaY) => {
      const height = Math.max(1, controls.domElement.clientHeight);
      const scale = 2 * EYE_PAN_DEPTH * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / height;
      controls._panLeft(deltaX * scale, camera.matrix);
      controls._panUp(deltaY * scale, camera.matrix);
    };
    controls._dollyIn = scale => setEyeFov(eyeFov * scale);
    controls._dollyOut = scale => setEyeFov(eyeFov / scale);
    setEyeFov(eyeFov);
  }
  controls.update();
  if (spark) {
    spark.sortRadial = !camera.isOrthographicCamera;
    spark.sortDirty = true;
    spark.setDirty();
  }
  // A rebuilt camera or OrbitControls basis always starts unrolled.
  cameraNavigation?.resetRoll();
}

// Vertical camera FOV that makes the shorter screen side span `shortFov` degrees.
function eyeVerticalFov(shortFov, aspect) {
  if (aspect >= 1) return shortFov;
  const half = THREE.MathUtils.degToRad(shortFov / 2);
  return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(half) / aspect));
}

function setEyeFov(value) {
  eyeFov = Math.max(EYE_FOV_MIN, Math.min(EYE_FOV_MAX, value));
  if (!camera?.isPerspectiveCamera) return;
  camera.fov = eyeVerticalFov(eyeFov, camera.aspect);
  camera.updateProjectionMatrix();
  // Negative: turning the head opposite to the drag keeps the point under the pointer (screen centre)
  // following it, like grabbing the view; OrbitControls turns 2*pi*rotateSpeed per screen height.
  if (controls) controls.rotateSpeed = -Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) / Math.PI;
  frameProbe?.invalidate();
}

// Stand at `position` with world-up `up`, looking along unit `direction`, turning about the eye.
function aimEye(position, direction, up, fov) {
  cameraNavigation?.clear();
  if (camera.isOrthographicCamera) {
    replaceCamera(new THREE.PerspectiveCamera(60, camera.aspect, .003, camera.far));
  }
  camera.up.copy(up);
  camera.position.copy(position);
  controls.target.copy(position).addScaledVector(direction, EYE_PIVOT);
  camera.far = 100;
  camera.lookAt(controls.target);
  // OrbitControls caches its up basis at construction; refresh it after axis/reset changes.
  replaceCamera(camera);
  setEyeFov(fov);
  cameraNavigation?.sync();
}

// Stand at the view's real position and look along its heading with the relaxed gaze.
function setView(view, fov) {
  if (!camera) return;
  savedEye = undefined;
  const position = new THREE.Vector3().fromArray(view.position);
  const up = new THREE.Vector3().fromArray(view.up || [0, 0, 1]);
  const forward = new THREE.Vector3().fromArray(view.target).sub(position).projectOnPlane(up);
  if (forward.lengthSq() < 1e-12) forward.fromArray(view.target).sub(position);
  // A view may set its own start gaze (eye_gaze, degrees; negative looks down).
  const gaze = THREE.MathUtils.degToRad(Number.isFinite(view.eye_gaze) ? view.eye_gaze : EYE_GAZE);
  forward.normalize().multiplyScalar(Math.cos(gaze)).addScaledVector(up, Math.sin(gaze)).normalize();
  aimEye(position, forward, up, fov);
}

// Axis views are framed ahead of the eye; the eye pose is kept so "Back to perspective" returns to it.
function axisFocus() {
  if (camera.isPerspectiveCamera) {
    savedEye = { position: camera.position.clone(), up: camera.up.clone(),
      direction: controls.target.clone().sub(camera.position).normalize() };
  }
  if (!savedEye) return undefined;
  return { target: savedEye.position.clone().addScaledVector(savedEye.direction, EYE_AXIS_FOCUS), distance: EYE_AXIS_FOCUS };
}

function restoreEye() {
  if (!savedEye) { resetView(); return; }
  const { position, direction, up } = savedEye;
  savedEye = undefined;
  aimEye(position, direction, up, eyeFov);
}

function resetView() {
  const view = overview();
  setView(view, Number.isFinite(view.eye_fov) ? view.eye_fov : EYE_FOV);
}

// Turn the head (arrow keys) about the eye; positive yaw looks left, positive pitch looks up.
function turnHead(yaw, pitch) {
  if (!controls || busy || !camera.isPerspectiveCamera) return;
  controls._rotateLeft?.(-yaw);
  controls._rotateUp?.(-pitch);
  controls.update();
}

function zoom(factor) {
  if (!controls || busy) return;
  if (camera.isPerspectiveCamera) { setEyeFov(eyeFov * factor); return; }
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
  const [three, sparkModule, orbit, navigation, sky] = await Promise.all([
    import('three'), import('@sparkjsdev/spark'), import('three/addons/controls/OrbitControls.js'),
    import('./camera-navigation.js?v=20261007-eye7'), import('./sky-field.js?v=20261007-eye7')
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
  // Learned far field (sky, sun, distant ranges) behind the splats; manifests without it keep the clear colour.
  if (manifest.sky_field) {
    skyField = sky.createSkyField(THREE, manifest.sky_field, assetBaseUrl, skyQuality(variant.id, navigator));
    scene.add(skyField.mesh);
  }
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
    if (camera.isPerspectiveCamera) setEyeFov(eyeFov);
  };
  frameProbe = createFrameProbe(renderer);
  resizeObserver = new ResizeObserver(() => { resize(); frameProbe?.invalidate(); });
  resizeObserver.observe(root);
  resize();
  resetView();
  cameraNavigation = navigation.createCameraNavigation({
    THREE, root, canvas: $('canvas'), getCamera: () => camera, getControls: () => controls,
    replaceCamera, zoom, getFov: () => eyeVerticalFov(eyeFov, camera.aspect),
    getWalkSpeed: () => camera.isPerspectiveCamera ? EYE_WALK * walkSpeed : undefined,
    getAxisFocus: axisFocus, restorePerspective: restoreEye
  });
  visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  visibilityObserver.observe(root);
  renderer.setAnimationLoop((time) => {
    if (token !== generation) return;
    if (!document.hidden && visible) {
      try {
        cameraNavigation.update(time);
        renderer.render(scene, camera);
        frameProbe?.afterRender(time);
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
    else if (event.key.startsWith('Arrow') && camera.isPerspectiveCamera) {
      const step = THREE.MathUtils.degToRad(camera.fov) / 12;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') turnHead(event.key === 'ArrowLeft' ? step : -step, 0);
      else turnHead(0, event.key === 'ArrowUp' ? step : -step);
    } else if (event.key.startsWith('Arrow')) {
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
    if (!hit) return;
    // At eye level, double-click turns the head toward the point instead of orbiting it.
    if (camera.isPerspectiveCamera) {
      controls.target.copy(camera.position).add(hit.point.clone().sub(camera.position).setLength(EYE_PIVOT));
    } else controls.target.copy(hit.point);
    controls.update();
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
    if (skyField) {
      const deadline = new Promise((_, reject) => setTimeout(() => reject(new Error('Sky field timeout')), 120000));
      await Promise.race([skyField.ready, deadline]);
      if (!active()) return;
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
      pixelRatio: renderer.getPixelRatio(), skyField: Boolean(skyField),
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
  const active = Boolean(document.fullscreenElement);
  // The button swaps its enter/exit glyphs from this attribute (see viewer.css).
  $('fullscreen').dataset.active = String(active);
  $('fullscreen').title = active ? 'Exit fullscreen' : 'Fullscreen';
  $('fullscreen').setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
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
  if (!variant && manifest.status === 'awaiting-model') {
    $('start').disabled = true;
    setStartLabel('Model preparation pending');
    $('start').title = 'This local viewer has no trained model attached yet.';
    root.dataset.state = 'pending';
  } else {
    if (!variant) throw new Error('No model files are available.');
    currentVariant = variant.id;
    setupQualitySelector(variant);
    $('start').disabled = false;
    setStartLabel(startLabel(variant));
    $('start').title = isPagedVariant(variant) ? 'Streams details as you explore.' : '';
    root.dataset.variant = currentVariant;
    root.dataset.state = 'idle';
  }
} catch (error) { fail('Scene information could not load. Refresh the page to try again.', error); }
