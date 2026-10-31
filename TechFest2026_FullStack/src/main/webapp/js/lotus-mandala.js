import * as THREE from './vendor/three.module.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const SAFFRON = 0xff9933;
const TURMERIC = 0xffc83d;
const PINK = 0xf472a6;
const TEAL = 0x19b5a5;
const PERIWINKLE = 0x7c9bff;

function petalGeometry(length, width, depth) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(width * 0.9, length * 0.2, width * 0.75, length * 0.72, 0, length);
  s.bezierCurveTo(-width * 0.75, length * 0.72, -width * 0.9, length * 0.2, 0, 0);
  const g = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.7,
    bevelSize: width * 0.16,
    bevelSegments: 8,
    curveSegments: 28,
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

const clay = (color, extra = {}) =>
  new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.38,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    sheen: 0.5,
    sheenColor: new THREE.Color(0xfff3d6),
    sheenRoughness: 0.6,
    ...extra,
  });

export function initLotusMandala(mount) {
  if (!mount) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 2.2, 10.5);
  camera.lookAt(0, 0.1, 0);

  // Warm studio lighting
  scene.add(new THREE.HemisphereLight(0xfff9f0, 0xfdefd9, 1.4));
  const key = new THREE.DirectionalLight(0xfff1dc, 2.4);
  key.position.set(-5, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 10;
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffe4ee, 0.7);
  fill.position.set(5, 2, 4);
  scene.add(fill);

  const glow = new THREE.PointLight(TURMERIC, 9, 6, 2);
  glow.position.set(0, 0.25, 0.5);
  scene.add(glow);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.ShadowMaterial({ color: 0x8a5a3c, opacity: 0.13 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2.25;
  floor.receiveShadow = true;
  scene.add(floor);

  const rig = new THREE.Group();
  rig.position.y = 0.05;
  scene.add(rig);

  const mandala = new THREE.Group();
  mandala.rotation.x = -0.22;
  rig.add(mandala);

  const palette = [clay(SAFFRON), clay(PINK), clay(TEAL)];
  const outerGeo = petalGeometry(1.95, 0.72, 0.2);
  const innerGeo = petalGeometry(1.32, 0.56, 0.18);

  const addTier = (geo, offset, z, tilt, scale) => {
    for (let i = 0; i < 12; i++) {
      const pivot = new THREE.Group();
      pivot.rotation.z = offset + (i / 12) * Math.PI * 2;
      const petal = new THREE.Mesh(geo, palette[i % 3]);
      petal.position.set(0, 0.24, z);
      petal.rotation.x = tilt;
      petal.scale.setScalar(scale);
      petal.castShadow = true;
      pivot.add(petal);
      mandala.add(pivot);
    }
  };

  addTier(outerGeo, 0, -0.08, -0.18, 1);
  addTier(innerGeo, Math.PI / 12, 0.18, -0.4, 1);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.62, 64, 64),
    new THREE.MeshPhysicalMaterial({
      color: TURMERIC,
      emissive: TURMERIC,
      emissiveIntensity: 0.85,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    })
  );
  sphere.position.z = 0.38;
  sphere.castShadow = true;
  mandala.add(sphere);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 48, 48),
    new THREE.MeshBasicMaterial({ color: TURMERIC, transparent: true, opacity: 0.16, depthWrite: false })
  );
  halo.position.copy(sphere.position);
  mandala.add(halo);

  const rings = [];
  const ringMaterial = clay(0xe8c468, { roughness: 0.3 });
  const beadMaterial = clay(SAFFRON, { roughness: 0.42 });
  const beadAlt = clay(TURMERIC, { roughness: 0.42 });
  const gemMaterials = [PINK, TEAL, PERIWINKLE].map(
    (color) =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.08,
        metalness: 0,
        transmission: 0.25,
        thickness: 0.4,
        clearcoat: 1,
        flatShading: true,
      })
  );

  const torusGeo = new THREE.TorusGeometry(3.15, 0.025, 12, 180);
  const beadGeo = new THREE.SphereGeometry(0.075, 18, 18);
  const gemGeo = new THREE.OctahedronGeometry(0.2, 0);

  [70, 20].forEach((deg, ringIndex) => {
    const ring = new THREE.Group();
    ring.rotation.set(THREE.MathUtils.degToRad(deg), ringIndex ? 0.35 : -0.25, ringIndex ? -0.18 : 0.22);
    ring.add(new THREE.Mesh(torusGeo, ringMaterial));
    const beads = new THREE.InstancedMesh(beadGeo, beadMaterial, 20);
    const beadsAlt = new THREE.InstancedMesh(beadGeo, beadAlt, 20);
    const m = new THREE.Matrix4();
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      m.makeTranslation(Math.cos(a) * 3.15, Math.sin(a) * 3.15, 0);
      (i % 2 ? beadsAlt : beads).setMatrixAt(Math.floor(i / 2), m);
    }
    beads.castShadow = beadsAlt.castShadow = true;
    ring.add(beads, beadsAlt);
    for (let i = 0; i < 3; i++) {
      const gem = new THREE.Mesh(gemGeo, gemMaterials[(i + ringIndex) % 3]);
      const a = (i / 3) * Math.PI * 2 + ringIndex * 0.5;
      gem.position.set(Math.cos(a) * 3.15, Math.sin(a) * 3.15, 0);
      gem.userData.angle = a;
      gem.castShadow = true;
      ring.add(gem);
    }
    rings.push(ring);
    rig.add(ring);
  });

  const target = new THREE.Vector2();
  const onPointer = (e) => {
    const r = mount.getBoundingClientRect();
    target.set(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => target.set(0, 0);
  window.addEventListener('pointermove', onPointer, { passive: true });
  mount.addEventListener('pointerleave', onLeave);

  const resize = () => {
    const { width, height } = mount.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(mount);
  resize();

  let frame = 0;
  const clock = new THREE.Clock();
  const render = () => {
    const t = clock.getElapsedTime();
    if (!reduceMotion) {
      mandala.rotation.z = t * 0.12;
      rings[0].rotation.z += 0.0022;
      rings[1].rotation.z -= 0.0016;
      rings.forEach((ring) =>
        ring.children.forEach((child) => {
          if (child.userData.angle !== undefined) child.rotation.set(t, t * 1.3, 0);
        })
      );
      sphere.scale.setScalar(1 + Math.sin(t * 1.8) * 0.025);
    }
    rig.rotation.y += (target.x * 0.28 - rig.rotation.y) * 0.06;
    rig.rotation.x += (target.y * 0.18 - rig.rotation.x) * 0.06;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  };
  render();

  return () => {
    cancelAnimationFrame(frame);
    ro.disconnect();
    window.removeEventListener('pointermove', onPointer);
    mount.removeEventListener('pointerleave', onLeave);
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose();
        const mat = obj.material;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((m) => m.dispose());
      }
    });
    envTexture.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
