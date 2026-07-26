import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { ShieldCheck, CheckCircle2, Server, Cpu, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Load log sequence
const loadingSteps = [
  'Initializing EcoWaste AI...',
  'Connecting to Gemini AI...',
  'Loading Smart Waste Engine...',
  'Preparing Carbon Analytics...',
  'Loading Multilingual Services...',
  'Synchronizing Dashboard...',
  'Ready.'
];

interface AILoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export function AILoader({ isLoading, onComplete }: AILoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [showContainer, setShowContainer] = useState(isLoading);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Status check states
  const [statusCheck, setStatusCheck] = useState({
    gemini: false,
    db: false,
    cache: false,
    security: false,
    modules: false
  });

  // Handle visibility transitions
  useEffect(() => {
    if (isLoading) {
      setShowContainer(true);
      setProgress(0);
      setCurrentStep(0);
      setLogMessages([]);
      setStatusCheck({
        gemini: false,
        db: false,
        cache: false,
        security: false,
        modules: false
      });
    } else {
      // Complete progress smoothly
      setProgress(100);
      setStatusCheck({
        gemini: true,
        db: true,
        cache: true,
        security: true,
        modules: true
      });
      // Delay container hiding for transition
      const timer = setTimeout(() => {
        setShowContainer(false);
        if (onComplete) onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onComplete]);

  // Simulate progress when active
  useEffect(() => {
    if (!isLoading || skipAnimation) return;

    // Fast initial progress, then slows down waiting for API to finish
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Wait at 90% for actual response
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isLoading, skipAnimation]);

  // Log steps and status checks mapping
  useEffect(() => {
    if (!isLoading || skipAnimation) return;

    const stepIndex = Math.min(
      Math.floor((progress / 100) * loadingSteps.length),
      loadingSteps.length - 1
    );

    if (stepIndex !== currentStep) {
      setCurrentStep(stepIndex);
      const text = loadingSteps[stepIndex];
      setLogMessages((prev) => {
        if (prev.includes(text)) return prev;
        return [...prev, text].slice(-4); // keep last 4 logs
      });

      // Animate checks based on progress milestones
      setStatusCheck((prev) => ({
        gemini: progress > 20 ? true : prev.gemini,
        db: progress > 40 ? true : prev.db,
        cache: progress > 60 ? true : prev.cache,
        security: progress > 85 ? true : prev.security,
        modules: progress > 95 ? true : prev.modules,
      }));
    }
  }, [progress, currentStep, isLoading, skipAnimation]);

  // Three.js holographic engine
  useEffect(() => {
    if (!showContainer || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (!parent) return;

    // Dimensions
    const width = parent.clientWidth || window.innerWidth;
    const height = parent.clientHeight || 500;

    // Scene Setup
    const scene = new THREE.Scene();
    
    // Camera Setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 8;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Group for entire model structure
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Core TorusKnot (holographic brain/energy center)
    const knotGeom = new THREE.TorusKnotGeometry(1.1, 0.35, 120, 16);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const coreKnot = new THREE.Mesh(knotGeom, knotMat);
    mainGroup.add(coreKnot);

    // 2. Rotating Holographic Rings
    const rings: THREE.Mesh[] = [];
    const ringMaterials = [
      { r: 2.2, color: 0x047857, speed: 0.015, axis: 'y' },
      { r: 2.5, color: 0x10b981, speed: -0.01, axis: 'x' },
      { r: 2.8, color: 0x34d399, speed: 0.005, axis: 'z' }
    ];

    ringMaterials.forEach((cfg) => {
      const ringGeom = new THREE.RingGeometry(cfg.r, cfg.r + 0.05, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
        wireframe: true
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      
      // Initial rotation
      if (cfg.axis === 'x') ring.rotation.x = Math.PI / 2;
      if (cfg.axis === 'y') ring.rotation.y = Math.PI / 4;
      
      mainGroup.add(ring);
      rings.push(ring);
    });

    // 3. Floating 3D Orbiting Objects (Bottle, Leaf, Earth, AI Chip, Carbon)
    const orbiters: { mesh: THREE.Group | THREE.Mesh; speed: number; radius: number; phase: number }[] = [];

    // Orbiter 1: Earth (Wireframe sphere)
    const earthGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const earthMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.5 });
    const earth = new THREE.Mesh(earthGeom, earthMat);
    
    // Orbiter 2: AI Chip (Box)
    const chipGeom = new THREE.BoxGeometry(0.4, 0.4, 0.1);
    const chipMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.6 });
    const chip = new THREE.Mesh(chipGeom, chipMat);

    // Orbiter 3: Leaf (Dodecahedron)
    const leafGeom = new THREE.DodecahedronGeometry(0.3);
    const leafMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.6 });
    const leaf = new THREE.Mesh(leafGeom, leafMat);

    // Orbiter 4: Plastic Bottle (Cylinder)
    const bottleGroup = new THREE.Group();
    const bodyGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 8);
    const neckGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.15, 8);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.5 });
    const body = new THREE.Mesh(bodyGeom, wireMat);
    const neck = new THREE.Mesh(neckGeom, wireMat);
    neck.position.y = 0.3;
    bottleGroup.add(body, neck);

    // Orbiter 5: Carbon Molecule (Connected Spheres)
    const carbonGroup = new THREE.Group();
    const atomGeom = new THREE.SphereGeometry(0.12, 8, 8);
    const atomMat = new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true, transparent: true, opacity: 0.65 });
    
    const atom1 = new THREE.Mesh(atomGeom, atomMat);
    const atom2 = new THREE.Mesh(atomGeom, atomMat);
    const atom3 = new THREE.Mesh(atomGeom, atomMat);
    atom2.position.set(0.25, 0.25, 0);
    atom3.position.set(-0.25, -0.25, 0);
    
    // Connective bonds
    const bondGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6);
    const bond = new THREE.Mesh(bondGeom, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 }));
    bond.rotation.z = Math.PI / 4;
    carbonGroup.add(atom1, atom2, atom3, bond);

    // Assemble orbiters config
    const rawOrbiters = [
      { mesh: earth, radius: 3.4, speed: 0.6, phase: 0 },
      { mesh: chip, radius: 3.4, speed: 0.8, phase: Math.PI * 0.4 },
      { mesh: leaf, radius: 3.4, speed: 0.5, phase: Math.PI * 0.8 },
      { mesh: bottleGroup, radius: 3.4, speed: 0.7, phase: Math.PI * 1.2 },
      { mesh: carbonGroup, radius: 3.4, speed: 0.9, phase: Math.PI * 1.6 }
    ];

    rawOrbiters.forEach((o) => {
      mainGroup.add(o.mesh);
      orbiters.push(o);
    });

    // 4. Digital Energy Particles
    const particleCount = 180;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const pSpeeds: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Spread in cylinder around core
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 4;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      pSpeeds.push(0.01 + Math.random() * 0.03);
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Ambient Lighting to add holographic depth
    const light1 = new THREE.PointLight(0x10b981, 15, 50);
    light1.position.set(0, 5, 5);
    scene.add(light1);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Rotate core knot
      coreKnot.rotation.y += 0.005;
      coreKnot.rotation.x += 0.003;

      // Rotate rings at different speeds
      rings.forEach((ring, idx) => {
        const cfg = ringMaterials[idx];
        if (cfg.axis === 'y') ring.rotation.y += cfg.speed;
        if (cfg.axis === 'x') ring.rotation.x += cfg.speed;
        if (cfg.axis === 'z') ring.rotation.z += cfg.speed;
      });

      // Animate Orbiters
      orbiters.forEach((o) => {
        const angle = time * o.speed + o.phase;
        o.mesh.position.x = Math.cos(angle) * o.radius;
        o.mesh.position.z = Math.sin(angle) * o.radius;
        o.mesh.position.y = Math.sin(angle * 2) * 0.8;
        
        // Self rotation
        o.mesh.rotation.x += 0.01;
        o.mesh.rotation.y += 0.015;
      });

      // Animate Particles rising
      const posArr = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += pSpeeds[i];
        if (posArr[i * 3 + 1] > 4) {
          posArr[i * 3 + 1] = -4; // reset at bottom
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Camera floating effect
      camera.position.x = Math.sin(time * 0.5) * 0.5;
      camera.position.y = Math.cos(time * 0.3) * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!parent) return;
      const w = parent.clientWidth || window.innerWidth;
      const h = parent.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      knotGeom.dispose();
      knotMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [showContainer]);

  if (!showContainer) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col justify-between overflow-hidden select-none"
        >
          {/* Animated Matrix Grid Background */}
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />

          {/* Top header HUD panel */}
          <div className="p-6 flex justify-between items-center w-full z-10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest">
                AI CORE ONLINE
              </span>
            </div>
            
            {/* Skip animation button */}
            <button
              onClick={() => {
                setSkipAnimation(true);
                setProgress(100);
                if (onComplete) onComplete();
              }}
              className="px-3 py-1 bg-gray-900/60 border border-gray-800 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 rounded-lg text-[10px] font-mono transition-colors flex items-center gap-1"
            >
              SKIP HUD <X size={10} />
            </button>
          </div>

          {/* Middle holographic Canvas */}
          <div className="relative flex-grow flex items-center justify-center min-h-[350px]">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
            
            {/* Floating Glassmorphic AI Status Panel (Left) */}
            <div className="absolute left-6 bottom-12 z-10 hidden md:block max-w-[200px] w-full">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="glass p-4 rounded-2xl border-emerald-500/10 shadow-lg text-left"
              >
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-3">AI CORE Status</div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className={statusCheck.gemini ? "text-emerald-500" : "text-gray-700"} />
                    <span className={statusCheck.gemini ? "text-gray-300" : "text-gray-600"}>Gemini AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server size={13} className={statusCheck.db ? "text-emerald-500" : "text-gray-700"} />
                    <span className={statusCheck.db ? "text-gray-300" : "text-gray-600"}>Database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu size={13} className={statusCheck.cache ? "text-emerald-500" : "text-gray-700"} />
                    <span className={statusCheck.cache ? "text-gray-300" : "text-gray-600"}>AI Cache</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={13} className={statusCheck.security ? "text-emerald-500" : "text-gray-700"} />
                    <span className={statusCheck.security ? "text-gray-300" : "text-gray-600"}>Auth Guard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw size={13} className={cn("text-emerald-500", statusCheck.modules ? "" : "animate-spin")} />
                    <span className="text-gray-300">Sync Core</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Live boot sequence logger (Right) */}
            <div className="absolute right-6 bottom-12 z-10 hidden md:block max-w-[280px] w-full">
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="glass p-4 rounded-2xl border-emerald-500/10 shadow-lg text-left font-mono text-[10px] space-y-1.5 min-h-[120px] bg-gray-950/40"
              >
                <div className="text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-800 pb-1">AI BOOT TRACE</div>
                {logMessages.map((log, i) => (
                  <div key={i} className="text-emerald-400 flex items-start gap-1">
                    <span className="text-emerald-600 font-bold">&gt;</span>
                    <span className="flex-1">{log}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Bottom energy progress panel */}
          <div className="p-8 max-w-lg mx-auto w-full z-10">
            <div className="flex justify-between items-center text-xs font-mono mb-2 text-gray-500">
              <span className="animate-pulse">STREAMING DATA BEAM</span>
              <span className="text-emerald-400 font-bold">{progress}%</span>
            </div>
            
            {/* Glowing Energy Beam Progress Bar */}
            <div className="relative w-full h-1.5 bg-gray-950/80 rounded-full border border-gray-800 overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-300 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
                style={{
                  boxShadow: '0 0 10px rgba(16,185,129,0.7), 0 0 20px rgba(16,185,129,0.4)'
                }}
              />
            </div>
            <div className="text-center mt-3 text-[10px] font-mono text-gray-600 dark:text-gray-500">
              ECOWASTE INTEL SYSTEM V1.0 · ALL LIGHTSPEED PROCESSES ACTIVE
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
