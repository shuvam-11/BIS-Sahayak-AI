import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShieldCheck, FileText, Award, CheckCircle2 } from 'lucide-react';

interface Props {
  className?: string;
  onNodeClick?: (category: string) => void;
}

export const KnowledgeCore3D: React.FC<Props> = ({ className = '', onNodeClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [activeFeature, setActiveFeature] = useState<string>('Verified Standards');

  useEffect(() => {
    if (!mountRef.current) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Setup Three.js scene
    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      setWebGLSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    // Ambient and Directional Lights
    const ambientLight = new THREE.AmbientLight(0xf0f5ff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x264796, 2.0);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const goldFill = new THREE.DirectionalLight(0xf59e0b, 0.9);
    goldFill.position.set(-5, -4, -2);
    scene.add(goldFill);

    // Root Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Core: Inner Icosahedron with Wireframe + Translucent Glass Sphere
    const innerGeo = new THREE.IcosahedronGeometry(2.4, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x264796,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
      roughness: 0.2,
      metalness: 0.8
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    const nucleusGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const nucleusMat = new THREE.MeshPhysicalMaterial({
      color: 0x264796,
      transmission: 0.65,
      opacity: 0.85,
      transparent: true,
      roughness: 0.15,
      metalness: 0.2,
      ior: 1.4
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleusMesh);

    // 2. Concentric Orbit Rings (representing BIS Verification rings)
    const ring1Geo = new THREE.RingGeometry(3.6, 3.65, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x264796, side: THREE.DoubleSide, transparent: true, opacity: 0.45 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2Geo = new THREE.RingGeometry(4.6, 4.65, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // 3. Floating Standard Knowledge Nodes
    const nodeCount = 5;
    const nodeGroup = new THREE.Group();
    coreGroup.add(nodeGroup);

    const nodeGeometry = new THREE.BoxGeometry(0.7, 0.9, 0.15);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.2
    });

    const nodeColors = [0x264796, 0x10b981, 0x264796, 0xf59e0b, 0x264796];
    const nodes: THREE.Mesh[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 4.2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.65;
      const z = Math.sin(angle) * 2;

      const nodeMat = nodeMaterial.clone();
      (nodeMat as THREE.MeshStandardMaterial).color.setHex(nodeColors[i % nodeColors.length]);
      const node = new THREE.Mesh(nodeGeometry, nodeMat);
      node.position.set(x, y, z);
      node.lookAt(0, 0, 0);
      nodeGroup.add(node);
      nodes.push(node);
    }

    // 4. Soft particle cloud for neural linkages
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.0 + Math.random() * 3.5;
      const sinPhi = Math.sin(phi);
      positions[i] = r * sinPhi * Math.cos(theta);
      positions[i + 1] = r * sinPhi * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x264796,
      size: 0.09,
      transparent: true,
      opacity: 0.65
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    coreGroup.add(particles);

    // Mouse interactivity
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.7;
      targetY = y * 0.7;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Smooth rotation
        coreGroup.rotation.y += 0.005;
        ring1.rotation.z += 0.003;
        ring2.rotation.z -= 0.004;
        innerMesh.rotation.x += 0.004;

        // Subtle floating
        coreGroup.position.y = Math.sin(elapsed * 1.2) * 0.25;

        // Node orbiting
        nodeGroup.rotation.y = -elapsed * 0.15;
      }

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      coreGroup.rotation.x = mouseY;
      coreGroup.rotation.y += mouseX * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (renderer) {
        renderer.dispose();
      }
      container.innerHTML = '';
    };
  }, []);

  return (
    <div className={`relative w-full h-[380px] sm:h-[440px] md:h-[500px] flex items-center justify-center ${className}`}>
      {/* 3D Canvas Mount */}
      {webGLSupported ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        /* Fallback if WebGL unavailable */
        <div className="w-64 h-64 rounded-full border border-slate-200 bg-gradient-to-tr from-slate-50 to-blue-50/40 flex items-center justify-center shadow-inner">
          <ShieldCheck className="w-24 h-24 text-bis-blue animate-pulse" />
        </div>
      )}

      {/* Floating Interactive Badges around Core */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs flex items-center gap-2 pointer-events-none sm:pointer-events-auto">
        <span className="w-2.5 h-2.5 rounded-full bg-bis-emerald animate-ping" />
        <span className="text-xs font-semibold text-slate-800">BIS Knowledge Core Active</span>
      </div>

      <button
        onClick={() => {
          setActiveFeature('Indian Standards');
          onNodeClick?.('Indian Standards');
        }}
        className="absolute bottom-6 left-2 sm:left-6 z-10 bg-white/90 hover:bg-white backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-all hover:scale-105 flex items-center gap-2 text-xs font-medium text-slate-700"
      >
        <FileText className="w-4 h-4 text-bis-blue" />
        <span>Indian Standards</span>
      </button>

      <button
        onClick={() => {
          setActiveFeature('Certification Schemes');
          onNodeClick?.('Certification');
        }}
        className="absolute top-8 right-2 sm:right-6 z-10 bg-white/90 hover:bg-white backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-all hover:scale-105 flex items-center gap-2 text-xs font-medium text-slate-700"
      >
        <Award className="w-4 h-4 text-bis-saffron" />
        <span>Certification</span>
      </button>

      <button
        onClick={() => {
          setActiveFeature('Verified Clauses');
          onNodeClick?.('Testing');
        }}
        className="absolute bottom-6 right-2 sm:right-6 z-10 bg-white/90 hover:bg-white backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-all hover:scale-105 flex items-center gap-2 text-xs font-medium text-slate-700"
      >
        <ShieldCheck className="w-4 h-4 text-bis-emerald" />
        <span>Source or Refuse</span>
      </button>
    </div>
  );
};
