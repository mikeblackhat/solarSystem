import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

let scene, camera, renderer, composer, clock, controls;
let star, orrery, starLight, ambientLight, blueLight, purpleLight;
let metalMaterial, ringMaterial;
let planets = [];
let particleSystems = [];
let comets = [];
// Las naves espaciales han sido eliminadas del sistema
let activeEffects = [];
let isResonanceActive = false;
let timeAcceleration = 1;
let currentThemeIndex = 2; // Celestial theme as default

// Wait for DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById("container");
  const activateButton = document.getElementById("activateTrigger");
  const resetButton = document.getElementById("resetView");
  const timeButton = document.getElementById("timeAccel");
  const themeButton = document.getElementById("toggleTheme");

  const themes = [
    {
      name: "Inferno",
      starColors: { color1: 0xffffff, color2: 0xffcc00 },
      planetData: [
        {
          baseColor: [0.8, 0.2, 0.1],
          accentColor: [1, 0.6, 0.2],
          trailColor: 0xff4400,
        },
        {
          baseColor: [0.6, 0.1, 0.1],
          accentColor: [1, 0.4, 0.1],
          trailColor: 0xff8800,
        },
        {
          baseColor: [0.9, 0.3, 0],
          accentColor: [1, 0.8, 0.3],
          trailColor: 0xffaa33,
        },
        {
          baseColor: [0.7, 0.5, 0.1],
          accentColor: [1, 0.9, 0.4],
          trailColor: 0xffcc44,
        },
        {
          baseColor: [0.5, 0.3, 0.2],
          accentColor: [0.9, 0.7, 0.5],
          trailColor: 0xdd7744,
        },
        {
          baseColor: [0.4, 0.1, 0.3],
          accentColor: [0.8, 0.4, 0.7],
          trailColor: 0xaa4477,
        },
        {
          baseColor: [0.2, 0.1, 0.4],
          accentColor: [0.6, 0.4, 0.8],
          trailColor: 0x7744aa,
        },
      ],
      ambientLightColor: 0x401008,
      starLightColor: 0xffcc88,
      directionalLights: { color1: 0xff6600, color2: 0xdd3300 },
      metalMaterialColor: 0x332222,
      ringColor: 0xff8866,
      arcColor: 0xffccaa,
    },
    {
      name: "Veridian",
      starColors: { color1: 0xccffee, color2: 0x66ffcc },
      planetData: [
        {
          baseColor: [0.2, 0.8, 0.5],
          accentColor: [0.8, 1, 0.9],
          trailColor: 0x00ffaa,
        },
        {
          baseColor: [0.1, 0.6, 0.7],
          accentColor: [0.5, 0.9, 1],
          trailColor: 0x00ccff,
        },
        {
          baseColor: [0.5, 0.8, 0.2],
          accentColor: [0.9, 1, 0.6],
          trailColor: 0xaaff00,
        },
        {
          baseColor: [0.3, 0.7, 0.6],
          accentColor: [0.7, 0.9, 0.8],
          trailColor: 0x44ddaa,
        },
        {
          baseColor: [0.2, 0.5, 0.8],
          accentColor: [0.6, 0.8, 1],
          trailColor: 0x4488dd,
        },
        {
          baseColor: [0.4, 0.6, 0.3],
          accentColor: [0.8, 0.9, 0.6],
          trailColor: 0x88cc44,
        },
        {
          baseColor: [0.1, 0.4, 0.5],
          accentColor: [0.5, 0.7, 0.8],
          trailColor: 0x448899,
        },
      ],
      ambientLightColor: 0x0a3024,
      starLightColor: 0xccffdd,
      directionalLights: { color1: 0x33cc88, color2: 0x4488cc },
      metalMaterialColor: 0x779988,
      ringColor: 0x88ffcc,
      arcColor: 0xeeffee,
    },
    {
      name: "Celestial",
      starColors: { color1: 0xffe4b5, color2: 0xff8844 },
      planetData: [
        {
          baseColor: [1, 0.4, 0.4],
          accentColor: [1, 0.8, 0.2],
          trailColor: 0xff6644,
        },
        {
          baseColor: [0.3, 0.8, 0.3],
          accentColor: [0.6, 1, 0.8],
          trailColor: 0x44ff88,
        },
        {
          baseColor: [0.3, 0.4, 1],
          accentColor: [0.8, 0.6, 1],
          trailColor: 0x4488ff,
        },
        {
          baseColor: [0.8, 0.6, 0.4],
          accentColor: [1, 0.9, 0.7],
          trailColor: 0xffaa66,
        },
        {
          baseColor: [0.6, 0.3, 0.8],
          accentColor: [0.9, 0.6, 1],
          trailColor: 0xbb66ff,
        },
        {
          baseColor: [0.4, 0.7, 0.9],
          accentColor: [0.8, 0.9, 1],
          trailColor: 0x66ccff,
        },
        {
          baseColor: [0.9, 0.5, 0.6],
          accentColor: [1, 0.8, 0.8],
          trailColor: 0xff88aa,
        },
      ],
      ambientLightColor: 0x1a2440,
      starLightColor: 0xffe4b5,
      directionalLights: { color1: 0x4488ff, color2: 0x8844ff },
      metalMaterialColor: 0x4a6080,
      ringColor: 0x88ccff,
      arcColor: 0xffeebb,
    },
  ];

  function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      3000,
    );
    
    // Detect mobile devices and adjust camera position
    const isMobile = window.innerWidth <= 768 || window.innerHeight <= 700;
    const isSmallMobile = window.innerWidth <= 480 || window.innerHeight <= 600;
    
    // Calcular el radio del sistema solar basado en las órbitas de los planetas
    const planetBaseData = [
      { size: 0.6, distance: 8, speed: 0.6 },
      { size: 0.9, distance: 14, speed: 0.35 },
      { size: 0.7, distance: 22, speed: 0.25 },
      { size: 0.8, distance: 30, speed: 0.18 },
      { size: 0.5, distance: 38, speed: 0.12 },
      { size: 0.6, distance: 46, speed: 0.08 },
      { size: 0.4, distance: 54, speed: 0.06 },
    ];
    const solarSystemRadius = planetBaseData[planetBaseData.length - 1].distance + 10; // Último planeta + margen
    
    if (isSmallMobile) {
      // For small mobile devices: compact view, closer to title, lower height
      camera.position.set(solarSystemRadius * 0.5, solarSystemRadius * 0.3, solarSystemRadius * 0.5);
    } else if (isMobile) {
      // For tablets and medium devices: closer to title, lower height
      camera.position.set(solarSystemRadius * 0.5, solarSystemRadius * 0.35, solarSystemRadius * 0.5);
    } else {
      // For desktop: vista panorámica completa más cerca del título, altura baja
      camera.position.set(solarSystemRadius * 0.5, solarSystemRadius * 0.4, solarSystemRadius * 0.5);
    }
    
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    
    // Adjust control limits based on device type
    const isDesktop = window.innerWidth > 768 && window.innerHeight > 700;
    if (isDesktop) {
      // For desktop: allow closer and further zoom for better exploration
      controls.minDistance = 15;
      controls.maxDistance = solarSystemRadius * 3; // Permitir zoom hasta 3 veces el sistema solar
      controls.autoRotateSpeed = 0.1; // Slower rotation for better viewing
    } else {
      // For mobile: original limits
      controls.minDistance = 8;
      controls.maxDistance = solarSystemRadius * 2.5; // Zoom extendido para móviles
      controls.autoRotateSpeed = 0.15;
    }
    
    controls.autoRotate = true;
    controls.enablePan = false;
    
    setupLighting();
    createOrrery();
    createEnvironment();
    createComets();
    // Las naves espaciales han sido eliminadas del sistema
    setupPostProcessing();
    applyTheme(currentThemeIndex);
    
    window.addEventListener("resize", onWindowResize);
    activateButton.addEventListener("click", activateResonance);
    resetButton.addEventListener("click", resetView);
    timeButton.addEventListener("click", toggleTimeAcceleration);
    themeButton.addEventListener("click", toggleTheme);
    
    // Initialize the scene
    init();
    
    animate();
  }

  function setupLighting() {
    ambientLight = new THREE.AmbientLight(0x1a2440, 0.8);
    scene.add(ambientLight);
    starLight = new THREE.PointLight(0xffe4b5, 3, 120, 1.8);
    starLight.castShadow = true;
    starLight.shadow.mapSize.width = 2048;
    starLight.shadow.mapSize.height = 2048;
    scene.add(starLight);
    blueLight = new THREE.DirectionalLight(0x4488ff, 0.5);
    blueLight.position.set(-50, 30, -30);
    scene.add(blueLight);
    purpleLight = new THREE.DirectionalLight(0x8844ff, 0.3);
    purpleLight.position.set(30, -20, 50);
    scene.add(purpleLight);
  }

  function setupPostProcessing() {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.6,
      0.5,
      0.15,
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());
  }

  function createOrrery() {
    orrery = new THREE.Group();
    scene.add(orrery);
    metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a6080,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0x1a2540,
      emissiveIntensity: 0.4,
      envMapIntensity: 1.5,
    });
    ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x88ccff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const starGeo = new THREE.IcosahedronGeometry(2.2, 2);
    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: 1 },
        color1: {
          value: new THREE.Color(themes[currentThemeIndex].starColors.color1),
        },
        color2: {
          value: new THREE.Color(themes[currentThemeIndex].starColors.color2),
        },
      },
      vertexShader: document.getElementById("starVertexShader").textContent,
      fragmentShader:
        document.getElementById("starFragmentShader").textContent,
    });
    star = new THREE.Mesh(starGeo, starMaterial);
    star.castShadow = false;
    star.receiveShadow = false;
    orrery.add(star);
    
    const planetGeometries = [
      new THREE.OctahedronGeometry(0.6, 1),
      new THREE.DodecahedronGeometry(0.9, 1),
      new THREE.IcosahedronGeometry(0.7, 1),
      new THREE.TetrahedronGeometry(0.8, 1),
      new THREE.SphereGeometry(0.5, 16, 12),
      new THREE.BoxGeometry(0.6, 0.6, 0.6),
      new THREE.ConeGeometry(0.4, 0.8, 8),
    ];
    
    const planetBaseData = [
      { size: 0.6, distance: 8, speed: 0.6 },
      { size: 0.9, distance: 14, speed: 0.35 },
      { size: 0.7, distance: 22, speed: 0.25 },
      { size: 0.8, distance: 30, speed: 0.18 },
      { size: 0.5, distance: 38, speed: 0.12 },
      { size: 0.6, distance: 46, speed: 0.08 },
      { size: 0.4, distance: 54, speed: 0.06 },
    ];
    
    planetBaseData.forEach((data, i) => {
      const planetGroup = new THREE.Group();
      planetGroup.userData.orbitSpeed = data.speed;
      planetGroup.rotation.y = Math.random() * Math.PI * 2;
      orrery.add(planetGroup);
      
      const ringGeo = new THREE.TorusGeometry(data.distance, 0.02, 8, 64);
      const ringMaterialSubtle = new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });
      const ring = new THREE.Mesh(ringGeo, ringMaterialSubtle);
      ring.rotation.x = Math.PI / 2;
      planetGroup.add(ring);
      
      const planetMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          baseColor: {
            value: new THREE.Vector3(
              ...themes[currentThemeIndex].planetData[i].baseColor,
            ),
          },
          accentColor: {
            value: new THREE.Vector3(
              ...themes[currentThemeIndex].planetData[i].accentColor,
            ),
          },
          energy: { value: 0 },
        },
        vertexShader:
          document.getElementById("planetVertexShader").textContent,
        fragmentShader: document.getElementById("planetFragmentShader")
          .textContent,
      });
      
      const planet = new THREE.Mesh(planetGeometries[i], planetMaterial);
      planet.position.x = 0; // Start at center for Big Bang animation
      planet.userData.selfRotation = 0.6;
      planet.castShadow = true;
      planet.receiveShadow = true;
      planet.userData.finalDistance = data.distance; // Store final position
      planet.userData.animationDelay = i * 0.3; // Stagger animation
      planetGroup.add(planet);
      
      createParticleTrail(
        planet,
        themes[currentThemeIndex].planetData[i].trailColor,
        data.distance,
      );
      
      planets.push({
        group: planetGroup,
        body: planet,
        material: planetMaterial,
      });
    });
  }

  function createParticleTrail(planet, color, radius) {
    const count = 50;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const c = new THREE.Color(color);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geom.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    
    const mat = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    
    const points = new THREE.Points(geom, mat);
    planet.parent.add(points);
    
    particleSystems.push({
      system: points,
      planet: planet,
      positions: positions,
      radius: radius,
      currentIndex: 0,
    });
  }

  function createComets() {
    for (let i = 0; i < 3; i++) {
      const cometGroup = new THREE.Group();
      
      // Comet head (small sphere)
      const headGeometry = new THREE.SphereGeometry(0.15, 8, 6);
      const headMaterial = new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.8,
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      cometGroup.add(head);
      
      // Comet tail (particles)
      const tailGeometry = new THREE.BufferGeometry();
      const tailPositions = new Float32Array(30 * 3);
      const tailColors = new Float32Array(30 * 3);
      
      for (let j = 0; j < 30; j++) {
        const t = j / 30;
        tailPositions[j * 3] = -t * 2; // Behind the comet
        tailPositions[j * 3 + 1] = (Math.random() - 0.5) * 0.3;
        tailPositions[j * 3 + 2] = (Math.random() - 0.5) * 0.3;
        
        const alpha = 1 - t;
        tailColors[j * 3] = 0.5 + alpha * 0.5;
        tailColors[j * 3 + 1] = 0.7 + alpha * 0.3;
        tailColors[j * 3 + 2] = 1.0;
      }
      
      tailGeometry.setAttribute('position', new THREE.BufferAttribute(tailPositions, 3));
      tailGeometry.setAttribute('color', new THREE.BufferAttribute(tailColors, 3));
      
      const tailMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      
      const tail = new THREE.Points(tailGeometry, tailMaterial);
      cometGroup.add(tail);
      
      // Random orbital parameters
      cometGroup.userData = {
        distance: 70 + Math.random() * 30,
        speed: 0.02 + Math.random() * 0.03,
        angle: Math.random() * Math.PI * 2,
        inclination: (Math.random() - 0.5) * 0.5,
      };
      
      scene.add(cometGroup);
      comets.push(cometGroup);
    }
  }

  // Las naves espaciales han sido eliminadas del sistema
  function createSpaceship() {
    // Función vacía - naves eliminadas
  }

  function createEnvironment() {
    const layers = [
      {
        count: 3000,
        distance: [600, 1000],
        size: [0.8, 1.5],
        color: 0x6688bb,
      },
      { count: 2000, distance: [1000, 1500], size: [1, 2], color: 0x88aadd },
      {
        count: 1000,
        distance: [1500, 2000],
        size: [1.5, 3],
        color: 0xaaccff,
      },
    ];
    
    layers.forEach((layer) => {
      const positions = new Float32Array(layer.count * 3);
      const colors = new Float32Array(layer.count * 3);
      const sizes = new Float32Array(layer.count);
      const c = new THREE.Color(layer.color);
      
      for (let i = 0; i < layer.count; i++) {
        const u = Math.random(),
          v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r =
          layer.distance[0] +
          Math.random() * (layer.distance[1] - layer.distance[0]);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
        sizes[i] =
          layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]);
      }
      
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geom.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      
      const mat = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
      });
      
      const stars = new THREE.Points(geom, mat);
      scene.add(stars);
    });
  }

  function activateResonance() {
    if (isResonanceActive) return;
    isResonanceActive = true;
    activateButton.textContent = "Deactivate Resonance";
    activateButton.classList.add("resonance-active");
    planets.forEach(
      (p) => (p.body.userData.baseOrbitSpeed = p.group.userData.orbitSpeed),
    );
    
    // Create spectacular resonance wave effect
    const resonanceWave = {
      type: "resonanceWave",
      startTime: clock.getElapsedTime(),
      duration: 12,
      update: (elapsed) => {
        const prog = elapsed / resonanceWave.duration;
        const wave = Math.sin(prog * Math.PI * 4) * Math.exp(-prog * 2);
        const intens = wave * 5;
        
        // Pulsating star with color changes
        starLight.intensity = 3 + intens * 4;
        star.material.uniforms.intensity.value = 1 + intens * 3;
        star.material.uniforms.color1.value.setHSL(0.1 + prog * 0.3, 1, 0.5 + intens * 0.2);
        star.material.uniforms.color2.value.setHSL(0.6 - prog * 0.2, 1, 0.5 + intens * 0.2);
        
        // Enhanced planet effects
        metalMaterial.emissiveIntensity = 0.4 + intens * 3;
        planets.forEach((p, index) => {
          p.group.userData.orbitSpeed = p.body.userData.baseOrbitSpeed * (1 + intens * 2 + Math.sin(prog * Math.PI * 8 + index) * 0.5);
          p.material.uniforms.energy.value = intens * (1 + Math.sin(prog * Math.PI * 6 + index) * 0.5);
          
          // Add orbital scaling
          const scale = 1 + Math.sin(prog * Math.PI * 3 + index * 0.5) * intens * 0.3;
          p.body.scale.setScalar(scale);
        });
        
        // Dynamic lighting
        ambientLight.intensity = 0.8 + intens * 2;
        blueLight.intensity = 0.5 + intens * 3;
        purpleLight.intensity = 0.3 + intens * 2;
      },
      end: () => {
        starLight.intensity = 3;
        star.material.uniforms.intensity.value = 1;
        star.material.uniforms.color1.value.set(themes[currentThemeIndex].starColors.color1);
        star.material.uniforms.color2.value.set(themes[currentThemeIndex].starColors.color2);
        metalMaterial.emissiveIntensity = 0.4;
        ambientLight.intensity = 0.8;
        planets.forEach((p) => {
          p.group.userData.orbitSpeed = p.body.userData.baseOrbitSpeed;
          p.material.uniforms.energy.value = 0;
          p.body.scale.setScalar(1);
        });
        isResonanceActive = false;
        activateButton.textContent = "Activate Resonance";
        activateButton.classList.remove("resonance-active");
      },
    };
    activeEffects.push(resonanceWave);
    
    // Create multiple types of energy effects
    createResonanceRings();
    createEnergySpikes();
    createParticleBurst();
    
    // Enhanced arcs with different patterns
    for (let i = 0; i < planets.length; i++) {
      createEnhancedArc(planets[i].body, i === 0 ? star : planets[i - 1].body, 8);
      createSpiralArc(planets[i].body, star, 6);
    }
  }

  function createResonanceRings() {
    // Create expanding energy rings from the star
    for (let i = 0; i < 5; i++) {
      const ringGeo = new THREE.RingGeometry(0.5, 1, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6, 1, 0.5),
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      });
      
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(star.position);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      
      const ringEffect = {
        type: "resonanceRing",
        mesh: ring,
        material: ringMat,
        startTime: clock.getElapsedTime() + i * 0.3,
        duration: 4,
        update: (elapsed) => {
          const localElapsed = elapsed - (i * 0.3);
          if (localElapsed < 0) return;
          
          const prog = localElapsed / 4;
          const scale = 1 + prog * 15;
          ring.scale.setScalar(scale);
          ringMat.opacity = (1 - prog) * 0.8;
          ringMat.color.setHSL(0.6 + prog * 0.4, 1, 0.5);
        },
        end: () => {
          scene.remove(ring);
          ringGeo.dispose();
          ringMat.dispose();
        },
      };
      activeEffects.push(ringEffect);
    }
  }
  
  function createEnergySpikes() {
    // Create energy spikes radiating from planets
    planets.forEach((planet, index) => {
      const spikeCount = 8;
      for (let i = 0; i < spikeCount; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.1, 3, 8);
        const spikeMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.8 + index * 0.1, 1, 0.6),
          transparent: true,
          opacity: 0.9,
        });
        
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        const angle = (i / spikeCount) * Math.PI * 2;
        spike.position.set(
          Math.cos(angle) * 2,
          0,
          Math.sin(angle) * 2
        );
        planet.group.add(spike);
        
        const spikeEffect = {
          type: "energySpike",
          mesh: spike,
          material: spikeMat,
          startTime: clock.getElapsedTime() + index * 0.2,
          duration: 6,
          update: (elapsed) => {
            const localElapsed = elapsed - (index * 0.2);
            if (localElapsed < 0) return;
            
            const prog = localElapsed / 6;
            const pulse = Math.sin(prog * Math.PI * 6) * Math.exp(-prog * 1.5);
            spike.scale.y = 1 + pulse * 2;
            spikeMat.opacity = (1 - prog) * 0.9 + pulse * 0.5;
            spike.rotation.y += 0.1;
          },
          end: () => {
            planet.group.remove(spike);
            spikeGeo.dispose();
            spikeMat.dispose();
          },
        };
        activeEffects.push(spikeEffect);
      }
    });
  }
  
  function createParticleBurst() {
    // Create burst of particles from the star
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 0.5;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const color = new THREE.Color().setHSL(Math.random(), 1, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 3 + 1;
    }
    
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMat = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    particles.position.copy(star.position);
    scene.add(particles);
    
    const particleEffect = {
      type: "particleBurst",
      system: particles,
      material: particleMat,
      startTime: clock.getElapsedTime(),
      duration: 8,
      update: (elapsed) => {
        const prog = elapsed / 8;
        const positions = particles.geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
          const speed = (1 + Math.random()) * 0.5;
          const idx = i * 3;
          positions[idx] *= (1 + speed * 0.1);
          positions[idx + 1] *= (1 + speed * 0.1);
          positions[idx + 2] *= (1 + speed * 0.1);
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        particleMat.opacity = (1 - prog) * 0.8;
        particles.rotation.y += 0.02;
      },
      end: () => {
        scene.remove(particles);
        particleGeo.dispose();
        particleMat.dispose();
      },
    };
    activeEffects.push(particleEffect);
  }
  
  function createSpiralArc(obj1, obj2, duration) {
    // Create spiral-shaped energy arcs
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color().setHSL(0.7, 1, 0.6) },
        opacity: { value: 0 },
        energy: { value: 0 },
      },
      vertexShader: document.getElementById("arcVertexShader").textContent,
      fragmentShader: document.getElementById("arcFragmentShader").textContent,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const spiralEffect = {
      type: "spiralArc",
      mesh: null,
      material: material,
      startTime: clock.getElapsedTime(),
      duration: duration,
      obj1: obj1,
      obj2: obj2,
      update: (elapsed) => {
        const prog = elapsed / spiralEffect.duration;
        if (prog > 1) return;
        
        const p1 = new THREE.Vector3();
        const p2 = new THREE.Vector3();
        obj1.getWorldPosition(p1);
        obj2.getWorldPosition(p2);
        
        // Create spiral curve
        const points = [];
        const segments = 100;
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const spiralRadius = Math.sin(t * Math.PI * 4) * 2;
          const point = new THREE.Vector3().lerpVectors(p1, p2, t);
          point.x += Math.cos(t * Math.PI * 8) * spiralRadius;
          point.z += Math.sin(t * Math.PI * 8) * spiralRadius;
          point.y += Math.sin(t * Math.PI * 6) * spiralRadius * 0.5;
          points.push(point);
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const tube = new THREE.TubeGeometry(curve, segments, 0.1, 8, false);
        
        if (!spiralEffect.mesh) {
          spiralEffect.mesh = new THREE.Mesh(tube, material);
          scene.add(spiralEffect.mesh);
        } else {
          spiralEffect.mesh.geometry.dispose();
          spiralEffect.mesh.geometry = tube;
        }
        
        const intens = Math.sin(prog * Math.PI) * Math.exp(-prog * 0.5);
        material.uniforms.opacity.value = intens * 0.7;
        material.uniforms.energy.value = intens * 3;
        material.uniforms.time.value = clock.getElapsedTime();
        spiralEffect.mesh.visible = true;
      },
      end: () => {
        if (spiralEffect.mesh) {
          scene.remove(spiralEffect.mesh);
          spiralEffect.mesh.geometry.dispose();
          spiralEffect.material.dispose();
        }
      },
    };
    activeEffects.push(spiralEffect);
  }
  
  function createEnhancedArc(obj1, obj2, duration) {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(themes[currentThemeIndex].arcColor) },
        opacity: { value: 0 },
        energy: { value: 0 },
      },
      vertexShader: document.getElementById("arcVertexShader").textContent,
      fragmentShader:
        document.getElementById("arcFragmentShader").textContent,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const arcEffect = {
      type: "arc",
      mesh: null,
      material: material,
      startTime: clock.getElapsedTime(),
      duration: duration,
      obj1: obj1,
      obj2: obj2,
      update: (elapsed) => {
        const prog = elapsed / arcEffect.duration;
        if (prog > 1) return;
        const p1 = new THREE.Vector3(),
          p2 = new THREE.Vector3();
        obj1.getWorldPosition(p1);
        obj2.getWorldPosition(p2);
        const mid = p1.clone().lerp(p2, 0.5);
        const ctrl = mid
          .clone()
          .add(new THREE.Vector3(0, p1.distanceTo(p2) * 0.5, 0));
        const curve = new THREE.QuadraticBezierCurve3(p1, ctrl, p2);
        const tube = new THREE.TubeGeometry(curve, 48, 0.15, 12, false);
        if (!arcEffect.mesh) {
          arcEffect.mesh = new THREE.Mesh(tube, material);
          scene.add(arcEffect.mesh);
        } else {
          arcEffect.mesh.geometry.dispose();
          arcEffect.mesh.geometry = tube;
        }
        const intens = Math.sin(prog * Math.PI);
        material.uniforms.opacity.value = intens * 0.9;
        material.uniforms.energy.value = intens * 2;
        material.uniforms.time.value = clock.getElapsedTime();
        arcEffect.mesh.visible = true;
      },
      end: () => {
        if (arcEffect.mesh) {
          scene.remove(arcEffect.mesh);
          arcEffect.mesh.geometry.dispose();
          arcEffect.material.dispose();
        }
      },
    };
    activeEffects.push(arcEffect);
  }

  function resetView() {
    controls.reset();
    
    // Detect mobile devices and adjust camera position
    const isMobile = window.innerWidth <= 768 || window.innerHeight <= 700;
    const isSmallMobile = window.innerWidth <= 480 || window.innerHeight <= 600;
    
    if (isSmallMobile) {
      camera.position.set(40, 20, 40);
    } else if (isMobile) {
      camera.position.set(35, 22, 35);
    } else {
      // For desktop: better position to see complete galaxy
      camera.position.set(35, 28, 35);
    }
    
    controls.update();
  }

  function toggleTimeAcceleration() {
    // Cycle through speeds: 1x → 2x → 5x → 10x → 0.5x → 1x
    if (timeAcceleration === 1) {
      timeAcceleration = 2;
    } else if (timeAcceleration === 2) {
      timeAcceleration = 5;
    } else if (timeAcceleration === 5) {
      timeAcceleration = 10;
    } else if (timeAcceleration === 10) {
      timeAcceleration = 0.5;
    } else {
      timeAcceleration = 1;
    }
    document.getElementById("timeAccel").textContent = `Time: ${timeAcceleration}x`;
  }

  function toggleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(currentThemeIndex);
  }

  function applyTheme(i) {
    const theme = themes[i];
    themeButton.textContent = `Theme: ${theme.name}`;
    star.material.uniforms.color1.value.set(theme.starColors.color1);
    star.material.uniforms.color2.value.set(theme.starColors.color2);
    planets.forEach((p, idx) => {
      const pd = theme.planetData[idx];
      p.material.uniforms.baseColor.value.set(...pd.baseColor);
      p.material.uniforms.accentColor.value.set(...pd.accentColor);
    });
    particleSystems.forEach((ps, idx) => {
      const c = new THREE.Color(theme.planetData[idx].trailColor);
      const col = ps.system.geometry.attributes.color;
      for (let j = 0; j < col.count; j++) col.setXYZ(j, c.r, c.g, c.b);
      col.needsUpdate = true;
    });
    ambientLight.color.set(theme.ambientLightColor);
    starLight.color.set(theme.starLightColor);
    blueLight.color.set(theme.directionalLights.color1);
    purpleLight.color.set(theme.directionalLights.color2);
    metalMaterial.color.set(theme.metalMaterialColor);
    ringMaterial.color.set(theme.ringColor);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    
    // Adjust camera position for mobile when resizing
    const isMobile = window.innerWidth <= 768 || window.innerHeight <= 700;
    const isSmallMobile = window.innerWidth <= 480 || window.innerHeight <= 600;
    
    if (isSmallMobile) {
      camera.position.set(40, 20, 40);
    } else if (isMobile) {
      camera.position.set(35, 22, 35);
    } else {
      // For desktop: better position to see complete galaxy
      camera.position.set(35, 28, 35);
    }
    
    controls.update();
  }

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta() * timeAcceleration;
    const t = clock.getElapsedTime();
    
    star.rotation.y += delta * 0.3;
    star.rotation.x += delta * 0.15;
    star.material.uniforms.time.value = t;
    
    orrery.children.forEach((c) => {
      if (c.userData.rotationSpeed)
        c.rotation.z += delta * c.userData.rotationSpeed;
    });
    
    planets.forEach((p) => {
      p.group.rotation.y += delta * p.group.userData.orbitSpeed;
      p.body.rotation.y += delta * p.body.userData.selfRotation;
      p.body.rotation.z += delta * p.body.userData.selfRotation * 0.3;
      p.material.uniforms.time.value = t;
    });
    
    particleSystems.forEach(
      (ps) => (ps.system.geometry.attributes.position.needsUpdate = true),
    );
    
    // Animate comets
    comets.forEach((comet) => {
      comet.userData.angle += delta * comet.userData.speed;
      const x = Math.cos(comet.userData.angle) * comet.userData.distance;
      const z = Math.sin(comet.userData.angle) * comet.userData.distance;
      const y = Math.sin(comet.userData.angle * 2) * comet.userData.inclination * 10;
      
      comet.position.set(x, y, z);
      comet.lookAt(x + Math.cos(comet.userData.angle + 0.1), y, z + Math.sin(comet.userData.angle + 0.1));
    })
    // Las naves espaciales han sido eliminadas del sistema
    
    for (let i = activeEffects.length - 1; i >= 0; i--) {
      const e = activeEffects[i];
      const elapsed = t - e.startTime;
      if (elapsed > e.duration) {
        e.end();
        activeEffects.splice(i, 1);
      } else {
        e.update(elapsed, delta);
      }
    }
    
    controls.update();
    composer.render(delta);
  }

}); // End of DOMContentLoaded event listener