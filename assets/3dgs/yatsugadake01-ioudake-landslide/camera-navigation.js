const AXES = {
  '+X': [1, 0, 0], '-X': [-1, 0, 0],
  '+Y': [0, 1, 0], '-Y': [0, -1, 0],
  '+Z': [0, 0, 1], '-Z': [0, 0, -1],
};

export function axisCamera(THREE, camera, target, axis) {
  if (!AXES[axis]) throw new Error('Unknown camera axis');
  const distance = Math.max(.015, camera.position.distanceTo(target));
  const halfHeight = camera.isOrthographicCamera
    ? (camera.top - camera.bottom) / (2 * camera.zoom)
    : distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const aspect = camera.aspect;
  const next = new THREE.OrthographicCamera(-halfHeight * aspect, halfHeight * aspect,
    halfHeight, -halfHeight, camera.near, camera.far);
  next.aspect = aspect;
  next.position.copy(target).addScaledVector(new THREE.Vector3(...AXES[axis]), distance);
  // Top/bottom views need an up vector perpendicular to Z, including OrbitControls' basis.
  next.up.set(0, axis.endsWith('Z') ? 1 : 0, axis.endsWith('Z') ? 0 : 1);
  next.lookAt(target);
  next.updateMatrixWorld();
  return next;
}

export function moveCamera(THREE, camera, target, keys, seconds) {
  const forward = Number(keys.has('w')) - Number(keys.has('s'));
  const right = Number(keys.has('d')) - Number(keys.has('a'));
  if ((!forward && !right) || seconds <= 0) return false;
  const delta = new THREE.Vector3(right, 0, -forward).normalize().applyQuaternion(camera.quaternion);
  const distance = Math.max(.015, camera.position.distanceTo(target));
  // Cap elapsed time so returning to a hidden tab cannot cause a large jump.
  delta.multiplyScalar(distance * .8 * Math.min(seconds, .05));
  camera.position.add(delta);
  target.add(delta);
  return true;
}

