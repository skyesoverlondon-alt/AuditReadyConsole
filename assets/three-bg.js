const canvas = document.getElementById("three-bg");
if (!canvas) return;

(async () => {
  try {
    const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.min.js");
    const { Scene, PerspectiveCamera, WebGLRenderer, Color, FogExp2, BufferGeometry, Float32BufferAttribute, PointsMaterial, Points, Clock } = THREE;

    const scene = new Scene();
    scene.fog = new FogExp2(new Color(0x07000d), 0.06);

    const camera = new PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 160);
    camera.position.set(0, 4, 28);

    const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new BufferGeometry();
    const count = 720;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 16;
      const y = -6 + Math.random() * 12;
      const jitter = (Math.random() - 0.5) * 4;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * (radius * 0.45) + jitter;
      speeds[i] = 0.0006 + Math.random() * 0.0014;
    }

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));

    const material = new PointsMaterial({
      color: 0xffffff,
      size: 0.09,
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    });

    const cloud = new Points(geometry, material);
    scene.add(cloud);

    const clock = new Clock();
    let frameId = null;
    let running = true;

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const animate = () => {
      if (!running) return;
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      const pos = geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        pos[idx + 1] += Math.sin(Date.now() * speeds[i] * 0.8 + i) * 0.002;
        pos[idx] *= 1.00001;
        pos[idx + 2] *= 1.00001;
        const limit = 34;
        if (pos[idx] > limit) pos[idx] = -limit;
        if (pos[idx] < -limit) pos[idx] = limit;
        if (pos[idx + 2] > limit) pos[idx + 2] = -limit;
        if (pos[idx + 2] < -limit) pos[idx + 2] = limit;
      }
      geometry.attributes.position.needsUpdate = true;

      cloud.rotation.y += delta * 0.08;
      cloud.rotation.x = Math.sin(clock.elapsedTime * 0.12) * 0.08;

      renderer.render(scene, camera);
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running && !frameId) {
        animate();
      } else if (!running && frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    });

    resize();
    animate();
  } catch (err) {
    console.warn("Three background disabled", err);
    canvas.remove();
  }
})();
