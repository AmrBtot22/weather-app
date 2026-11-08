import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const WeatherBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // --- SCENE ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b1026, 0.002);

    // --- CAMERA ---
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0x8a2be2, 200, 100);
    light1.position.set(10, 10, 10);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xff69b4, 200, 100);
    light2.position.set(-10, -10, 10);
    scene.add(light2);

    // --- PARTICLES (Rain / Stardust) ---
    const particleCount = 800;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 60;
    }
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // --- CLOUDS ---
    const cloudGroup = new THREE.Group();
    const cloudGeo = new THREE.SphereGeometry(1, 32, 32);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x9370db, // soft purple
      transparent: true,
      opacity: 0.3,
      roughness: 0.4,
      metalness: 0.1,
    });

    for (let i = 0; i < 6; i++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      cloud.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15
      );
      cloud.scale.setScalar(Math.random() * 4 + 2);
      cloudGroup.add(cloud);
    }
    scene.add(cloudGroup);

    // --- ANIMATION LOOP ---
    let frameId: number | undefined;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Rotate particles subtly
      particles.rotation.y = time * 0.03;
      particles.rotation.x = time * 0.01;

      // Animate particles downward (rain)
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] -= 0.04; // falling speed
        if (positions[i] < -30) positions[i] = 30;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Move lights smoothly
      light1.position.x = Math.sin(time * 0.5) * 15;
      light1.position.y = Math.cos(time * 0.3) * 15;
      light2.position.x = Math.cos(time * 0.5) * 15;
      light2.position.y = Math.sin(time * 0.3) * 15;

      // Animate clouds
      cloudGroup.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.position.y += Math.sin(time + i) * 0.004;
          child.rotation.z += 0.001;
        }
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    // --- HANDLE RESIZE ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameId) cancelAnimationFrame(frameId);
      if (mount) mount.removeChild(renderer.domElement);

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background: "linear-gradient(to bottom, #0b1026, #6a0dad, #ff69b4)", // calm gradient
        pointerEvents: "none",
      }}
    />
  );
};

export default WeatherBackground;