export function createCameraNavigation({ THREE, root, canvas, getCamera, getControls,
  replaceCamera, getFov }) {
  const panel = document.createElement('nav');
  panel.className = 'view-navigation';
  panel.setAttribute('aria-label', 'Camera views');
  panel.innerHTML = `
    <output class="view-name" aria-live="polite">Perspective</output>
    <div class="view-cube-stage" aria-hidden="true"><div class="view-cube">
      ${Object.keys(AXES).map(axis => `<button type="button" class="cube-face axis-${axis[1].toLowerCase()} face-${axis[0] === '+' ? 'positive' : 'negative'}-${axis[1].toLowerCase()}" data-axis="${axis}" tabindex="-1" disabled>${axis}</button>`).join('')}
    </div></div>
    <div class="axis-buttons">
      ${['+X', '+Y', '+Z', '-X', '-Y', '-Z'].map(axis => `<button type="button" class="axis-${axis[1].toLowerCase()}" data-axis="${axis}" aria-label="View from ${axis}, orthographic" aria-pressed="false" title="Look toward the current target from ${axis}" disabled>${axis}</button>`).join('')}
    </div>
    <button type="button" class="perspective-view" disabled>Perspective</button>`;
  const disclosure = root.querySelector('.camera-controls');
  const host = root.querySelector('.camera-axis-host');
  const status = root.querySelector('.camera-controls-status');
  if (host) host.replaceChildren(panel);
  else root.appendChild(panel);
  const name = panel.querySelector('.view-name');
  const cube = panel.querySelector('.view-cube');
  const perspective = panel.querySelector('.perspective-view');
  const keys = new Set();
  const pointerKeys = new Map();
  const moveButtons = [...root.querySelectorAll('[data-move]')];
  const activeKeys = () => new Set([...keys, ...pointerKeys.values()]);
  const showKeys = () => {
    const active = activeKeys();
    moveButtons.forEach(button => button.classList.toggle('is-active', active.has(button.dataset.move)));
  };
  const events = new AbortController();
  const listen = (el, type, fn) => el.addEventListener(type, fn, { signal: events.signal });
  let enabled = false, lastTime;

  const clear = () => { keys.clear(); pointerKeys.clear(); lastTime = undefined; showKeys(); };
  const sync = () => {
    const camera = getCamera(), controls = getControls();
    const direction = camera.position.clone().sub(controls.target).normalize();
    const aligned = camera.isOrthographicCamera
      ? Object.keys(AXES).find(axis => direction.dot(new THREE.Vector3(...AXES[axis])) > 1 - 1e-10)
      : undefined;
    const label = camera.isOrthographicCamera ? `${aligned ? aligned + ' · ' : ''}Orthographic` : 'Perspective';
    if (name.textContent !== label) name.textContent = label;
    root.dataset.cameraView = aligned || (camera.isOrthographicCamera ? 'orthographic' : 'perspective');
    panel.querySelectorAll('[data-axis]').forEach(button => {
      button.disabled = !enabled;
      if (button.hasAttribute('aria-pressed')) button.setAttribute('aria-pressed', String(button.dataset.axis === aligned));
    });
    perspective.disabled = !enabled || !camera.isOrthographicCamera;
    moveButtons.forEach(button => { button.disabled = !enabled; });
    // World Z stays Z; only flip CSS's downwards Y at input and output.
    const matrix = new THREE.Matrix4().makeRotationFromQuaternion(camera.quaternion.clone().invert());
    const signs = [1, -1, 1, 1];
    cube.style.transform = `matrix3d(${matrix.elements.map((value, i) => value * signs[i % 4] * signs[Math.floor(i / 4)]).join(',')})`;
  };

  listen(panel, 'click', event => {
    if (!enabled) return;
    const button = event.target.closest('[data-axis]');
    if (!button) return;
    clear();
    replaceCamera(axisCamera(THREE, getCamera(), getControls().target, button.dataset.axis));
    sync();
    canvas.focus({ preventScroll: true });
  });
  listen(perspective, 'click', () => {
    const old = getCamera();
    if (!enabled || !old.isOrthographicCamera) return;
    clear();
    const target = getControls().target;
    const fov = getFov();
    const distance = (old.top - old.bottom) / (2 * old.zoom * Math.tan(THREE.MathUtils.degToRad(fov / 2)));
    const next = new THREE.PerspectiveCamera(fov, old.aspect, old.near, old.far);
    next.position.copy(target).add(old.position.clone().sub(target).setLength(distance));
    next.up.copy(old.up);
    next.lookAt(target);
    replaceCamera(next);
    sync();
    canvas.focus({ preventScroll: true });
  });
  listen(canvas, 'keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) { clear(); return; }
    const key = event.key.toLowerCase();
    if (!enabled || !['w', 'a', 's', 'd'].includes(key)) return;
    const firstPress = !keys.has(key) && !event.repeat;
    keys.add(key);
    // A short tap must move too, even if keyup arrives before the next render frame.
    if (firstPress && keys.size === 1) {
      moveCamera(THREE, getCamera(), getControls().target, activeKeys(), .02);
      getControls().update();
    }
    showKeys();
    event.preventDefault();
  });
  listen(window, 'keyup', event => { keys.delete(event.key.toLowerCase()); showKeys(); });
  moveButtons.forEach(button => {
    listen(button, 'pointerdown', event => {
      if (!enabled || event.button !== 0) return;
      event.preventDefault();
      canvas.focus({ preventScroll: true });
      button.setPointerCapture(event.pointerId);
      pointerKeys.set(event.pointerId, button.dataset.move);
      moveCamera(THREE, getCamera(), getControls().target, activeKeys(), .02);
      getControls().update();
      showKeys();
    });
    listen(button, 'lostpointercapture', event => { pointerKeys.delete(event.pointerId); showKeys(); });
    listen(button, 'click', event => {
      // Enter/Space and assistive-technology activation get a single movement step.
      if (!enabled || event.detail !== 0) return;
      moveCamera(THREE, getCamera(), getControls().target, new Set([button.dataset.move]), .04);
      getControls().update();
    });
  });
  for (const type of ['pointerup', 'pointercancel']) {
    listen(window, type, event => { pointerKeys.delete(event.pointerId); showKeys(); });
  }
  listen(canvas, 'blur', clear);
  listen(window, 'blur', clear);
  listen(document, 'visibilitychange', clear);
  if (disclosure) {
    listen(disclosure, 'toggle', () => { if (!disclosure.open) clear(); });
  }
  sync();
  return {
    sync,
    clear,
    setEnabled(value) {
      enabled = value;
      if (!value) clear();
      if (status) status.textContent = value
        ? 'Click scene for keys, or hold the movement buttons.'
        : 'Load the model to enable camera movement.';
      sync();
    },
    update(time) {
      if (!enabled || document.hidden || document.activeElement !== canvas) { clear(); return; }
      const seconds = lastTime === undefined ? 0 : (time - lastTime) / 1000;
      lastTime = time;
      if (moveCamera(THREE, getCamera(), getControls().target, activeKeys(), seconds)) getControls().update();
    },
    dispose() { clear(); events.abort(); panel.remove(); },
  };
}
