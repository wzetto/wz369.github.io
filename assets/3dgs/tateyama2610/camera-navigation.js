const AXES = {
  '+X': [1, 0, 0], '-X': [-1, 0, 0],
  '+Y': [0, 1, 0], '-Y': [0, -1, 0],
  '+Z': [0, 0, 1], '-Z': [0, 0, -1],
};
const ROLL_SPEED = Math.PI / 2, ROLL_STEP = Math.PI / 12;
// Like Apple Maps, a pinch must twist this far before the view starts to rotate.
const TWIST_THRESHOLD = Math.PI / 20, LEVEL_THRESHOLD = Math.PI / 360;
const wrapAngle = angle => angle - 2 * Math.PI * Math.ceil((angle - Math.PI) / (2 * Math.PI));

// `focus` ({target, distance}) frames the axis view at scene scale when the perspective camera
// turns about a pivot right at the eye; otherwise the current orbit target and distance are used.
export function axisCamera(THREE, camera, target, axis, focus) {
  if (!AXES[axis]) throw new Error('Unknown camera axis');
  if (focus) target = focus.target;
  const distance = Math.max(.015, focus ? focus.distance : camera.position.distanceTo(target));
  const halfHeight = camera.isOrthographicCamera && !focus
    ? (camera.top - camera.bottom) / (2 * camera.zoom)
    : distance * Math.tan(THREE.MathUtils.degToRad((focus ? 90 : camera.fov) / 2));
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

// With `speed` (eye-level walking, scene units per second) the step stays level so the eye
// height is kept; without it the step scales with the orbit distance as before.
export function moveCamera(THREE, camera, target, keys, seconds, speed) {
  const forward = Number(keys.has('w')) - Number(keys.has('s'));
  const right = Number(keys.has('d')) - Number(keys.has('a'));
  if ((!forward && !right) || seconds <= 0) return false;
  let delta;
  if (speed) {
    // Level walking from the unrolled aim, so a rolled screen still strafes sideways.
    const ahead = target.clone().sub(camera.position).projectOnPlane(camera.up);
    if (ahead.lengthSq() < 1e-12) return false;
    ahead.normalize();
    const side = ahead.clone().cross(camera.up).normalize();
    delta = ahead.multiplyScalar(forward).addScaledVector(side, right);
    if (delta.lengthSq() < 1e-12) return false;
    delta.normalize();
  } else delta = new THREE.Vector3(right, 0, -forward).normalize().applyQuaternion(camera.quaternion);
  const distance = Math.max(.015, camera.position.distanceTo(target));
  // Cap elapsed time so returning to a hidden tab cannot cause a large jump.
  delta.multiplyScalar((speed || distance * .8) * Math.min(seconds, .05));
  camera.position.add(delta);
  target.add(delta);
  return true;
}

// Roll is a pure screen-space twist applied after OrbitControls aims the camera. camera.up and the
// controls' orbit basis stay on the world up, so orbiting a rolled view never tilts the horizon.
// Positive angles turn the rendered image clockwise about the viewing axis.
export function applyRoll(camera, target, roll) {
  camera.lookAt(target);
  if (roll) camera.rotateZ(roll);
  camera.updateMatrixWorld();
}

// OrbitControls turns a horizontal drag about world up. Rotate drag deltas into the level frame so the
// scene still follows the pointer on a rolled screen; panning already follows it through camera.matrix.
// With `turnInView(dx, dy)` a one-finger touch drag instead turns about the current view's own axes
// (screen up / screen right), so the touched content follows the finger; it returns false to fall back.
const followingRoll = new WeakSet();
export function followRoll(controls, getRoll, turnInView) {
  if (!controls || followingRoll.has(controls) || !controls._rotateStart
    || typeof controls._rotateLeft !== 'function' || typeof controls._getSecondPointerPosition !== 'function') return;
  followingRoll.add(controls);
  const turn = (x, y) => {
    const roll = getRoll(), cos = Math.cos(roll), sin = Math.sin(roll);
    const dx = x - controls._rotateStart.x, dy = y - controls._rotateStart.y;
    const scale = 2 * Math.PI * controls.rotateSpeed / Math.max(1, controls.domElement.clientHeight);
    controls._rotateLeft(scale * (cos * dx + sin * dy));
    controls._rotateUp(scale * (cos * dy - sin * dx));
    controls._rotateStart.set(x, y);
  };
  // Same inputs and update calls as three r180's handlers; only the delta is rotated.
  controls._handleMouseMoveRotate = event => { turn(event.clientX, event.clientY); controls.update(); };
  controls._handleTouchMoveRotate = event => {
    if (controls._pointers.length === 1) {
      const dx = event.pageX - controls._rotateStart.x, dy = event.pageY - controls._rotateStart.y;
      if (turnInView?.(dx, dy)) { controls._rotateStart.set(event.pageX, event.pageY); return; }
      turn(event.pageX, event.pageY);
      return;
    }
    const other = controls._getSecondPointerPosition(event);
    turn((event.pageX + other.x) / 2, (event.pageY + other.y) / 2);
  };
}

// Screen-space angle between the view's level horizon and the current one; undefined looking along baseUp.
// Kept for diagnostics: it should always equal the navigation's roll after applyRoll.
export function cameraRoll(THREE, camera, baseUp) {
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  const level = baseUp.clone().projectOnPlane(forward);
  if (!(level.lengthSq() > 1e-8)) return undefined;
  const angle = -Math.atan2(forward.dot(level.clone().cross(up)), level.dot(up));
  return Number.isFinite(angle) ? wrapAngle(angle) : undefined;
}

export function createCameraNavigation({ THREE, root, canvas, getCamera, getControls,
  replaceCamera, zoom, getFov, getWalkSpeed, getAxisFocus, restorePerspective }) {
  const panel = document.createElement('div');
  panel.className = 'view-navigation';
  panel.setAttribute('role', 'group');
  panel.setAttribute('aria-label', 'Camera views');
  panel.innerHTML = `
    <output class="view-name" aria-live="polite">Perspective</output>
    <div class="view-cube-stage" aria-hidden="true"><div class="view-cube">
      ${Object.keys(AXES).map(axis => `<button type="button" class="cube-face axis-${axis[1].toLowerCase()} face-${axis[0] === '+' ? 'positive' : 'negative'}-${axis[1].toLowerCase()}" data-axis="${axis}" tabindex="-1" disabled>${axis}</button>`).join('')}
    </div></div>
    <div class="axis-buttons">
      ${['+X', '+Y', '+Z', '-X', '-Y', '-Z'].map(axis => `<button type="button" class="axis-${axis[1].toLowerCase()}" data-axis="${axis}" aria-label="View from ${axis}, orthographic" aria-pressed="false" title="Look toward the current target from ${axis}" disabled>${axis}</button>`).join('')}
    </div>
    <button type="button" class="perspective-view" title="Return to the perspective camera" hidden disabled>Back to perspective</button>`;
  const disclosure = root.querySelector('.camera-controls');
  const host = root.querySelector('.camera-axis-host');
  const status = root.querySelector('.camera-controls-status');
  const placeholder = host ? [...host.childNodes] : [];
  if (host) host.replaceChildren(panel);
  else root.appendChild(panel);
  const name = panel.querySelector('.view-name');
  const cube = panel.querySelector('.view-cube');
  const perspective = panel.querySelector('.perspective-view');
  const keys = new Set();
  const pointerKeys = new Map();
  const moveButtons = [...root.querySelectorAll('[data-move]')];
  const rollButtons = [...root.querySelectorAll('[data-roll]')];
  const level = root.querySelector('#level-view');
  const levelIcon = level?.querySelector('svg');
  const rollKey = button => button.dataset.roll === 'cw' ? 'e' : 'q';
  const activeKeys = () => new Set([...keys, ...pointerKeys.values()]);
  const showKeys = () => {
    const active = activeKeys();
    moveButtons.forEach(button => button.classList.toggle('is-active', active.has(button.dataset.move)));
    rollButtons.forEach(button => button.classList.toggle('is-active', active.has(rollKey(button))));
  };
  const events = new AbortController();
  const listen = (el, type, fn, options) => el.addEventListener(type, fn, { ...options, signal: events.signal });
  const touches = new Map();
  const touchOnly = matchMedia('(pointer: coarse) and (hover: none)');
  let enabled = false, lastTime, roll = 0, rollAnimation, rollHold, twist, gesture, drag, shownRoll, labelTime = -Infinity;

  const clear = () => { keys.clear(); pointerKeys.clear(); rollHold = undefined; lastTime = undefined; showKeys(); };
  // Re-aim every frame: OrbitControls.update() always ends in lookAt, which drops the screen-space roll.
  const aim = () => applyRoll(getCamera(), getControls().target, roll);
  const orient = () => {
    aim();
    // World Z stays Z; only flip CSS's downwards Y at input and output.
    const matrix = new THREE.Matrix4().makeRotationFromQuaternion(getCamera().quaternion.clone().invert());
    const signs = [1, -1, 1, 1];
    cube.style.transform = `matrix3d(${matrix.elements.map((value, i) => value * signs[i % 4] * signs[Math.floor(i / 4)]).join(',')})`;
  };
  const adopt = () => followRoll(getControls(), () => roll, turnInView);
  const rolling = () => Boolean(rollAnimation || rollHold || drag || twist?.engaged || gesture?.engaged
    || keys.has('q') || keys.has('e'));
  const showRoll = (time = performance.now(), force = false) => {
    if (!level) return;
    const hide = !enabled || Math.abs(roll) < LEVEL_THRESHOLD;
    const appearing = level.hidden && !hide;
    if (level.hidden !== hide) level.hidden = hide;
    if (hide) return;
    if (shownRoll !== roll) { shownRoll = roll; levelIcon.style.transform = `rotate(${roll.toFixed(4)}rad)`; }
    if (!force && !appearing && time - labelTime < 250) return;
    const degrees = Math.round(THREE.MathUtils.radToDeg(Math.abs(roll)));
    const label = `Level view (rolled ${degrees}° ${roll > 0 ? 'clockwise' : 'counter-clockwise'})`;
    if (level.getAttribute('aria-label') !== label) level.setAttribute('aria-label', label);
    labelTime = time;
  };
  const setRoll = value => {
    if (!Number.isFinite(value)) return;
    roll = wrapAngle(value);
    orient();
  };
  const rollBy = angle => { if (enabled && angle && Number.isFinite(angle)) setRoll(roll + angle); };
  // One-finger touch look-around about the view's own axes (user requirement 2026-10-06: the turn axis must lie
  // in the current view, not world up). Drag sign as the mouse: the touched content follows the finger. The
  // horizon may tilt as a result; the level button straightens it. Steps that would pass within 2 degrees of
  // straight up/down are dropped (roll is undefined there). Orthographic views keep OrbitControls' orbit.
  const VIEW_TURN_LIMIT = Math.sin(THREE.MathUtils.degToRad(88));
  const turnInView = (dx, dy) => {
    const camera = getCamera(), controls = getControls();
    if (!enabled || !camera.isPerspectiveCamera) return false;
    if (!dx && !dy) return true;
    const k = -2 * Math.PI * controls.rotateSpeed / Math.max(1, controls.domElement.clientHeight);
    const q = camera.quaternion.clone()
      .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), k * dx))
      .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), k * dy));
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(q);
    if (Math.abs(forward.dot(camera.up)) > VIEW_TURN_LIMIT) return true;
    const next = cameraRoll(THREE, { quaternion: q }, camera.up);
    if (next === undefined) return true;
    const pivot = camera.position.distanceTo(controls.target);
    controls.target.copy(camera.position).addScaledVector(forward, pivot);
    rollAnimation = undefined;
    setRoll(next);
    return true;
  };
  const userRoll = angle => { rollAnimation = undefined; rollBy(angle); };
  // A continuous roll (keys, twist, Option-drag, trackpad) that ends within the level threshold snaps level,
  // because the dial is hidden there and could not straighten the last fraction of a degree.
  const settleLevel = () => {
    if (roll && Math.abs(roll) < LEVEL_THRESHOLD && !rolling()) setRoll(0);
  };
  const animateRoll = (to, duration) => {
    rollAnimation = undefined;
    if (!enabled) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRoll(to);
      showRoll(undefined, true);
      return;
    }
    rollAnimation = { from: roll, to, start: performance.now(), duration };
  };
  const stepRoll = direction => animateRoll((rollAnimation?.to ?? roll) + direction * ROLL_STEP, 160);
  const stepRollAnimation = time => {
    if (!rollAnimation) return;
    const { from, to, start, duration } = rollAnimation;
    const t = Math.min(1, Math.max(0, (time - start) / duration));
    if (t < 1) { setRoll(from + (to - from) * (1 - (1 - t) ** 3)); return; }
    rollAnimation = undefined;
    setRoll(to);
  };
  const resetRoll = () => {
    rollAnimation = rollHold = undefined;
    roll = 0;
    adopt();
    showRoll(undefined, true);
  };
  const statusText = () => !enabled ? 'Load the scene to use these controls.'
    : touchOnly.matches ? 'Touch and hold an arrow to move.' : 'Click the scene to use the keys.';
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
    // Only offered from an axis view, so "Perspective" is never shown twice.
    perspective.hidden = !camera.isOrthographicCamera;
    perspective.disabled = !enabled || !camera.isOrthographicCamera;
    moveButtons.forEach(button => { button.disabled = !enabled; });
    rollButtons.forEach(button => { button.disabled = !enabled; });
    if (status && status.textContent !== statusText()) status.textContent = statusText();
    orient();
  };

  listen(panel, 'click', event => {
    if (!enabled) return;
    const button = event.target.closest('[data-axis]');
    if (!button) return;
    clear();
    replaceCamera(axisCamera(THREE, getCamera(), getControls().target, button.dataset.axis, getAxisFocus?.()));
    sync();
    canvas.focus({ preventScroll: true });
  });
  listen(perspective, 'click', () => {
    const old = getCamera();
    if (!enabled || !old.isOrthographicCamera) return;
    clear();
    if (restorePerspective) { restorePerspective(); sync(); canvas.focus({ preventScroll: true }); return; }
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
    if (!enabled || !['w', 'a', 's', 'd', 'q', 'e'].includes(key)) return;
    const firstPress = !keys.has(key) && !event.repeat;
    const spinning = keys.has('q') || keys.has('e');
    keys.add(key);
    // A short tap must move or roll too, even if keyup arrives before the next render frame.
    if (key === 'q' || key === 'e') {
      if (firstPress && !spinning) userRoll((key === 'e' ? 1 : -1) * ROLL_SPEED * .02);
    } else if (firstPress && keys.size === 1) {
      moveCamera(THREE, getCamera(), getControls().target, activeKeys(), .02, getWalkSpeed?.());
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
      moveCamera(THREE, getCamera(), getControls().target, activeKeys(), .02, getWalkSpeed?.());
      getControls().update();
      showKeys();
    });
    listen(button, 'lostpointercapture', event => { pointerKeys.delete(event.pointerId); showKeys(); });
    listen(button, 'click', event => {
      // Enter/Space and assistive-technology activation get a single movement step.
      if (!enabled || event.detail !== 0) return;
      moveCamera(THREE, getCamera(), getControls().target, new Set([button.dataset.move]), .04, getWalkSpeed?.());
      getControls().update();
    });
  });
  rollButtons.forEach(button => {
    const direction = button.dataset.roll === 'cw' ? 1 : -1;
    listen(button, 'pointerdown', event => {
      if (!enabled || event.button !== 0) return;
      event.preventDefault();
      canvas.focus({ preventScroll: true });
      button.setPointerCapture(event.pointerId);
      rollHold = { pointerId: event.pointerId, direction, next: performance.now() + 450 };
      stepRoll(direction);
    });
    listen(button, 'lostpointercapture', event => { if (rollHold?.pointerId === event.pointerId) rollHold = undefined; });
    listen(button, 'click', event => { if (enabled && event.detail === 0) stepRoll(direction); });
  });
  if (level) {
    listen(level, 'click', () => {
      if (!enabled) return;
      animateRoll(0, 300);
      canvas.focus({ preventScroll: true });
    });
  }
  // Capture-phase listeners see pointers before OrbitControls, which keeps its two-finger dolly and pan.
  const pointerAngle = event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2, y = event.clientY - rect.top - rect.height / 2;
    return Math.hypot(x, y) < 12 ? undefined : Math.atan2(y, x);
  };
  const touchAngle = () => { const [a, b] = touches.values(); return Math.atan2(b.y - a.y, b.x - a.x); };
  const trackTouches = () => { twist = touches.size === 2 ? { angle: touchAngle(), total: 0, engaged: false } : undefined; };
  const endPointer = event => {
    if (touches.delete(event.pointerId)) trackTouches();
    if (drag?.pointerId === event.pointerId) drag = undefined;
  };
  listen(canvas, 'pointerdown', event => {
    if (event.pointerType === 'touch') {
      touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
      trackTouches();
      return;
    }
    if (!enabled || !event.altKey || event.button !== 0) return;
    // Option-drag rolls around the canvas centre instead of orbiting.
    event.stopPropagation();
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(event.pointerId);
    rollAnimation = undefined;
    drag = { pointerId: event.pointerId, angle: pointerAngle(event) };
  }, { capture: true });
  listen(canvas, 'pointermove', event => {
    if (event.pointerType === 'touch') {
      if (!touches.has(event.pointerId)) return;
      touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (!twist) return;
      const angle = touchAngle(), delta = wrapAngle(angle - twist.angle);
      twist.angle = angle;
      twist.total += delta;
      if (!twist.engaged && Math.abs(twist.total) < TWIST_THRESHOLD) return;
      twist.engaged = true;
      userRoll(delta);
    } else if (drag?.pointerId === event.pointerId) {
      event.stopPropagation();
      const angle = pointerAngle(event);
      if (angle !== undefined && drag.angle !== undefined) userRoll(wrapAngle(angle - drag.angle));
      drag.angle = angle;
    }
  }, { capture: true });
  listen(canvas, 'lostpointercapture', event => { if (drag?.pointerId === event.pointerId) drag = undefined; });
  for (const type of ['pointerup', 'pointercancel']) {
    listen(window, type, event => {
      pointerKeys.delete(event.pointerId);
      if (rollHold?.pointerId === event.pointerId) rollHold = undefined;
      endPointer(event);
      showKeys();
    }, { capture: true });
  }
  if ('GestureEvent' in window) {
    // Safari trackpads report pinches as gesture events instead of ctrl+wheel; iOS touches are handled above.
    listen(canvas, 'gesturestart', event => {
      event.preventDefault();
      gesture = touches.size ? undefined : { rotation: 0, scale: 1, engaged: false };
    });
    listen(canvas, 'gesturechange', event => {
      event.preventDefault();
      const rotation = THREE.MathUtils.degToRad(event.rotation);
      if (!gesture || touches.size || !Number.isFinite(rotation)) return;
      if (enabled && event.scale > 0 && Number.isFinite(event.scale)) {
        if (event.scale !== gesture.scale) zoom?.(gesture.scale / event.scale);
        gesture.scale = event.scale;
      }
      const delta = rotation - gesture.rotation;
      gesture.rotation = rotation;
      if (!gesture.engaged && Math.abs(rotation) < TWIST_THRESHOLD) return;
      gesture.engaged = true;
      userRoll(delta);
    });
    listen(canvas, 'gestureend', event => { event.preventDefault(); gesture = undefined; });
  }
  listen(canvas, 'blur', clear);
  listen(window, 'blur', clear);
  listen(document, 'visibilitychange', clear);
  if (disclosure) {
    listen(disclosure, 'toggle', () => { if (!disclosure.open) clear(); });
  }
  listen(touchOnly, 'change', () => { if (status) status.textContent = statusText(); });
  adopt();
  sync();
  return {
    sync,
    clear,
    resetRoll,
    setEnabled(value) {
      enabled = value;
      if (!value) { clear(); rollAnimation = undefined; }
      sync();
      showRoll(undefined, true);
    },
    update(time) {
      aim();
      stepRollAnimation(time);
      settleLevel();
      showRoll(time);
      if (!enabled || document.hidden || document.activeElement !== canvas) { clear(); return; }
      const seconds = lastTime === undefined ? 0 : (time - lastTime) / 1000;
      lastTime = time;
      const active = activeKeys();
      if (moveCamera(THREE, getCamera(), getControls().target, active, seconds, getWalkSpeed?.())) getControls().update();
      const spin = Number(active.has('e')) - Number(active.has('q'));
      if (spin && seconds > 0) userRoll(spin * ROLL_SPEED * Math.min(seconds, .05));
      if (rollHold && time >= rollHold.next) {
        rollHold.next = time + 200;
        stepRoll(rollHold.direction);
      }
    },
    dispose() {
      clear();
      events.abort();
      panel.remove();
      host?.replaceChildren(...placeholder);
      if (status) status.textContent = 'Load the scene to use these controls.';
      rollAnimation = twist = gesture = drag = undefined;
      touches.clear();
      if (level) level.hidden = true;
      rollButtons.forEach(button => { button.disabled = true; button.classList.remove('is-active'); });
    },
  };
}
