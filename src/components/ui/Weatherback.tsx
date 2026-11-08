import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useTheme } from "@/context/theme-provider";

const Weather3DBackground = ({ children }: { children?: React.ReactNode }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 1); // background always deep black
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Stars
    const starCount = 400;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starOpacities = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 100;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      starOpacities[i] = Math.random();
    }

    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute("aOpacity", new THREE.BufferAttribute(starOpacities, 1));

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Clouds
    const cloudTexture = new THREE.TextureLoader().load("https://i.ibb.co/4fQ9y0T/cloud.png");
    const clouds: THREE.Sprite[] = [];
    for (let i = 0; i < 10; i++) {
      const cloud = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: cloudTexture,
          opacity: 0.12,
          transparent: true,
          color: 0xffffff,
        })
      );
      cloud.scale.set(25, 12, 1);
      cloud.position.set((Math.random() - 0.5) * 80, Math.random() * 20 - 10, -20);
      scene.add(cloud);
      clouds.push(cloud);
    }

    // Meteors
    const meteors: THREE.Mesh[] = [];
    const meteorGeometry = new THREE.SphereGeometry(0.08, 6, 6);
    const meteorMaterial = new THREE.MeshBasicMaterial({ color: 0xfffaaa });
    for (let i = 0; i < 5; i++) {
      const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);
      meteor.position.set(Math.random() * 50 - 25, 20 + Math.random() * 10, -10);
      scene.add(meteor);
      meteors.push(meteor);
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.002;

      // Stars twinkle
      const opacities = (stars.geometry.getAttribute("aOpacity") as THREE.BufferAttribute);
      for (let i = 0; i < starCount; i++) {
        opacities.array[i] = 0.5 + 0.5 * Math.sin(time + i);
      }
      opacities.needsUpdate = true;

      // Clouds drift
      clouds.forEach((cloud, i) => {
        cloud.position.x += 0.01 + 0.01 * Math.sin(time + i);
        if (cloud.position.x > 50) cloud.position.x = -50;
      });

      // Meteors
      meteors.forEach((meteor) => {
        meteor.position.x -= 0.3;
        meteor.position.y -= 0.2;
        if (meteor.position.y < -15) {
          meteor.position.set(Math.random() * 50 - 25, 20 + Math.random() * 10, -10);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      mount.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDark]);

  return (
    <>
      <div ref={mountRef} className="fixed inset-0 w-full h-full -z-10"></div>
      <div className="relative z-10 min-h-screen">{children}</div>
    </>
  );
};

export default Weather3DBackground;
