"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  animate,
  cancelFrame,
  frame,
  motionValue,
  press,
  transformValue,
} from "motion";
import { threeEffect } from "motion/three";
import * as THREE from "three/webgpu";
import {
  attribute,
  cos,
  mix,
  positionLocal,
  sin,
  time,
  uniform,
  vec3,
} from "three/tsl";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Layers,
  Globe2,
  Lock,
  Unlock,
  CheckCircle2,
} from "lucide-react";

export interface MacroScene {
  id: string;
  title: string;
  code: string;
  subtitle: string;
  provenance: string;
  url: string;
  metric: string;
  metricLabel: string;
}

export const MACRO_SCENES: MacroScene[] = [
  {
    id: "global-nexus",
    title: "Global Trade & Monetary Nexus",
    code: "SERIES 01 // ICP-2024",
    subtitle: "World Bank ICP & Sovereign Maritime Capital Routing",
    provenance: "World Bank WDI & IMF Balance of Payments",
    url: "/photos/macro/1.jpg",
    metric: "$105.4T",
    metricLabel: "Global Output Routed",
  },
  {
    id: "sovereign-floor",
    title: "Sovereign Intelligence Center",
    code: "SERIES 02 // NAS-SNA08",
    subtitle: "MoSPI National Accounts Floor & High-Frequency Telemetry",
    provenance: "MoSPI NSO Advance Estimates & GSTN Feed",
    url: "/photos/macro/2.jpg",
    metric: "₹295.4L Cr",
    metricLabel: "India Nominal Benchmark",
  },
  {
    id: "treasury-vault",
    title: "Central Bank Treasury & Mint",
    code: "SERIES 03 // RBI-WSS",
    subtitle: "Sovereign Foreign Reserves & Monetary Authority Nexus",
    provenance: "Reserve Bank of India Weekly Statistical Supp.",
    url: "/photos/macro/3.jpg",
    metric: "$652.9B",
    metricLabel: "Sovereign Forex Reserves",
  },
];

interface SovereignParticleGlobeProps {
  className?: string;
  stageHeight?: string;
  showEditorialCard?: boolean;
}

