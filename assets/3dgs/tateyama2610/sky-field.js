// Learned far field (sky, sun, distant ranges) drawn behind the splats: the web half of the trainer's
// skyfield.py (runtime-skyfield-v1). A ray d from the camera centre c (world = Nerfstudio dataparser frame,
// +Z up) looks the colour up at normalize(d + s * c_perp), c_perp = c - (c.d) d, where s is the learned inverse
// depth at that direction (two fixed-point passes, as in training). Textures are equirectangular with row 0 at
// the zenith: u = 0.5 + atan(y, x) / 2pi, v = 0.5 - atan(z, |xy|) / pi; longitude repeats, latitude clamps.
// Colour values are the trained display values (no colour-space conversion on either side, like the splats).
// manifest.sky_field = { color: {full, lite}, depth, s_max, depth_encoding: 'sqrt-u8' }.

const VERTEX = `
varying vec2 vNdc;
void main() {
  vNdc = position.xy;
  gl_Position = vec4(position.xy, 1.0, 1.0);
}`;

const FRAGMENT = `
uniform sampler2D uColor;
uniform sampler2D uDepth;
uniform float uSMax;
uniform float uLod;
uniform vec3 uCam;
uniform mat3 uRot;
uniform vec2 uTan;
varying vec2 vNdc;
const float PI = 3.141592653589793;
vec2 equirect(vec3 d) {
  // Same pole-safe form as skyfield.equirect_uv: latitude = atan(z, |xy|).
  return vec2(0.5 + atan(d.y, d.x) / (2.0 * PI), 0.5 - atan(d.z, length(d.xy)) / PI);
}
float inverseDepth(vec3 d) {
  float g = texture2D(uDepth, equirect(d)).r;
  return uSMax * g * g;
}
void main() {
  vec3 d = normalize(uRot * vec3(vNdc.x * uTan.x, vNdc.y * uTan.y, -1.0));
  vec3 perp = uCam - dot(uCam, d) * d;
  vec3 look = d;
  for (int i = 0; i < 2; i++) look = normalize(d + inverseDepth(look) * perp);
  gl_FragColor = vec4(textureLod(uColor, equirect(look), uLod).rgb, 1.0);
}`;

function loadTexture(THREE, url, { mipmaps }) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(url, (texture) => {
      texture.flipY = false;                      // image row 0 = zenith = v 0
      texture.colorSpace = THREE.NoColorSpace;    // trained display values pass through unchanged
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = mipmaps ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
      texture.generateMipmaps = mipmaps;
      texture.needsUpdate = true;
      resolve(texture);
    }, undefined, () => reject(new Error(`Sky texture failed: ${url}`)));
  });
}

// Returns { mesh, ready, dispose }. `ready` resolves once both textures are decoded; add `mesh` to the scene
// right away (it stays hidden until then, so the clear colour shows).
export function createSkyField(THREE, config, baseUrl, quality) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const uniforms = {
    uColor: { value: null }, uDepth: { value: null }, uSMax: { value: config.s_max },
    uLod: { value: 0 }, uCam: { value: new THREE.Vector3() }, uRot: { value: new THREE.Matrix3() },
    uTan: { value: new THREE.Vector2(1, 1) },
  };
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms,
    depthTest: false, depthWrite: false, transparent: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1e9;
  mesh.visible = false;
  let colorWidth = 1;
  const size = new THREE.Vector2();
  mesh.onBeforeRender = (renderer, scene, camera) => {
    uniforms.uCam.value.setFromMatrixPosition(camera.matrixWorld);
    uniforms.uRot.value.setFromMatrix4(camera.matrixWorld);
    // Orthographic axis views have no ray fan; show them through a 60 degree lens instead of one colour.
    const tanY = camera.isPerspectiveCamera ? Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) : Math.tan(Math.PI / 6);
    uniforms.uTan.value.set(tanY * camera.aspect, tanY);
    renderer.getDrawingBufferSize(size);
    // Mip level from the angular size of one screen pixel against one texel (2 pi / width radians).
    const pixel = 2 * tanY / Math.max(1, size.y), texel = 2 * Math.PI / colorWidth;
    uniforms.uLod.value = Math.max(0, Math.log2(pixel / texel) - 0.5);   // -0.5: keep the finest level a little longer
  };
  if (config.depth_encoding !== 'sqrt-u8') throw new Error('Unsupported sky depth encoding');
  const colorFile = quality === 'lite' ? config.color.lite : config.color.full;
  const ready = Promise.all([
    loadTexture(THREE, new URL(colorFile, baseUrl).href, { mipmaps: true }),
    loadTexture(THREE, new URL(config.depth, baseUrl).href, { mipmaps: false }),
  ]).then(([color, depth]) => {
    uniforms.uColor.value = color;
    uniforms.uDepth.value = depth;
    colorWidth = color.image?.width || 8192;
    mesh.visible = true;
  });
  const dispose = () => {
    geometry.dispose();
    material.dispose();
    uniforms.uColor.value?.dispose();
    uniforms.uDepth.value?.dispose();
  };
  return { mesh, ready, dispose };
}
