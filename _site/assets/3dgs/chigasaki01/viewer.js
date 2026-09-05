const $ = (id) => document.getElementById(id);
const root = $('scene');
let manifest, renderer, scene, camera, controls, mesh, spark, THREE, SplatMesh;
let busy = false;
let currentVariant;
let visible = true;

function fail(message, error) {
  console.error(message, error);
  root.dataset.state = 'error';
  $('error-message').textContent = message;
  $('error').hidden = false;
  $('loading').hidden = true;
  $('welcome').hidden = true;
}

function setEnabled(enabled) {
  $('reset').disabled = !enabled;
}

function disposeScene(group) {
  if (!group) return;
  for (const child of [...group.children]) { group.remove(child); child.dispose(); }
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

function resetView() {
  if (!camera) return;
  const view = overview();
  camera.position.fromArray(view.position);
  camera.up.set(0, 0, 1);
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
  controls.update();
}

function zoom(factor) {
  if (!controls || busy) return;
  const offset = camera.position.clone().sub(controls.target);
  const length = Math.max(controls.minDistance, Math.min(controls.maxDistance, offset.length() * factor));
  camera.position.copy(controls.target).add(offset.setLength(length));
  controls.update();
}

async function setup() {
  const [three, sparkModule, orbit] = await Promise.all([
    import('three'), import('@sparkjsdev/spark'), import('three/addons/controls/OrbitControls.js')
  ]);
  THREE = three;
  SplatMesh = sparkModule.SplatMesh;
  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x192732, 1);
  $('canvas').appendChild(renderer.domElement);
  renderer.domElement.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    fail('The graphics context was lost. Reload the scene to try again.');
  });
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, 1, .003, 100);
  camera.up.set(0, 0, 1); // The exported model and camera poses share Nerfstudio's Z-up coordinates.
  controls = new orbit.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false;
  controls.minDistance = .015;
  controls.maxDistance = 8;
  controls.zoomSpeed = .8;
  controls.panSpeed = .8;
  spark = new sparkModule.SparkRenderer({ renderer });
  scene.add(spark);
  const resize = () => {
    const width = root.clientWidth, height = root.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(root);
  resize();
  resetView();
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(root);
  renderer.setAnimationLoop(() => {
    if (!document.hidden && visible) renderer.render(scene, camera);
  });
  $('canvas').addEventListener('keydown', (event) => {
    if (busy || !mesh) return;
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
  renderer.domElement.addEventListener('pointerdown', () => $('canvas').focus({ preventScroll: true }));
  renderer.domElement.addEventListener('dblclick', (event) => {
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
  if (busy) return;
  busy = true;
  setEnabled(false);
  $('error').hidden = true;
  $('welcome').hidden = true;
  $('loading').hidden = false;
  $('progress').textContent = 'Preparing 3D scene…';
  root.dataset.state = 'loading';
  let candidate;
  try {
    if (!renderer) await setup();
    if (mesh) { scene.remove(mesh); disposeScene(mesh); mesh = undefined; }
    const variant = manifest.variants.find((item) => item.id === variantId);
    if (!variant) throw new Error('Unknown model variant');
    candidate = new THREE.Group();
    const files = variant.files || [{file: variant.file, bytes: variant.bytes}];
    let completedBytes = 0;
    // Spatial chunks keep each GitHub-hosted file small. Spark sorts the meshes together.
    for (const file of files) {
      const part = new SplatMesh({
        url: new URL(file.file, location.href).href,
        extSplats: true,
        lod: true,
        onProgress: (event) => {
          const loaded = completedBytes + Math.min(event.loaded, file.bytes);
          const percent = Math.min(100, Math.round(100*loaded/variant.bytes));
          $('progress').textContent = percent < 100 ? `Downloading scene ${percent}%` : 'Preparing 3D details…';
        }
      });
      part.scale.setScalar(variant.render_scale ?? 1);
      candidate.add(part);
      await part.initialized;
      completedBytes += file.bytes;
    }
    mesh = candidate;
    scene.add(mesh);
    currentVariant = variant.id;
    $('loading').hidden = true;
    root.dataset.state = 'ready';
    root.dataset.variant = currentVariant;
    root.dataset.splats = String(variant.count ?? '');
    setEnabled(true);
  } catch (error) {
    disposeScene(candidate);
    fail('The scene could not load. Check your connection and try again.', error);
  } finally { busy = false; }
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
window.addEventListener('pagehide', (event) => {
  if (event.persisted) return; // Back/forward cache restores this live WebGL scene.
  renderer?.setAnimationLoop(null);
  controls?.dispose();
  disposeScene(mesh);
  spark?.dispose();
  renderer?.dispose();
});

try {
  const response = await fetch('scene.json');
  if (!response.ok) throw new Error(`Manifest HTTP ${response.status}`);
  manifest = await response.json();
  if (manifest.poster) root.style.backgroundImage = `url("${new URL(manifest.poster, location.href).href}")`;
  $('model-label').textContent = `Test snapshot · Step ${manifest.step.toLocaleString('en-US')}`;
  const variant = manifest.variants.find((item) => item.id === 'full') || manifest.variants[0];
  if (!variant) throw new Error('No model files are available.');
  currentVariant = variant.id;
  $('start').disabled = false;
  $('start').textContent = `Download ~${Math.round(variant.bytes / 1e6)} MB`;
  root.dataset.state = 'idle';
} catch (error) { fail('Scene information could not load. Refresh the page to try again.', error); }