export function SovereignParticleGlobe({
  className = "",
  stageHeight = "h-[500px] sm:h-[580px] lg:h-[640px]",
  showEditorialCard = true,
}: SovereignParticleGlobeProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [isLockedGlobe, setIsLockedGlobe] = useState(false);
  const [isStageExpanded, setIsStageExpanded] = useState(false);
  const [currentGlobeAmount, setCurrentGlobeAmount] = useState(0);
  const [particleCount, setParticleCount] = useState(25000);

  // References to keep track of Three runtime objects
  const cleanupRef = useRef<(() => void) | null>(null);
  const globeValueRef = useRef<any>(null);
  const sceneSwitchRef = useRef<((url: string) => Promise<void>) | null>(null);

  const activeScene = MACRO_SCENES[activeSceneIdx];

  // Helper smooth fade mapping for the high-resolution overlay
  const highResolutionMix = (globeAmount: number) => {
    const amount = Math.max(globeAmount, 0);
    const start = 0.005;
    const end = 0.035;
    const t = Math.min(1, Math.max(0, (amount - start) / (end - start)));
    return 1 - t * t * (3 - 2 * t);
  };

  const initRuntime = useCallback(async () => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    // Teardown any previous run
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    try {
      const globe = uniform(1);
      const globeValue = motionValue(1);
      globeValueRef.current = globeValue;

      // Subscribe local state for telemetry indicator
      const unsubGlobeValue = globeValue.on("change", (latest: number) => {
        setCurrentGlobeAmount(Number(latest.toFixed(3)));
      });

      const COLUMNS = 200;
      let globeYaw = Math.random() * Math.PI * 2;

      // Try WebGPURenderer with automatic backend negotiation
      const renderer = new THREE.WebGPURenderer({
        canvas,
        antialias: true,
      });

      await renderer.init();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xe6e5df); // Warm Antimetal paper tone
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 4;

      let particlesObj: any = null;
      let photoMeshObj: any = null;
      let pressCleanup: (() => void) | null = null;
      let isUnmounted = false;

      const loadPhoto = (url: string): Promise<any> => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.crossOrigin = "anonymous";
          image.onload = () => {
            const source = document.createElement("canvas");
            source.width = image.naturalWidth;
            source.height = image.naturalHeight;

            const context = source.getContext("2d", { willReadFrequently: true });
            if (!context) {
              reject(new Error("Failed to get 2d context"));
              return;
            }
            context.drawImage(image, 0, 0);

            const map = new THREE.Texture(image);
            map.colorSpace = THREE.SRGBColorSpace;
            map.needsUpdate = true;

            resolve({
              width: source.width,
              height: source.height,
              pixels: context.getImageData(0, 0, source.width, source.height).data,
              map,
            });
          };
          image.onerror = () => reject(new Error(`Failed to load ${url}`));
          image.src = url;
        });
      };

      const createParticles = (photo: any) => {
        const imageAspect = photo.width / photo.height;
        const rows = Math.round(COLUMNS / imageAspect);
        const count = COLUMNS * rows;
        setParticleCount(count);

        const imagePositions = new Float32Array(count * 3);
        const globePositions = new Float32Array(count * 3);
        const colours = new Float32Array(count * 3);
        const phases = new Float32Array(count);
        const speeds = new Float32Array(count);
        const colour = new THREE.Color();

        for (let index = 0; index < count; index++) {
          const column = index % COLUMNS;
          const row = Math.floor(index / COLUMNS);
          const sampleX = Math.min(
            photo.width - 1,
            Math.floor(((column + 0.5) / COLUMNS) * photo.width)
          );
          const sampleY = Math.min(
            photo.height - 1,
            Math.floor(((row + 0.5) / rows) * photo.height)
          );
          const pixel = (sampleY * photo.width + sampleX) * 4;
          const offset = index * 3;

          colour.setRGB(
            photo.pixels[pixel] / 255,
            photo.pixels[pixel + 1] / 255,
            photo.pixels[pixel + 2] / 255,
            THREE.SRGBColorSpace
          );
          colours[offset] = colour.r;
          colours[offset + 1] = colour.g;
          colours[offset + 2] = colour.b;
          phases[index] = Math.random() * Math.PI * 2;
          speeds[index] = 0.7 + Math.random() * 0.35;
        }

        const geometry = (new THREE.InstancedBufferGeometry() as any).copy(
          new THREE.PlaneGeometry(1, 1) as any
        );
        geometry.instanceCount = count;
        geometry.setAttribute(
          "imagePosition",
          new THREE.InstancedBufferAttribute(imagePositions, 3)
        );
        geometry.setAttribute(
          "globePosition",
          new THREE.InstancedBufferAttribute(globePositions, 3)
        );
        geometry.setAttribute(
          "colour",
          new THREE.InstancedBufferAttribute(colours, 3)
        );
        geometry.setAttribute("phase", new THREE.InstancedBufferAttribute(phases, 1));
        geometry.setAttribute("speed", new THREE.InstancedBufferAttribute(speeds, 1));

        const imagePosition = attribute("imagePosition");
        const spherePosition = attribute("globePosition");
        const phase = attribute("phase");
        const speed = attribute("speed");
        const particleSize = uniform(new THREE.Vector2(0.01, 0.01));
        const turbulence = vec3(
          sin(time.mul(speed.add(0.6)).add(phase)).mul(0.045),
          cos(time.mul(speed.add(0.37)).add(phase.mul(1.71))).mul(0.035),
          sin(time.mul(speed.add(0.22)).add(phase.mul(2.13))).mul(0.045)
        );
        const material = new THREE.MeshBasicNodeMaterial({
          toneMapped: false,
        });

        material.colorNode = attribute("colour");
        const particleCenter = mix(
          imagePosition,
          spherePosition.add(turbulence),
          globe
        );
        material.positionNode = particleCenter.add(
          vec3(positionLocal.xy.mul(particleSize), 0)
        );

        return {
          imageAspect,
          columns: COLUMNS,
          rows,
          particleSize,
          object: new THREE.Mesh(geometry, material as any),
        };
      };

      const createPhotoOverlay = (photo: any) => {
        const photoMaterial = new THREE.MeshBasicMaterial({
          map: photo.map,
          toneMapped: false,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          opacity: 0,
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), photoMaterial);
        mesh.renderOrder = 1;
        return mesh;
      };

      const layoutParticles = (
        particles: any,
        photoMesh: any,
        aspect: number
      ) => {
        const { columns, imageAspect, object, particleSize, rows } = particles;
        const imageHalfHeight = Math.min(0.72, (0.86 * aspect) / imageAspect);
        const imageHalfWidth = imageHalfHeight * imageAspect;
        const globeRadius = Math.min(0.58, aspect * 0.82);
        const position = object.geometry.getAttribute("imagePosition");
        const sphere = object.geometry.getAttribute("globePosition");
        const yawCos = Math.cos(globeYaw);
        const yawSin = Math.sin(globeYaw);
        const tilt = -0.28;

        for (let index = 0; index < position.count; index++) {
          const column = index % columns;
          const row = Math.floor(index / columns);
          const x = (column + 0.5) / columns;
          const y = (row + 0.5) / rows;
          const sphereY = 1 - (index / Math.max(position.count - 1, 1)) * 2;
          const ringRadius = Math.sqrt(Math.max(0, 1 - sphereY * sphereY));
          const angle = index * 2.39996323;
          const sphereX = Math.cos(angle) * ringRadius;
          const sphereZ = Math.sin(angle) * ringRadius;
          const spunX = sphereX * yawCos + sphereZ * yawSin;
          const spunZ = -sphereX * yawSin + sphereZ * yawCos;

          position.setXYZ(
            index,
            (x - 0.5) * imageHalfWidth * 2,
            (0.5 - y) * imageHalfHeight * 2,
            0
          );
          sphere.setXYZ(
            index,
            spunX * globeRadius,
            (sphereY * Math.cos(tilt) - spunZ * Math.sin(tilt)) * globeRadius,
            (sphereY * Math.sin(tilt) + spunZ * Math.cos(tilt)) * globeRadius
          );
        }

        position.needsUpdate = true;
        sphere.needsUpdate = true;
        particleSize.value.set(
          ((imageHalfWidth * 2) / columns) * 1.01,
          ((imageHalfHeight * 2) / rows) * 1.01
        );
        photoMesh.scale.set(imageHalfWidth * 2, imageHalfHeight * 2, 1);
      };

      const runParticleMotion = (photoMesh: any) => {
        threeEffect(globe, { value: globeValue });
        threeEffect(photoMesh.material, {
          opacity: transformValue(() => highResolutionMix(globeValue.get())),
        });

        // Initial settling animation: start as globe, spring into photograph
        animate(globeValue, 0, {
          type: "spring",
          stiffness: 55,
          damping: 16,
          mass: 1,
          delay: 0.8,
        });

        // Press interaction on canvas
        pressCleanup = press(canvas, () => {
          setIsPressing(true);
          animate(globeValue, 1, {
            type: "spring",
            stiffness: 120,
            damping: 18,
            mass: 0.9,
          });

          return () => {
            setIsPressing(false);
            if (!isLockedGlobe) {
              animate(globeValue, 0, {
                type: "spring",
                stiffness: 70,
                damping: 16,
                mass: 1,
              });
            }
          };
        });
      };

      const loadAndBuildScene = async (url: string) => {
        if (particlesObj) {
          scene.remove(particlesObj.object);
          particlesObj.object.geometry.dispose();
          particlesObj.object.material.dispose();
        }
        if (photoMeshObj) {
          scene.remove(photoMeshObj);
          photoMeshObj.geometry.dispose();
          photoMeshObj.material.dispose();
        }

        const photo = await loadPhoto(url);
        if (isUnmounted) return;

        particlesObj = createParticles(photo);
        photoMeshObj = createPhotoOverlay(photo);

        scene.add(particlesObj.object);
        scene.add(photoMeshObj);

        const width = Math.max(stage.clientWidth, 1);
        const height = Math.max(stage.clientHeight, 1);
        const aspect = width / height;

        renderer.setSize(width, height, false);
        camera.left = -aspect;
        camera.right = aspect;
        camera.top = 1;
        camera.bottom = -1;
        camera.updateProjectionMatrix();
        layoutParticles(particlesObj, photoMeshObj, aspect);

        runParticleMotion(photoMeshObj);
      };

      sceneSwitchRef.current = loadAndBuildScene;

      await loadAndBuildScene(MACRO_SCENES[activeSceneIdx].url);
      if (isUnmounted) return;

      const resize = () => {
        if (!stage || !canvas) return;
        const width = Math.max(stage.clientWidth, 1);
        const height = Math.max(stage.clientHeight, 1);
        const aspect = width / height;

        renderer.setSize(width, height, false);
        camera.left = -aspect;
        camera.right = aspect;
        camera.top = 1;
        camera.bottom = -1;
        camera.updateProjectionMatrix();
        if (particlesObj && photoMeshObj) {
          layoutParticles(particlesObj, photoMeshObj, aspect);
        }
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);

      canvas.dataset.ready = "true";
      setIsReady(true);

      // Render loop via motion frame
      let isRunning = true;
      const renderFrame = () => {
        if (isRunning && renderer && scene && camera) {
          // Slow ambient yaw spin when formed as globe
          if (globeValue.get() > 0.05) {
            globeYaw += 0.0025 * globeValue.get();
            if (particlesObj && photoMeshObj) {
              const width = Math.max(stage.clientWidth, 1);
              const height = Math.max(stage.clientHeight, 1);
              layoutParticles(particlesObj, photoMeshObj, width / height);
            }
          }
          renderer.render(scene, camera);
        }
      };

      frame.render(renderFrame, true);

      cleanupRef.current = () => {
        isUnmounted = true;
        isRunning = false;
        if (pressCleanup) pressCleanup();
        unsubGlobeValue();
        resizeObserver.disconnect();
        cancelFrame(renderFrame);
        if (renderer && typeof renderer.dispose === "function") {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.error("WebGPU initialization failed:", err);
      setIsReady(false);
    }
  }, [activeSceneIdx, isLockedGlobe]);

  useEffect(() => {
    initRuntime();
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [initRuntime]);

  const handleSceneSelect = async (idx: number) => {
    setActiveSceneIdx(idx);
    if (sceneSwitchRef.current) {
      setIsReady(false);
      try {
        await sceneSwitchRef.current(MACRO_SCENES[idx].url);
        setIsReady(true);
      } catch {
        setIsReady(false);
      }
    }
  };

  const handleToggleGlobeLock = () => {
    if (!globeValueRef.current) return;
    const nextLocked = !isLockedGlobe;
    setIsLockedGlobe(nextLocked);
    if (nextLocked) {
      animate(globeValueRef.current, 1, {
        type: "spring",
        stiffness: 100,
        damping: 18,
      });
    } else {
      animate(globeValueRef.current, 0, {
        type: "spring",
        stiffness: 70,
        damping: 16,
      });
    }
  };

  const handleTriggerSpring = (toValue: number) => {
    if (globeValueRef.current) {
      animate(globeValueRef.current, toValue, {
        type: "spring",
        stiffness: toValue === 1 ? 120 : 70,
        damping: 16,
        mass: 1,
      });
    }
  };

  return (
    <div
      className={`relative w-full rounded-xl border border-[rgba(20,21,23,0.14)] bg-[#E6E5DF] shadow-md overflow-hidden ${
        isStageExpanded
          ? "fixed inset-0 z-50 rounded-none border-none h-screen w-screen bg-[#141416]"
          : className
      }`}
    >
      {/* 1. TOP EDITORIAL MASTHEAD & PROVENANCE BAR */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 border-b px-5 py-3.5 backdrop-blur-md transition-colors ${
          isStageExpanded
            ? "border-white/10 bg-[#141416]/90 text-white"
            : "border-[rgba(20,21,23,0.12)] bg-[#ECEBE5]/95 text-[#141416]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                currentGlobeAmount > 0.5
                  ? "bg-[#D94E34] animate-pulse"
                  : "bg-[#059669]"
              }`}
            />
            <span
              className={`font-mono text-[11px] font-bold tracking-widest uppercase ${
                isStageExpanded ? "text-[#E5A83B]" : "text-[#141416]"
              }`}
            >
              {activeScene.code}
            </span>
          </div>

          <span
            className={`hidden sm:inline-block h-3.5 w-px ${
              isStageExpanded ? "bg-white/20" : "bg-black/15"
            }`}
          />

          <span
            className={`font-mono text-[10px] hidden md:inline-block ${
              isStageExpanded ? "text-white/60" : "text-[#57585C]"
            }`}
          >
            {particleCount.toLocaleString()} PARTICLES • WEBGPU TSL MORPH
          </span>
        </div>

        {/* Scene Selection Pills */}
        <div className="flex items-center gap-1 rounded-full border border-[rgba(20,21,23,0.12)] bg-[#DFDED8]/70 p-1">
          {MACRO_SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => handleSceneSelect(idx)}
              className={`btn-realistic rounded-full px-3 py-1 text-[11px] font-mono transition-all ${
                activeSceneIdx === idx
                  ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                  : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
              }`}
              title={scene.title}
            >
              0{idx + 1}
            </button>
          ))}
        </div>

        {/* Header Action Tools */}
        <div className="flex items-center gap-2">
          {/* Lock Globe Mode Toggle */}
          <button
            onClick={handleToggleGlobeLock}
            className={`btn-realistic flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-mono transition-all ${
              isLockedGlobe
                ? "border-[#D94E34] bg-[#D94E34] text-white"
                : isStageExpanded
                ? "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                : "border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] text-[#141416] hover:bg-black/5"
            }`}
            title="Lock 3D Particle Globe Rotation"
          >
            {isLockedGlobe ? (
              <Lock className="h-3 w-3" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}
            <span className="hidden sm:inline">
              {isLockedGlobe ? "Locked 3D" : "Hold Mode"}
            </span>
          </button>

          {/* Full Stage Maximize / Minimize Button */}
          <button
            onClick={() => setIsStageExpanded(!isStageExpanded)}
            className={`btn-realistic flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
              isStageExpanded
                ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                : "border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] text-[#141416] hover:bg-black/5"
            }`}
            title={isStageExpanded ? "Exit Fullscreen Stage" : "Expand Fullscreen Stage"}
          >
            {isStageExpanded ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE MOTION STAGE CANVAS CONTAINER */}
      <div
        ref={stageRef}
        className={`stage relative w-full select-none overflow-hidden ${
          isStageExpanded ? "h-[calc(100vh-140px)]" : stageHeight
        }`}
      >
        {/* Subtle Architectural Crosshairs */}
        <div className="pointer-events-none absolute inset-0 z-10 p-6 flex flex-col justify-between">
          <div className="flex justify-between font-mono text-[10px] text-[#828387] opacity-60">
            <span>+ TOP_LEFT // OBS_NORTH</span>
            <span>+ TOP_RIGHT // TSL_RUN</span>
          </div>
          <div className="flex justify-between font-mono text-[10px] text-[#828387] opacity-60">
            <span>+ BTM_LEFT // NAS_MORTICE</span>
            <span>+ BTM_RIGHT // LAT_28.61</span>
          </div>
        </div>

        {/* The Motion Stage Canvas */}
        <canvas
          ref={canvasRef}
          role="button"
          tabIndex={0}
          aria-label="Hold to form a particle globe"
          className="block w-full h-full cursor-crosshair touch-none transition-opacity duration-300"
          style={{ opacity: isReady ? 1 : 0.4 }}
        />

        {/* Dynamic Tactile Hold Indicator Badge (Center-Bottom) */}
        <div className="pointer-events-none absolute bottom-6 inset-x-0 z-20 flex flex-col items-center justify-center gap-2">
          <div
            className={`flex items-center gap-2.5 rounded-full border px-4 py-1.5 shadow-lg backdrop-blur-md transition-all duration-200 ${
              isPressing || isLockedGlobe
                ? "border-[#D94E34]/50 bg-[#141416]/90 text-white scale-105"
                : "border-[rgba(20,21,23,0.2)] bg-[#ECEBE5]/90 text-[#141416]"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full transition-colors ${
                isPressing || isLockedGlobe
                  ? "bg-[#D94E34] animate-ping"
                  : "bg-[#059669]"
              }`}
            />
            <span className="font-mono text-xs font-bold tracking-tight">
              {isPressing || isLockedGlobe
                ? "3D PARTICLE GLOBE ACTIVE"
                : "PRESS & HOLD CANVAS TO FORM 3D GLOBE"}
            </span>

            <span className="font-mono text-[10px] text-[#828387] pl-1 border-l border-[rgba(20,21,23,0.15)]">
              {(currentGlobeAmount * 100).toFixed(0)}% MORPH
            </span>
          </div>

          <p className="font-mono text-[10px] text-[#828387] tracking-wider uppercase hidden sm:block">
            TSL INSTANCED VERTEX SHADER • FIBONACCI SPHERE DISTRIBUTION
          </p>
        </div>

        {/* Floating Telemetry Metric Stamp (Top-Left of Canvas) */}
        <div className="pointer-events-none absolute top-5 left-5 z-20 hidden sm:block rounded-md border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5]/90 p-3 shadow-xs backdrop-blur-xs max-w-xs">
          <div className="font-mono text-[9px] uppercase tracking-wider text-[#828387]">
            {activeScene.metricLabel}
          </div>
          <div className="font-serif text-2xl font-black text-[#141416] leading-none mt-1">
            {activeScene.metric}
          </div>
          <div className="mt-1.5 pt-1 border-t border-[rgba(20,21,23,0.08)] font-mono text-[9px] text-[#57585C]">
            PROVENANCE: {activeScene.provenance}
          </div>
        </div>

        {/* Touch / Quick Trigger Buttons for Mobile / Click */}
        <div className="absolute top-5 right-5 z-20 flex flex-col gap-2">
          <button
            onMouseDown={() => handleTriggerSpring(1)}
            onMouseUp={() => !isLockedGlobe && handleTriggerSpring(0)}
            onTouchStart={() => handleTriggerSpring(1)}
            onTouchEnd={() => !isLockedGlobe && handleTriggerSpring(0)}
            className="btn-realistic btn-solid-black px-3.5 py-1.5 text-xs font-mono tracking-wide shadow-md"
          >
            Hold 3D Globe
          </button>
          <button
            onClick={() => handleTriggerSpring(0)}
            className="btn-realistic btn-outline-pill px-3.5 py-1 text-[11px] font-mono bg-[#ECEBE5]/80 backdrop-blur-xs"
          >
            Reset Image
          </button>
        </div>
      </div>

      {/* 3. PROFESSIONAL EDITORIAL TYPOGRAPHY & CAPTION FOOTER */}
      {showEditorialCard && (
        <div
          className={`border-t p-5 sm:p-6 transition-colors ${
            isStageExpanded
              ? "border-white/10 bg-[#1B1C1F] text-white"
              : "border-[rgba(20,21,23,0.12)] bg-[#ECEBE5] text-[#141416]"
          }`}
        >
          <div className="grid gap-6 md:grid-cols-12 items-center">
            {/* Headline and Thesis (8 cols) */}
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#D94E34]">
                  OBSERVATORY TELEMETRY
                </span>
                <span className="text-[#828387]">•</span>
                <span className="font-mono text-[10px] text-[#828387]">
                  {activeScene.provenance}
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-tight">
                {activeScene.title}
              </h3>
              <p
                className={`font-sans text-xs sm:text-sm leading-relaxed max-w-2xl ${
                  isStageExpanded ? "text-white/70" : "text-[#57585C]"
                }`}
              >
                {activeScene.subtitle}. High-resolution photographic fidelity
                dissolves into a Fibonacci particle lattice governed by Three
                Shading Language (TSL) uniforms and harmonic turbulence vectors.
              </p>
            </div>

            {/* Quick Metrics & Scene Selector Links (4 cols) */}
            <div className="md:col-span-4 flex flex-col gap-2 border-t md:border-t-0 md:border-l border-[rgba(20,21,23,0.1)] md:pl-6 pt-3 md:pt-0">
              <span className="font-mono text-[10px] uppercase font-bold text-[#828387]">
                SCENE RECONCILIATION
              </span>
              <div className="flex flex-wrap gap-1.5">
                {MACRO_SCENES.map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => handleSceneSelect(idx)}
                    className={`btn-realistic rounded px-2.5 py-1 text-left text-xs font-mono transition-all ${
                      activeSceneIdx === idx
                        ? "bg-[#141416] text-[#ECEBE5] font-bold"
                        : "bg-[rgba(20,21,23,0.05)] text-[#57585C] hover:text-[#141416]"
                    }`}
                  >
                    0{idx + 1} {scene.title.split(" ")[0]}
                  </button>
                ))}
              </div>
              <div className="text-[10px] font-mono text-[#828387] pt-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-[#059669]" />
                <span>SNA 2008 & World Bank ICP Compliant</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
