import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

(function () {
  const container = document.getElementById('stl-viewer-container');
  if (!container) return;

  const baseUrl = container.dataset.baseurl || '';
  const SCALE = 1000;

  // --- Scene setup ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf7f8fa);

  const width = container.clientWidth;
  const height = 500;
  container.style.height = height + 'px';
  container.style.position = 'relative';

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10000);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);

  // --- Lighting ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight1.position.set(1, 1, 1);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
  dirLight2.position.set(-1, -0.5, -1);
  scene.add(dirLight2);

  const dirLight3 = new THREE.DirectionalLight(0xaaccff, 0.3);
  dirLight3.position.set(0, -1, 0.5);
  scene.add(dirLight3);

  // --- Controls (TrackballControls for free rotation around a point) ---
  const controls = new TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 3.0;
  controls.panSpeed = 0.8;
  controls.noZoom = true;       // disable scroll zoom so page can scroll
  controls.noPan = false;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.12;

  // --- Zoom buttons ---
  const btnStyle = 'position:absolute;width:32px;height:32px;border:1px solid #ccc;border-radius:4px;background:rgba(255,255,255,0.9);font-size:18px;line-height:30px;text-align:center;cursor:pointer;user-select:none;color:#333;';

  const zoomInBtn = document.createElement('div');
  zoomInBtn.textContent = '+';
  zoomInBtn.style.cssText = btnStyle + 'top:10px;right:10px;';
  container.appendChild(zoomInBtn);

  const zoomOutBtn = document.createElement('div');
  zoomOutBtn.textContent = '\u2212';
  zoomOutBtn.style.cssText = btnStyle + 'top:48px;right:10px;';
  container.appendChild(zoomOutBtn);

  const resetBtn = document.createElement('div');
  resetBtn.textContent = '\u27F3';
  resetBtn.style.cssText = btnStyle + 'top:86px;right:10px;font-size:20px;';
  resetBtn.title = 'Reset view';
  container.appendChild(resetBtn);

  let savedCamPos = null;
  let savedCamUp = null;
  let savedTarget = null;

  zoomInBtn.addEventListener('click', function () {
    camera.position.lerp(controls.target, 0.2);
    controls.update();
  });
  zoomOutBtn.addEventListener('click', function () {
    const dir = camera.position.clone().sub(controls.target);
    dir.multiplyScalar(1.3);
    camera.position.copy(controls.target).add(dir);
    controls.update();
  });
  resetBtn.addEventListener('click', function () {
    if (savedCamPos && savedTarget) {
      camera.position.copy(savedCamPos);
      camera.up.copy(savedCamUp);
      controls.target.copy(savedTarget);
      controls.update();
    }
  });

  // --- Materials ---
  const mandibleMaterial = new THREE.MeshStandardMaterial({
    color: 0x2f3437,
    roughness: 0.65,
    metalness: 0.0,
    flatShading: false
  });

  // Stylish glassy water material
  const waterMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x72c7f2,
    metalness: 0.0,
    roughness: 0.03,
    transmission: 0.4,
    thickness: 0.5,
    ior: 1.333,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
    envMapIntensity: 0.6
  });

  // --- Load STL files ---
  const loader = new STLLoader();
  const stlFiles = [
    { file: 'mandibleconfig0.stl', material: mandibleMaterial },
    { file: 'mandibleconfig1.stl', material: mandibleMaterial },
    { file: 'mandibleconfig2.stl', material: mandibleMaterial },
    { file: 'water_surface0.stl', material: waterMaterial }
  ];

  const allMeshes = [];
  let loadedCount = 0;

  stlFiles.forEach(function (item) {
    const url = baseUrl + '/assets/stl/mandible_simu/' + item.file;
    loader.load(
      url,
      function (geometry) {
        geometry.computeVertexNormals();
        geometry.scale(SCALE, SCALE, SCALE);
        const mesh = new THREE.Mesh(geometry, item.material);
        scene.add(mesh);
        allMeshes.push(mesh);
        loadedCount++;

        if (loadedCount === stlFiles.length) {
          fitCameraToScene();
        }
      },
      undefined,
      function (err) {
        console.error('Error loading ' + item.file, err);
        loadedCount++;
        if (loadedCount === stlFiles.length) {
          fitCameraToScene();
        }
      }
    );
  });

  function fitCameraToScene() {
    const box = new THREE.Box3();
    allMeshes.forEach(function (mesh) {
      box.expandByObject(mesh);
    });

    const center = new THREE.Vector3();
    box.getCenter(center);

    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraDistance = (maxDim / 2) / Math.tan(fov / 2);
    cameraDistance *= 1.4;

    camera.position.set(
      center.x - cameraDistance * 0.8,
      center.y + cameraDistance * 0.6,
      center.z - cameraDistance * 0.8
    );
    camera.near = maxDim * 0.01;
    camera.far = maxDim * 50;
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.update();

    // save for reset
    savedCamPos = camera.position.clone();
    savedCamUp = camera.up.clone();
    savedTarget = controls.target.clone();

    // hide loading
    const ld = document.getElementById('stl-loading');
    if (ld) ld.style.display = 'none';
  }

  // --- Animation loop ---
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // --- Handle resize ---
  window.addEventListener('resize', function () {
    const w = container.clientWidth;
    const h = 500;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    controls.handleResize();
  });

  // --- Loading indicator ---
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'stl-loading';
  loadingDiv.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:sans-serif;font-size:14px;color:#888;';
  loadingDiv.textContent = 'Loading 3D model...';
  container.appendChild(loadingDiv);
})();
