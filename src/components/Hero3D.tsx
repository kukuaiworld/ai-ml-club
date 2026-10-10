import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DProps {
  className?: string;
}

export const Hero3D: React.FC<Hero3DProps> = ({
  className = "fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect mobile or low performance
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 70 : 135;
    const particleCount = isMobile ? 220 : 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      1000
    );
    camera.position.z = isMobile ? 28 : 23;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Central Neural Core (Sphere of interconnected Nodes in 3D Spiral distribution)
    const neuralGroup = new THREE.Group();
    scene.add(neuralGroup);

    // Node Positions (Fibonacci Spherical Spiral)
    const radius = isMobile ? 5.2 : 6.2;
    const nodePositions: THREE.Vector3[] = [];
    const colors: number[] = [];

    // Professional Institutional Color Palette: Tech Blue, Subtle Indigo, Steel White
    const colorChoices = [
      new THREE.Color('#3b82f6'), // Tech blue
      new THREE.Color('#60a5fa'), // Light blue
      new THREE.Color('#6366f1'), // Refined indigo
      new THREE.Color('#94a3b8'), // Subtle slate
      new THREE.Color('#cbd5e1'), // Crisp light gray
    ];

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const jitter = (Math.random() - 0.5) * 0.9;
      const r = radius + jitter;

      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos);

      const col = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors.push(col.r, col.g, col.b);
    }

    // Nodes (Points)
    const nodeGeometry = new THREE.BufferGeometry().setFromPoints(nodePositions);
    nodeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Natural circular gradient texture
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        gradient.addColorStop(0.35, 'rgba(59, 130, 246, 0.7)');
        gradient.addColorStop(0.75, 'rgba(30, 58, 138, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(32, 32, 32, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    const nodeMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.28 : 0.36,
      map: createCircleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const nodesMesh = new THREE.Points(nodeGeometry, nodeMaterial);
    neuralGroup.add(nodesMesh);

    // Subtle Synapse Connections
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const maxDistance = isMobile ? 3.2 : 3.5;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < maxDistance) {
          linePositions.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );

          const alpha = (1.0 - dist / maxDistance) * 0.32;
          const col = colorChoices[(i + j) % colorChoices.length];
          lineColors.push(col.r * alpha, col.g * alpha, col.b * alpha);
          lineColors.push(col.r * alpha, col.g * alpha, col.b * alpha);
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      linewidth: 1,
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    neuralGroup.add(linesMesh);

    // Subtle Inner Geometric Core
    const coreGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    neuralGroup.add(coreMesh);

    // 3. Subtle Ambient Background Particles (Deep Space Dust)
    const bgParticleGeo = new THREE.BufferGeometry();
    const bgPos: number[] = [];
    for (let i = 0; i < particleCount; i++) {
      bgPos.push(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 40 - 5
      );
    }
    bgParticleGeo.setAttribute('position', new THREE.Float32BufferAttribute(bgPos, 3));
    const bgParticleMat = new THREE.PointsMaterial({
      size: 0.09,
      color: 0x64748b,
      transparent: true,
      opacity: 0.22,
    });
    const bgParticles = new THREE.Points(bgParticleGeo, bgParticleMat);
    scene.add(bgParticles);

    // 4. Mouse Interactive Tilt & Window Scroll Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = window.scrollY;
    let targetScrollY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });

    // 5. Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;
      targetScrollY += (scrollY - targetScrollY) * 0.05;

      // Dynamic rotation responsive to time, cursor, and scroll parallax
      neuralGroup.rotation.y = elapsedTime * 0.09 + targetX * 0.5 + targetScrollY * 0.0006;
      neuralGroup.rotation.x = Math.sin(elapsedTime * 0.06) * 0.12 - targetY * 0.35 + Math.sin(targetScrollY * 0.0004) * 0.1;
      neuralGroup.rotation.z = Math.cos(elapsedTime * 0.05) * 0.08;

      // Subtle vertical position reaction to scroll
      neuralGroup.position.y = -targetScrollY * 0.0012;

      const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.04;
      coreMesh.scale.set(scale, scale, scale);
      coreMesh.rotation.y = -elapsedTime * 0.15;

      bgParticles.rotation.y = elapsedTime * 0.012;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.position.z = w < 768 ? 28 : 23;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={className} 
      aria-hidden="true" 
    />
  );
};

export const Main3DBackground = Hero3D;
