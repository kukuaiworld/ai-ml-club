import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FiberStructureBackgroundProps {
  className?: string;
}

export const FiberStructureBackground: React.FC<FiberStructureBackgroundProps> = ({
  className = "fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const fiberBundleCount = isMobile ? 3 : 5;
    const strandsPerBundle = isMobile ? 10 : 16;
    const pointsPerStrand = isMobile ? 60 : 90;
    const photonCount = isMobile ? 30 : 65;
    const dustCount = isMobile ? 150 : 350;

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
    camera.position.set(0, 0, isMobile ? 32 : 26);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const fiberGroup = new THREE.Group();
    scene.add(fiberGroup);

    // 2. Optical Fiber Palette (Multi-Shade Purple Color Grading: Deep Plum, Royal Violet, Amethyst, Orchid, Lavender, White)
    const strandColors = [
      new THREE.Color('#6b21a8'), // Deep Royal Plum
      new THREE.Color('#7c3aed'), // Deep Violet
      new THREE.Color('#8b5cf6'), // Electric Violet
      new THREE.Color('#a855f7'), // Radiant Amethyst
      new THREE.Color('#c026d3'), // Warm Orchid-Purple
      new THREE.Color('#c084fc'), // Soft Lavender
      new THREE.Color('#e9d5ff'), // Pale Lilac
      new THREE.Color('#ffffff'), // Crisp White
    ];

    // 3. Generate 3D Fiber Spline Bundles
    // Each bundle follows a parametric helical / flow spline through 3D space
    const curves: THREE.CatmullRomCurve3[] = [];

    for (let b = 0; b < fiberBundleCount; b++) {
      // Base path trajectory for the bundle
      const angleOffset = (b / fiberBundleCount) * Math.PI * 2;
      const bundleBaseRadius = 7.5 + (b % 2) * 2.0;

      for (let s = 0; s < strandsPerBundle; s++) {
        const strandAngle = (s / strandsPerBundle) * Math.PI * 2;
        const strandRadius = 0.6 + Math.random() * 0.9;
        const points: THREE.Vector3[] = [];

        // 7 to 9 control points forming an elegant sweeping 3D fiber tract
        const numControlPoints = 8;
        for (let p = 0; p < numControlPoints; p++) {
          const t = p / (numControlPoints - 1);
          const z = (t - 0.5) * 38; // Span across Z depth

          // Twisting helical wave equation
          const waveAngle = angleOffset + t * Math.PI * 2.8 + (s * 0.15);
          const r = bundleBaseRadius + Math.sin(t * Math.PI * 3 + b) * 1.8;

          const cx = Math.cos(waveAngle) * r;
          const cy = Math.sin(waveAngle) * (r * 0.65) + Math.cos(t * Math.PI * 2) * 2.5;

          // Strand dispersion within the bundle
          const sx = cx + Math.cos(strandAngle + t * 4) * strandRadius;
          const sy = cy + Math.sin(strandAngle + t * 4) * strandRadius;

          points.push(new THREE.Vector3(sx, sy, z));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        curve.curveType = 'centripetal';
        curves.push(curve);

        // Sample points along the spline
        const curvePoints = curve.getPoints(pointsPerStrand);
        const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

        // Vertex colors fading along the fiber length
        const colors: number[] = [];
        const baseCol = strandColors[(b * strandsPerBundle + s) % strandColors.length];

        for (let i = 0; i <= pointsPerStrand; i++) {
          const progress = i / pointsPerStrand;
          // Soft fade at start and end of fiber
          const alphaFade = Math.sin(progress * Math.PI);
          colors.push(
            baseCol.r * (0.4 + alphaFade * 0.6),
            baseCol.g * (0.4 + alphaFade * 0.6),
            baseCol.b * (0.4 + alphaFade * 0.6)
          );
        }

        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.38,
          linewidth: 1,
        });

        const line = new THREE.Line(geometry, material);
        fiberGroup.add(line);
      }
    }

    // 4. Optical Fiber Photons / Signal Bursts Traveling Along Strands
    const photons: {
      curveIndex: number;
      progress: number;
      speed: number;
    }[] = [];

    for (let i = 0; i < photonCount; i++) {
      photons.push({
        curveIndex: Math.floor(Math.random() * curves.length),
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.007,
      });
    }

    const photonPositions = new Float32Array(photonCount * 3);
    const photonColors = new Float32Array(photonCount * 3);

    for (let i = 0; i < photonCount; i++) {
      photonColors[i * 3] = 0.9;     // R
      photonColors[i * 3 + 1] = 0.96; // G
      photonColors[i * 3 + 2] = 1.0;  // B (brilliant light cyan-white)
    }

    const photonGeometry = new THREE.BufferGeometry();
    photonGeometry.setAttribute('position', new THREE.BufferAttribute(photonPositions, 3));
    photonGeometry.setAttribute('color', new THREE.BufferAttribute(photonColors, 3));

    // Circular Glow Texture for Photons
    const createGlowTexture = () => {
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

    const photonMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.35 : 0.48,
      map: createGlowTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const photonsMesh = new THREE.Points(photonGeometry, photonMaterial);
    fiberGroup.add(photonsMesh);

    // 5. Fiber Cladding & Luminescent Microscopic Dust
    const dustGeometry = new THREE.BufferGeometry();
    const dustPos: number[] = [];
    for (let i = 0; i < dustCount; i++) {
      dustPos.push(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 40
      );
    }
    dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPos, 3));
    const dustMaterial = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xc084fc,
      transparent: true,
      opacity: 0.22,
    });
    const dustMesh = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustMesh);

    // 6. Interactive Mouse & Scroll Tracking
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

    // 7. Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;
      targetScrollY += (scrollY - targetScrollY) * 0.05;

      // Gentle continuous rotation & tilt
      fiberGroup.rotation.z = elapsedTime * 0.04 + targetScrollY * 0.0004;
      fiberGroup.rotation.y = Math.sin(elapsedTime * 0.05) * 0.15 + targetX * 0.45;
      fiberGroup.rotation.x = Math.cos(elapsedTime * 0.04) * 0.12 - targetY * 0.35 + Math.sin(targetScrollY * 0.0003) * 0.1;

      // Scroll camera navigation along the fiber conduit
      fiberGroup.position.z = Math.sin(targetScrollY * 0.0008) * 3.5;
      fiberGroup.position.y = -targetScrollY * 0.001;

      // Advance photons along their respective fiber splines
      const positions = photonGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < photonCount; i++) {
        const photon = photons[i];
        photon.progress += photon.speed;
        if (photon.progress >= 1.0) {
          photon.progress = 0;
          photon.curveIndex = Math.floor(Math.random() * curves.length);
        }

        const curve = curves[photon.curveIndex];
        if (curve) {
          const pt = curve.getPointAt(photon.progress);
          positions[i * 3] = pt.x;
          positions[i * 3 + 1] = pt.y;
          positions[i * 3 + 2] = pt.z;
        }
      }
      photonGeometry.attributes.position.needsUpdate = true;

      // Ambient dust drift
      dustMesh.rotation.z = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.position.z = w < 768 ? 32 : 26;
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
