import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NeuralNetworkBackgroundProps {
  className?: string;
  isInitializing?: boolean;
}

export const NeuralNetworkBackground: React.FC<NeuralNetworkBackgroundProps> = ({
  className = "fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden",
  isInitializing = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 80 : 160;
    const pulseCount = isMobile ? 35 : 75;
    const bgParticleCount = isMobile ? 200 : 450;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      1000
    );
    camera.position.z = isMobile ? 30 : 24;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const neuralGroup = new THREE.Group();
    scene.add(neuralGroup);

    // 2. Color Palette (Multi-Shade Purple Color Grading: Deep Plum, Royal Purple, Electric Violet, Amethyst, Orchid, Lavender, White)
    const colorChoices = [
      new THREE.Color('#6b21a8'), // Deep Royal Plum
      new THREE.Color('#7e22ce'), // Rich Purple
      new THREE.Color('#8b5cf6'), // Electric Violet
      new THREE.Color('#a855f7'), // Radiant Amethyst
      new THREE.Color('#c026d3'), // Warm Orchid-Purple
      new THREE.Color('#c084fc'), // Soft Lavender
      new THREE.Color('#e9d5ff'), // Pale Lilac
      new THREE.Color('#ffffff'), // Crisp White
    ];

    // 3. Node Distribution (Multilayer 3D Neural Topology)
    const radius = isMobile ? 5.5 : 6.8;
    const nodePositions: THREE.Vector3[] = [];
    const colors: number[] = [];
    const nodeBootData: { delay: number; duration: number; dist: number }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      // Golden Spiral Spherical Lattice combined with multi-layer neural clustering
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const layerJitter = (Math.sin(i * 0.4) + Math.cos(i * 0.7)) * 0.6;
      const r = radius + layerJitter;

      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos);

      const distToCenter = pos.length();
      const delay = 0.2 + distToCenter * 0.08 + Math.random() * 0.2;
      const duration = 0.25 + Math.random() * 0.45;
      nodeBootData.push({ delay, duration, dist: distToCenter });

      const col = colorChoices[i % colorChoices.length];
      colors.push(col.r, col.g, col.b, isInitializing ? 0 : 1);
    }

    // Nodes Geometry
    const nodeGeometry = new THREE.BufferGeometry().setFromPoints(nodePositions);
    nodeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));

    // Circular Glow Texture
    const createNodeTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(192, 132, 252, 0.9)');
        gradient.addColorStop(0.65, 'rgba(139, 92, 246, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(32, 32, 32, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    const nodeMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.32 : 0.42,
      map: createNodeTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const nodesMesh = new THREE.Points(nodeGeometry, nodeMaterial);
    neuralGroup.add(nodesMesh);

    // 4. Synaptic Connections
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const synapses: { start: THREE.Vector3; end: THREE.Vector3; length: number; delay: number; duration: number; maxAlpha: number }[] = [];
    const maxDistance = isMobile ? 3.2 : 3.6;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < maxDistance) {
          linePositions.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );

          const alpha = (1.0 - dist / maxDistance) * 0.35;
          const col = colorChoices[(i + j) % colorChoices.length];
          const initialAlpha = isInitializing ? 0 : alpha;
          lineColors.push(col.r, col.g, col.b, initialAlpha);
          lineColors.push(col.r, col.g, col.b, initialAlpha);

          const delay = Math.max(nodeBootData[i].delay, nodeBootData[j].delay) + 0.1 + Math.random() * 0.2;
          const duration = 0.4 + Math.random() * 0.3;

          synapses.push({
            start: nodePositions[i],
            end: nodePositions[j],
            length: dist,
            delay,
            duration,
            maxAlpha: alpha
          });
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      linewidth: 1,
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    neuralGroup.add(linesMesh);

    // 5. Action Potentials / Traveling Synaptic Signal Pulses
    const activePulses: {
      synapseIndex: number;
      progress: number;
      speed: number;
    }[] = [];

    for (let i = 0; i < pulseCount; i++) {
      if (synapses.length > 0) {
        activePulses.push({
          synapseIndex: Math.floor(Math.random() * synapses.length),
          progress: Math.random(),
          speed: 0.006 + Math.random() * 0.012,
        });
      }
    }

    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseColors = new Float32Array(pulseCount * 4);

    for (let i = 0; i < pulseCount; i++) {
      pulseColors[i * 4] = 0.85;     // R
      pulseColors[i * 4 + 1] = 0.95; // G
      pulseColors[i * 4 + 2] = 1.0;  // B
      pulseColors[i * 4 + 3] = isInitializing ? 0 : 1.0;  // A
    }

    const pulseGeometry = new THREE.BufferGeometry();
    pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    pulseGeometry.setAttribute('color', new THREE.BufferAttribute(pulseColors, 4));

    const pulseMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.22 : 0.28,
      map: createNodeTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pulsesMesh = new THREE.Points(pulseGeometry, pulseMaterial);
    neuralGroup.add(pulsesMesh);

    // 6. Central Neural Core (Geometrical Icosahedron Tensor Lattice)
    const coreGeo = new THREE.IcosahedronGeometry(2.6, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: isInitializing ? 0 : 0.16,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    neuralGroup.add(coreMesh);

    // 7. Ambient Deep Space Dust Particles
    const bgParticleGeo = new THREE.BufferGeometry();
    const bgPos: number[] = [];
    for (let i = 0; i < bgParticleCount; i++) {
      bgPos.push(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 45 - 5
      );
    }
    bgParticleGeo.setAttribute('position', new THREE.Float32BufferAttribute(bgPos, 3));
    const bgParticleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xc084fc,
      transparent: true,
      opacity: 0.22,
    });
    const bgParticles = new THREE.Points(bgParticleGeo, bgParticleMat);
    scene.add(bgParticles);

    // 8. Mouse & Scroll Tracking
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

    // 9. Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();
    const bootStartTime = isInitializing ? performance.now() : null;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const elapsedTime = (currentTime - startTime) * 0.001;
      
      let bootProgress = 100; // sufficiently high if not booting
      if (bootStartTime !== null) {
        bootProgress = (currentTime - bootStartTime) * 0.001; // in seconds
      }

      // Handle boot sequence
      if (isInitializing && bootProgress < 3.0) {
        // Animate nodes
        const nodeColorAttr = nodeGeometry.attributes.color as THREE.BufferAttribute;
        for (let i = 0; i < nodeCount; i++) {
          const data = nodeBootData[i];
          let alpha = 0;
          if (bootProgress > data.delay) {
            alpha = Math.min(1, (bootProgress - data.delay) / data.duration);
            alpha = alpha * (2 - alpha); // ease out quad
          }
          nodeColorAttr.setW(i, alpha);
        }
        nodeColorAttr.needsUpdate = true;

        // Animate lines
        const lineColorAttr = lineGeometry.attributes.color as THREE.BufferAttribute;
        for (let i = 0; i < synapses.length; i++) {
          const syn = synapses[i];
          let alpha = 0;
          if (bootProgress > syn.delay) {
            alpha = Math.min(1, (bootProgress - syn.delay) / syn.duration);
            alpha = alpha * (2 - alpha);
          }
          const finalAlpha = alpha * syn.maxAlpha;
          lineColorAttr.setW(i * 2, finalAlpha);
          lineColorAttr.setW(i * 2 + 1, finalAlpha);
        }
        lineColorAttr.needsUpdate = true;

        // Core activation (happens around 1.6s)
        const coreDelay = 1.6;
        if (bootProgress > coreDelay) {
          let coreAlpha = Math.min(1, (bootProgress - coreDelay) / 0.8);
          // Small burst at the beginning
          const burst = Math.max(0, 1 - Math.abs(bootProgress - coreDelay - 0.2) * 3) * 0.2;
          coreMat.opacity = (coreAlpha * 0.16) + burst;
        }

        // Signal pulses activation (happens around 1.2s)
        const pulseColorAttr = pulseGeometry.attributes.color as THREE.BufferAttribute;
        const pulseDelay = 1.2;
        let pAlpha = 0;
        if (bootProgress > pulseDelay) {
           pAlpha = Math.min(1, (bootProgress - pulseDelay) / 0.6);
        }
        for (let i = 0; i < pulseCount; i++) {
           pulseColorAttr.setW(i, pAlpha);
        }
        pulseColorAttr.needsUpdate = true;
      }

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;
      targetScrollY += (scrollY - targetScrollY) * 0.05;

      // Group rotation influenced by time, cursor, and scroll parallax
      neuralGroup.rotation.y = elapsedTime * 0.08 + targetX * 0.45 + targetScrollY * 0.0006;
      neuralGroup.rotation.x = Math.sin(elapsedTime * 0.06) * 0.12 - targetY * 0.35 + Math.sin(targetScrollY * 0.0004) * 0.1;
      neuralGroup.rotation.z = Math.cos(elapsedTime * 0.05) * 0.08;
      neuralGroup.position.y = -targetScrollY * 0.0012;

      // Core pulsing
      const scale = 1 + Math.sin(elapsedTime * 1.4) * 0.04;
      coreMesh.scale.set(scale, scale, scale);
      coreMesh.rotation.y = -elapsedTime * 0.15;
      coreMesh.rotation.z = elapsedTime * 0.08;

      // Update traveling action potentials (pulses)
      if (synapses.length > 0) {
        const positions = pulseGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < pulseCount; i++) {
          const pulse = activePulses[i];
          pulse.progress += pulse.speed;
          if (pulse.progress >= 1.0) {
            pulse.progress = 0;
            pulse.synapseIndex = Math.floor(Math.random() * synapses.length);
          }

          const syn = synapses[pulse.synapseIndex];
          if (syn) {
            const px = syn.start.x + (syn.end.x - syn.start.x) * pulse.progress;
            const py = syn.start.y + (syn.end.y - syn.start.y) * pulse.progress;
            const pz = syn.start.z + (syn.end.z - syn.start.z) * pulse.progress;

            positions[i * 3] = px;
            positions[i * 3 + 1] = py;
            positions[i * 3 + 2] = pz;
          }
        }
        pulseGeometry.attributes.position.needsUpdate = true;
      }

      bgParticles.rotation.y = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Responsive Resizing
    const handleResize = () => {
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.position.z = w < 768 ? 30 : 24;
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
      className={`${className} transition-opacity duration-700`} 
      aria-hidden="true" 
    />
  );
};
