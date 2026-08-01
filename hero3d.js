/* ============================================================
   WildAlert — interaktywne hero 3D
   Three.js r128 (globalne THREE z CDN, bez modułów i bez build stepu).

   Co tu się dzieje:
   - proceduralny low-poly teren górski (deterministyczny szum wartościowy),
   - znaczniki zagrożeń rysowane jako HTML rzutowany z pozycji 3D
     (ostre emoji, natywny hover/fokus, czytelna karta — zamiast raycastingu),
   - najechanie na niedźwiedzia wystrzeliwuje pionową wiązkę + pierścienie fali
     i podświetla turystów w pobliżu.

   Jeśli tego pliku nie da się uruchomić (brak WebGL, padnięte CDN), strona
   po prostu zostaje przy statycznym hero z logo — nic się nie psuje.
   ============================================================ */
(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  var hero = document.getElementById('hero');
  var canvas = document.getElementById('heroCanvas');
  var layer = document.getElementById('heroMarkers');
  var hintTxt = document.getElementById('heroHintTxt');
  if (!hero || !canvas || !layer) return;

  // --- czy w ogóle jest WebGL ------------------------------------------
  try {
    var probe = document.createElement('canvas');
    if (!window.WebGLRenderingContext ||
        !(probe.getContext('webgl') || probe.getContext('experimental-webgl'))) return;
  } catch (e) { return; }

  // --- budżet szczegółów: telefon dostaje wyraźnie mniej ----------------
  var coarse = window.matchMedia('(max-width: 760px)').matches ||
               window.matchMedia('(pointer: coarse)').matches;
  var SEG   = coarse ? 56  : 116;   // segmenty siatki terenu
  var GRID  = coarse ? 20  : 32;    // segmenty nakładki „siatki radarowej”
  var DUST  = coarse ? 130 : 420;   // cząstki pyłu w powietrzu
  var SIZE  = 200;                  // rozmiar terenu w jednostkach sceny

  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var noMotion = reduceMQ.matches;

  var srgb = function (hex) { return new THREE.Color(hex).convertSRGBToLinear(); };

  /* ==========================================================
     1. TEREN — deterministyczny szum wartościowy + grzbiety
     ========================================================== */

  function hash2(i, j) {
    var n = Math.imul(i, 374761393) + Math.imul(j, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }

  function valueNoise(x, z) {
    var i = Math.floor(x), j = Math.floor(z);
    var fx = x - i, fz = z - j;
    var ux = fx * fx * (3 - 2 * fx);
    var uz = fz * fz * (3 - 2 * fz);
    var a = hash2(i, j), b = hash2(i + 1, j);
    var c = hash2(i, j + 1), d = hash2(i + 1, j + 1);
    return a * (1 - ux) * (1 - uz) + b * ux * (1 - uz) +
           c * (1 - ux) * uz       + d * ux * uz;
  }

  // grzbietowy fBm — „1 - |n|” daje ostre granie zamiast obłych pagórków
  function ridged(x, z) {
    var sum = 0, amp = 1, freq = 1, norm = 0;
    for (var o = 0; o < 4; o++) {
      var n = valueNoise(x * freq, z * freq);
      n = 1 - Math.abs(n * 2 - 1);
      n *= n;
      sum += n * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2.03;
    }
    return sum / norm;
  }

  function smoothstep(a, b, x) {
    var t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  var NOISE_SCALE = 0.033;
  var PEAK = 34;

  // Wysokość terenu w dowolnym punkcie. Znaczniki korzystają z tej samej
  // funkcji, więc siedzą dokładnie na stoku, a nie „mniej więcej”.
  function heightAt(x, z) {
    var r = Math.min(1, Math.sqrt(x * x + z * z) / (SIZE * 0.5));
    var island = 1 - smoothstep(0.34, 1.0, r);
    var h = ridged(x * NOISE_SCALE + 13.7, z * NOISE_SCALE + 5.1);
    // drobna faktura — bez niej pierwszy plan (gdzie stoją znaczniki) jest
    // gładki i przy płaskim cieniowaniu wygląda jak jednolita plama
    var detail = (valueNoise(x * 0.1 + 60.4, z * 0.1 + 22.9) - 0.5) * 5.0;
    return h * PEAK * island + detail * island - (1 - island) * 16 - 3;
  }

  function displace(geometry) {
    var pos = geometry.attributes.position;
    for (var i = 0; i < pos.count; i++) {
      // płaszczyzna jest jeszcze w XY — obrócimy ją dopiero po deformacji
      pos.setZ(i, heightAt(pos.getX(i), -pos.getY(i)));
    }
    pos.needsUpdate = true;
  }

  /* ==========================================================
     2. SCENA
     ========================================================== */

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07080f, 0.0060);

  var camera = new THREE.PerspectiveCamera(46, 1, 0.5, 600);
  var CAM = { x: 0, y: 46, z: 118 };
  camera.position.set(CAM.x, CAM.y, CAM.z);

  var lookTarget = new THREE.Vector3(0, 2, -6);

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: !coarse,
    powerPreference: 'high-performance'
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label',
    'Trójwymiarowa mapa górskiego terenu ze znacznikami zgłoszonych zagrożeń.');

  var world = new THREE.Group();      // obraca się delikatnie wokół osi Y
  scene.add(world);

  // --- teren -----------------------------------------------------------
  var terrainGeo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
  displace(terrainGeo);
  terrainGeo.rotateX(-Math.PI / 2);
  terrainGeo.computeVertexNormals();

  // barwa po wysokości: doliny toną w czerni, granie łapią zimne światło
  var cLow = srgb(0x080a12), cMid = srgb(0x161c2c), cHigh = srgb(0x3b4460), cTop = srgb(0x8792ae);
  var posAttr = terrainGeo.attributes.position;
  var colors = new Float32Array(posAttr.count * 3);
  var tmpColor = new THREE.Color();
  for (var vi = 0; vi < posAttr.count; vi++) {
    var t = Math.min(1, Math.max(0, (posAttr.getY(vi) + 8) / (PEAK + 8)));
    if (t < 0.45) tmpColor.copy(cLow).lerp(cMid, t / 0.45);
    else if (t < 0.78) tmpColor.copy(cMid).lerp(cHigh, (t - 0.45) / 0.33);
    else tmpColor.copy(cHigh).lerp(cTop, (t - 0.78) / 0.22);
    colors[vi * 3] = tmpColor.r;
    colors[vi * 3 + 1] = tmpColor.g;
    colors[vi * 3 + 2] = tmpColor.b;
  }
  terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  var terrainMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    flatShading: true,
    roughness: 0.96,
    metalness: 0.0,
    // odsunięcie w głąb, żeby siatka nad terenem nie migotała (z-fighting)
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  });
  world.add(new THREE.Mesh(terrainGeo, terrainMat));

  // --- nakładka „siatki radarowej” (rzadsza niż teren, celowo) ---------
  var gridGeo = new THREE.PlaneGeometry(SIZE, SIZE, GRID, GRID);
  displace(gridGeo);
  gridGeo.rotateX(-Math.PI / 2);
  var gridMesh = new THREE.Mesh(gridGeo, new THREE.MeshBasicMaterial({
    color: srgb(0x46527a),
    wireframe: true,
    transparent: true,
    opacity: 0.3,
    depthWrite: false
  }));
  gridMesh.position.y = 0.35;
  world.add(gridMesh);

  // --- światła ---------------------------------------------------------
  scene.add(new THREE.AmbientLight(srgb(0x46527a), 0.75));

  var keyLight = new THREE.DirectionalLight(srgb(0xc6d3f5), 2.4);
  keyLight.position.set(-70, 90, 46);
  scene.add(keyLight);

  var rimLight = new THREE.DirectionalLight(srgb(0xe5352a), 1.5);
  rimLight.position.set(64, 26, -78);
  scene.add(rimLight);

  // --- pył w powietrzu -------------------------------------------------
  var dustGeo = new THREE.BufferGeometry();
  var dustPos = new Float32Array(DUST * 3);
  for (var di = 0; di < DUST; di++) {
    dustPos[di * 3]     = (Math.random() - 0.5) * SIZE * 0.95;
    dustPos[di * 3 + 1] = Math.random() * 62 - 4;
    dustPos[di * 3 + 2] = (Math.random() - 0.5) * SIZE * 0.95;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  var dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: srgb(0x9fb2e0),
    size: 0.42,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.5,
    depthWrite: false
  }));
  world.add(dust);

  /* ==========================================================
     3. SYGNAŁ — wiązka w niebo + pierścienie fali
     ========================================================== */

  var BEAM_H = 66;
  var signalGroup = new THREE.Group();
  world.add(signalGroup);

  var beamMat = new THREE.ShaderMaterial({
    uniforms: {
      uColor:    { value: srgb(0xe5352a) },
      uProgress: { value: 0 },
      uOpacity:  { value: 0 }
    },
    vertexShader: [
      'varying float vY;',
      'void main(){',
      '  vY = uv.y;',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform vec3 uColor;',
      'uniform float uProgress;',
      'uniform float uOpacity;',
      'varying float vY;',
      'void main(){',
      // wiązka istnieje tylko do wysokości uProgress — dzięki temu „wystrzeliwuje”
      '  float head = 1.0 - smoothstep(uProgress - 0.14, uProgress, vY);',
      '  float body = pow(1.0 - vY, 2.2) * 0.85;',
      '  float tip  = exp(-abs(vY - uProgress) * 20.0) * 1.5;',
      '  float a = (body + tip) * head * uOpacity;',
      '  if (a < 0.004) discard;',
      '  gl_FragColor = vec4(uColor, a);',
      '}'
    ].join('\n'),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });

  var coreGeo = new THREE.CylinderGeometry(0.32, 0.32, BEAM_H, 8, 1, true);
  coreGeo.translate(0, BEAM_H / 2, 0);
  var glowGeo = new THREE.CylinderGeometry(1.5, 1.5, BEAM_H, 10, 1, true);
  glowGeo.translate(0, BEAM_H / 2, 0);

  var glowMat = beamMat.clone();
  glowMat.uniforms = {
    uColor:    { value: srgb(0xe5352a) },
    uProgress: beamMat.uniforms.uProgress,   // ten sam obiekt = wspólna animacja
    uOpacity:  { value: 0 }
  };

  var beamCore = new THREE.Mesh(coreGeo, beamMat);
  var beamGlow = new THREE.Mesh(glowGeo, glowMat);
  signalGroup.add(beamCore, beamGlow);

  // pierścienie rozchodzące się po stoku
  var RINGS = 3;
  var ringGeo = new THREE.RingGeometry(0.9, 1.0, 56);
  ringGeo.rotateX(-Math.PI / 2);
  var rings = [];
  for (var ri = 0; ri < RINGS; ri++) {
    var rm = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
      color: srgb(0xe5352a),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false
    }));
    rm.visible = false;
    signalGroup.add(rm);
    rings.push(rm);
  }
  signalGroup.visible = false;

  /* ==========================================================
     4. ZNACZNIKI (HTML rzutowany z 3D)
     ========================================================== */

  // Znaczniki opisujemy tym, GDZIE MAJĄ WYLĄDOWAĆ NA EKRANIE, a nie gdzie stoją
  // w scenie: `col` to pozycja pozioma w zakresie -1..1, `row` to miejsce w
  // pasie pod treścią hero (0 = tuż pod tekstem, 1 = przy dolnej krawędzi).
  // Punkt terenu pod te współrzędne dobieramy numerycznie — przy sztywnych
  // współrzędnych świata znaczniki wchodziły na tekst albo wypadały poza kadr,
  // zależnie od proporcji okna.
  // `tier` mówi, jak bardzo znacznik jest istotny: im niższy pas na znaczniki
  // (niskie okno, dużo tekstu), tym mniej ich pokazujemy — zamiast pozwolić im
  // wejść na siebie.
  var HAZARDS = [
    { id: 'ice',       col: -0.72, row: 0.00, tier: 2, icon: '🧊', label: 'Oblodzenie',      aria: 'Zgłoszenie: oblodzenie szlaku.' },
    { id: 'avalanche', col: 0.62,  row: 0.06, tier: 1, icon: '🏔️', label: 'Lawina',          aria: 'Zgłoszenie: zagrożenie lawinowe.' },
    { id: 'bear',      col: -0.47, row: 0.30, tier: 0, icon: '🐻', label: 'Niedźwiedź',      aria: 'Zgłoszenie: niedźwiedź. Pokaż, jak rozchodzi się ostrzeżenie.' },
    { id: 'closed',    col: 0.72,  row: 0.86, tier: 2, icon: '⛔', label: 'Szlak zamknięty', aria: 'Zgłoszenie: szlak zamknięty.' }
  ];

  // turyści skupieni wokół niedźwiedzia — to oni „dostają ostrzeżenie”
  var HIKERS = [
    { col: -0.24, row: 0.50, tier: 1 },
    { col: -0.74, row: 0.96, tier: 2 },
    { col: -0.46, row: 0.80, tier: 2 },
    { col: 0.02,  row: 0.66, tier: 1 }
  ];

  var markers = [];

  function makeMarker(cfg, isHiker) {
    var el = document.createElement(isHiker ? 'div' : 'button');
    el.className = 'mk' + (isHiker ? ' hiker' : '');
    if (!isHiker) {
      el.type = 'button';
      el.setAttribute('aria-label', cfg.aria);
    } else {
      el.setAttribute('aria-hidden', 'true');
    }

    var pin = document.createElement('span');
    pin.className = 'mk-pin';
    el.appendChild(pin);

    var chip = document.createElement('span');
    chip.className = 'mk-chip';
    if (isHiker) {
      chip.textContent = 'turysta';
    } else {
      chip.innerHTML = '<span class="mk-ico">' + cfg.icon + '</span>' +
                       '<span class="mk-txt">' + cfg.label + '</span>';
    }
    el.appendChild(chip);

    layer.appendChild(el);

    return {
      el: el,
      chip: chip,
      id: cfg.id || null,
      col: cfg.col,
      row: cfg.row,
      tier: cfg.tier,
      local: new THREE.Vector3()
    };
  }

  /* --- odwrotna projekcja: z punktu na ekranie na punkt terenu --- */

  // Kamera patrzy w płaszczyźnie YZ, więc jej wektor „w prawo” to (1,0,0),
  // a „w górę” to (0,-fz,fy). Dzięki temu obie współrzędne dają się policzyć
  // wprost, bez pełnej macierzy.
  var camBasis = { fy: 0, fz: -1, tanH: 0.4 };

  function updateCamBasis() {
    var fy = lookTarget.y - CAM.y, fz = lookTarget.z - CAM.z;
    var len = Math.sqrt(fy * fy + fz * fz);
    camBasis.fy = fy / len;
    camBasis.fz = fz / len;
    camBasis.tanH = Math.tan(camera.fov * Math.PI / 360);
  }

  function ndcYat(x, z) {
    var dy = heightAt(x, z) + 0.4 - CAM.y, dz = z - CAM.z;
    var c = dy * camBasis.fy + dz * camBasis.fz;
    if (c <= 0.01) return 1e6;
    var b = dy * -camBasis.fz + dz * camBasis.fy;
    return (b / c) / camBasis.tanH;
  }

  // ndcY maleje wraz ze zbliżaniem się do kamery, więc wystarczy bisekcja
  function solveZ(targetNdcY, x) {
    var lo = -30, hi = 76;
    if (ndcYat(x, lo) < targetNdcY) return lo;
    if (ndcYat(x, hi) > targetNdcY) return hi;
    for (var i = 0; i < 22; i++) {
      var mid = (lo + hi) / 2;
      if (ndcYat(x, mid) > targetNdcY) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  function solveX(targetNdcX, x, z) {
    var dy = heightAt(x, z) + 0.4 - CAM.y, dz = z - CAM.z;
    var c = dy * camBasis.fy + dz * camBasis.fz;
    return targetNdcX * c * camBasis.tanH * camera.aspect;
  }

  var heroSlot = document.querySelector('.hero-slot');

  function layoutMarkers() {
    // na wąskim kadrze podnosimy cel kamery — teren schodzi niżej i nad
    // grzbietami zostaje więcej ciemnego nieba na wyższy blok tekstu
    var lift = Math.max(0, Math.min(1, (1.25 - camera.aspect) / 0.65));
    lookTarget.y = 2 + lift * 11;
    camera.lookAt(lookTarget);
    updateCamBasis();

    // pas na znaczniki zaczyna się pod realną wysokością treści hero,
    // więc żaden znacznik nie wejdzie na nagłówek, przyciski ani kartę
    var heroH = hero.clientHeight || 1;
    var slotBottom = heroSlot
      ? heroSlot.getBoundingClientRect().bottom - hero.getBoundingClientRect().top
      : heroH * 0.55;
    // +104 px to wysokość plakietki wraz z nóżką i marginesem — znacznik jest
    // rysowany NAD punktem zaczepienia, więc punkt musi leżeć odpowiednio niżej
    var top = Math.min(0.84, Math.max(0.5, (slotBottom + 104) / heroH));
    var bottom = 0.98;
    var tight = lift > 0.5;

    // ile znaczników w ogóle ma sens przy tej wysokości pasa
    var bandPx = (bottom - top) * heroH;
    var level = bandPx < 130 ? 0 : (bandPx < 200 ? 1 : 2);

    for (var i = 0; i < markers.length; i++) {
      var m = markers[i];
      m.el.classList.toggle('mk-off', m.tier > level);
      if (m.tier > level) continue;
      var ndcY = 1 - 2 * (top + m.row * (bottom - top));
      // na wąskim kadrze zostawiamy zapas przy krawędziach — plakietka jest
      // szersza względem ekranu, a paralaksa dokłada jeszcze kilka procent
      var ndcX = m.col * (tight ? 0.8 : 0.94);
      var x = 0, z = 40;
      for (var it = 0; it < 4; it++) {
        z = solveZ(ndcY, x);
        x = solveX(ndcX, x, z);
      }
      m.local.set(x, heightAt(x, z) + 0.4, z);
    }
    signalGroup.position.copy(bear.local);
  }

  HAZARDS.forEach(function (h) { markers.push(makeMarker(h, false)); });
  HIKERS.forEach(function (h) { markers.push(makeMarker(h, true)); });

  var hazards = markers.slice(0, HAZARDS.length);
  var hikers = markers.slice(HAZARDS.length);
  var bear = hazards.filter(function (m) { return m.id === 'bear'; })[0];
  var otherHazards = hazards.filter(function (m) { return m.id !== 'bear'; });

  var cardOk = document.getElementById('haCount');

  layoutMarkers();

  /* ==========================================================
     5. SEKWENCJA OSTRZEŻENIA
     ========================================================== */

  var SIG_DUR = 3.4;
  var sig = { on: false, t: 0 };
  var warnTimers = [];

  function clearWarnTimers() {
    warnTimers.forEach(clearTimeout);
    warnTimers = [];
  }

  function activate() {
    // sygnał 3D wolno odpalić ponownie (np. gdy ktoś trzyma kursor na
    // niedźwiedziu) — kaskadę podświetleń budujemy tylko przy wejściu w stan
    var wasActive = bear.el.classList.contains('is-active');
    bear.el.classList.add('is-active');
    hero.classList.add('sig-on');
    sig.on = true;
    sig.t = 0;
    signalGroup.visible = true;
    if (wasActive) { if (noMotion) { applySignal(0.62); renderFrame(); } return; }

    // turyści zapalają się kaskadą — „ostrzeżenie idzie dalej”
    clearWarnTimers();
    var shown = hikers.filter(function (m) { return !m.el.classList.contains('mk-off'); });
    cardOk.textContent = shown.length === 1
      ? '1 osoba w pobliżu ostrzeżona'
      : shown.length + ' osoby w pobliżu ostrzeżone';
    shown.forEach(function (m, i) {
      warnTimers.push(setTimeout(function () {
        m.el.classList.add('is-warned');
        m.chip.textContent = 'ostrzeżony';
      }, 220 + i * 130));
    });
    otherHazards.forEach(function (m, i) {
      warnTimers.push(setTimeout(function () {
        m.el.classList.add('is-warned');
      }, 300 + i * 110));
    });

    if (noMotion) { applySignal(0.62); renderFrame(); }
  }

  function deactivate() {
    if (!bear.el.classList.contains('is-active')) return;
    bear.el.classList.remove('is-active');
    hero.classList.remove('sig-on');
    clearWarnTimers();
    hikers.forEach(function (m) {
      m.el.classList.remove('is-warned');
      m.chip.textContent = 'turysta';
    });
    otherHazards.forEach(function (m) { m.el.classList.remove('is-warned'); });

    if (noMotion) {
      sig.on = false;
      signalGroup.visible = false;
      renderFrame();
    }
  }

  // wizualna część sygnału dla postępu 0..1 (używana też w trybie statycznym)
  function applySignal(p) {
    var grow = Math.min(1, p / 0.16);                 // wystrzał w ~0.55 s
    var fade = 1 - smoothstep(0.72, 1.0, p);          // spokojne wygaszenie
    beamMat.uniforms.uProgress.value = grow;
    beamMat.uniforms.uOpacity.value = fade;
    glowMat.uniforms.uOpacity.value = fade * 0.2;

    for (var i = 0; i < RINGS; i++) {
      var rp = (p - i * 0.13) / 0.62;                 // każdy pierścień z opóźnieniem
      if (rp < 0 || rp > 1) { rings[i].visible = false; continue; }
      rings[i].visible = true;
      var s = 1.2 + rp * 30;
      rings[i].scale.set(s, 1, s);
      rings[i].material.opacity = (1 - rp) * 0.75 * fade;
    }
  }

  var lastPoke = 0;           // kiedy użytkownik ostatnio sam coś zrobił
  var leaveTimer = null;

  function poke() {
    lastPoke = clock.getElapsedTime();
    if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
  }

  bear.el.addEventListener('pointerenter', function () { poke(); activate(); });
  bear.el.addEventListener('focus', function () { poke(); activate(); });
  bear.el.addEventListener('click', function (e) { e.preventDefault(); poke(); activate(); });
  bear.el.addEventListener('pointerleave', function () {
    poke();
    leaveTimer = setTimeout(deactivate, 700);
  });
  bear.el.addEventListener('blur', function () {
    poke();
    leaveTimer = setTimeout(deactivate, 400);
  });

  /* ==========================================================
     6. PARALAKSA + PĘTLA RENDERUJĄCA
     ========================================================== */

  var clock = new THREE.Clock();
  var pointer = { x: 0, y: 0 };
  var pointerLerp = { x: 0, y: 0 };

  hero.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;            // na dotyku paralaksa przeszkadza
    var r = hero.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
  }, { passive: true });

  hero.addEventListener('pointerleave', function () { pointer.x = 0; pointer.y = 0; });

  var projV = new THREE.Vector3();

  function updateMarkers() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    for (var i = 0; i < markers.length; i++) {
      var m = markers[i];
      projV.copy(m.local).applyMatrix4(world.matrixWorld).project(camera);
      var x = (projV.x * 0.5 + 0.5) * w;
      var y = (-projV.y * 0.5 + 0.5) * h;
      if (projV.z > 1 || x < -80 || x > w + 80 || y < -60 || y > h + 80) {
        if (!m.el.hasAttribute('hidden')) m.el.setAttribute('hidden', '');
        continue;
      }
      if (m.el.hasAttribute('hidden')) m.el.removeAttribute('hidden');
      m.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    }
  }

  function renderFrame() {
    scene.updateMatrixWorld(true);
    updateMarkers();
    renderer.render(scene, camera);
  }

  function frame() {
    var dt = clock.getDelta();            // dokładnie raz na klatkę
    var t = clock.getElapsedTime();

    // delikatne kołysanie zamiast pełnego obrotu: znacznik, na który celujesz,
    // nie ucieka spod kursora
    // Kołysanie liczy się w radianach, ale na ekranie jego zasięg zależy od
    // proporcji kadru — przy stałej amplitudzie znaczniki na telefonie
    // przejeżdżały przez jedną trzecią szerokości ekranu.
    world.rotation.y = Math.sin(t * 0.16) * 0.075 * Math.min(1, camera.aspect / 1.6);
    dust.rotation.y = t * 0.012;

    pointerLerp.x += (pointer.x - pointerLerp.x) * 0.045;
    pointerLerp.y += (pointer.y - pointerLerp.y) * 0.045;
    // przesunięcie w jednostkach sceny przekłada się na ekran odwrotnie
    // proporcjonalnie do proporcji kadru — bez mnożnika paralaksa na telefonie
    // zjeżdżałaby o jedną czwartą szerokości ekranu
    camera.position.x = CAM.x + pointerLerp.x * 4.5 * camera.aspect;
    camera.position.y = CAM.y - pointerLerp.y * 2.5;
    camera.lookAt(lookTarget);

    // autoprezentacja: bez niej na telefonie (brak hoveru) nikt by tego nie zobaczył
    if (!sig.on && t - lastPoke > 6.5) { lastPoke = t; activate(); }

    if (sig.on) {
      sig.t += dt;
      var p = sig.t / SIG_DUR;
      if (p >= 1) {
        sig.on = false;
        signalGroup.visible = false;
        // sekwencja odpalona automatycznie sama się sprząta
        if (!bear.el.matches(':hover') && document.activeElement !== bear.el) deactivate();
      } else {
        applySignal(p);
      }
    }

    renderFrame();
  }

  /* ==========================================================
     7. ROZMIAR, PAUZOWANIE, START
     ========================================================== */

  function resize() {
    var w = hero.clientWidth || 1;
    var h = hero.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    layoutMarkers();
    renderFrame();
  }

  var running = false;
  function start() {
    if (running || noMotion) return;
    running = true;
    clock.getDelta();                     // zeruj skok czasu po pauzie
    renderer.setAnimationLoop(frame);
  }
  function stop() {
    if (!running) return;
    running = false;
    renderer.setAnimationLoop(null);
  }

  // Pas na znaczniki wyliczamy z realnej wysokości bloku tekstu, a ta potrafi
  // być jeszcze nieprzeliczona w chwili zgłoszenia zmiany rozmiaru (tekst
  // przelewa się na inną liczbę linii). Dlatego po każdej zmianie robimy
  // drugie podejście w następnej klatce, gdy layout jest już ustalony.
  var resizeRaf = 0;
  function scheduleResize() {
    resize();
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(function () { resizeRaf = 0; resize(); });
  }

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(scheduleResize).observe(hero);
  }
  // ResizeObserver nie zawsze łapie zmianę samego okna (m.in. obrót ekranu
  // i zmiana powiększenia), a wtedy znaczniki zostają rozłożone pod stary kadr
  window.addEventListener('resize', scheduleResize);
  window.addEventListener('orientationchange', scheduleResize);

  // nie renderuj, gdy hero jest poza ekranem albo karta jest w tle
  var visible = true;
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible && !document.hidden) start(); else stop();
  }, { threshold: 0 }).observe(hero);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (visible) start();
  });

  reduceMQ.addEventListener('change', function (e) {
    noMotion = e.matches;
    if (noMotion) {
      stop();
      world.rotation.y = 0;
      camera.position.set(CAM.x, CAM.y, CAM.z);
      camera.lookAt(lookTarget);
      sig.on = false;
      signalGroup.visible = false;
      deactivate();
      renderFrame();
    } else {
      start();
    }
  });

  if (hintTxt && window.matchMedia('(pointer: coarse)').matches) {
    hintTxt.textContent = 'Dotknij 🐻 — zobacz, jak leci ostrzeżenie';
  }

  // Klasa musi być ustawiona PRZED pierwszym rozłożeniem znaczników: dopóki
  // jej nie ma, .hero-slot jest ukryty i nie ma wymiarów, więc pas na znaczniki
  // wyszedłby za wysoko.
  hero.classList.add('is-3d');
  resize();
  if (!noMotion) start();
})();
