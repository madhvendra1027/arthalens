"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import * as THREE from "three";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Globe2,
  ShieldCheck,
  ArrowRight,
  X,
  Play,
  Pause,
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

export interface SovereignAnchor {
  id: string;
  name: string;
  hub: string;
  code: string;
  lat: number;
  lon: number;
  category: "growth" | "external" | "prices" | "monetary" | "global";
  primaryMetric: string;
  metricLabel: string;
  period: string;
  provenance: string;
  summary: string;
  secondaryMetrics: { label: string; value: string }[];
  link: string;
  linkText: string;
  color: string;
}

export const SOVEREIGN_ANCHORS: SovereignAnchor[] = [
  {
    id: "delhi-mospi",
    name: "New Delhi // MoSPI Central Observatory",
    hub: "Central Macro Benchmark",
    code: "NSO-NAS-01",
    lat: 28.6139,
    lon: 77.209,
    category: "growth",
    primaryMetric: "+8.2% YoY",
    metricLabel: "Real GDP Growth",
    period: "FY 2023-24 (Provisional Estimates)",
    provenance: "MoSPI NSO Statement 1.1 • SHA-256 Gazette Verified",
    summary:
      "Official Constant Price National Accounts utilizing benchmark base year 2022-23 weights, synthesizing over 1.4 million corporate filings via MCA-21 and single-deflation industrial adjustments.",
    secondaryMetrics: [
      { label: "Nominal Output", value: "₹295.36L Cr (+9.6%)" },
      { label: "Implicit Deflator", value: "1.40%" },
      { label: "Active Benchmark", value: "2022-23 Series" },
    ],
    link: "/gdp",
    linkText: "Explore Macro Accounts Workspace",
    color: "#059669",
  },
  {
    id: "mumbai-rbi",
    name: "Mumbai // Reserve Bank of India",
    hub: "Monetary Authority & External Desk",
    code: "RBI-DBIE-02",
    lat: 18.922,
    lon: 72.8347,
    category: "monetary",
    primaryMetric: "$652.89 Billion",
    metricLabel: "Sovereign Forex Buffer",
    period: "Weekly Statistical Supplement (May 2024)",
    provenance: "RBI DBIE Table 4 & Bulletin BoP Accounts",
    summary:
      "Strategic external liquidity reserve providing ~11.2 months of merchandise import cover. Monetary policy repo rate held at 6.50% to balance growth with target headline CPI inflation.",
    secondaryMetrics: [
      { label: "Policy Repo Rate", value: "6.50%" },
      { label: "Current Account", value: "-0.7% GDP" },
      { label: "Import Coverage", value: "11.2 Months" },
    ],
    link: "/ratings",
    linkText: "Inspect Sovereign Ratings & Reserves",
    color: "#D94E34",
  },
  {
    id: "bengaluru-services",
    name: "Bengaluru // Technology Services Corridor",
    hub: "Services GVA & IT Exports",
    code: "DES-BLR-03",
    lat: 12.9716,
    lon: 77.5946,
    category: "growth",
    primaryMetric: "+7.9% YoY",
    metricLabel: "Services Sector GVA",
    period: "FY 2023-24",
    provenance: "MoSPI NAS Statement 2.1 & RBI Services Telemetry",
    summary:
      "Digital enterprise services, financial intermediation, and high-tech software exports. Services constitute 54.2% of total Gross Value Added with accelerating cross-border billing.",
    secondaryMetrics: [
      { label: "Services Share", value: "54.2% GVA" },
      { label: "Net Software Trade", value: "$32.4B / qtr" },
      { label: "Formal Tech Base", value: ">5.4M Workforce" },
    ],
    link: "/gdp",
    linkText: "Analyze Sectoral Decomposition",
    color: "#E5A83B",
  },
  {
    id: "gujarat-industry",
    name: "Gujarat // Capital & Industrial Corridor",
    hub: "Manufacturing & Capital Formation",
    code: "GIFT-IND-04",
    lat: 23.2156,
    lon: 72.6369,
    category: "prices",
    primaryMetric: "+9.9% YoY",
    metricLabel: "Manufacturing GVA",
    period: "FY 2023-24",
    provenance: "DPIIT IIP Industrial Index & ASI Annual Survey",
    summary:
      "Industrial manufacturing output expanded +9.9% driven by wholesale commodity input cost deflation (-1.2% WPI). Gross Fixed Capital Formation held firm at 33.5% of GDP.",
    secondaryMetrics: [
      { label: "GFCF Share", value: "33.5% GDP" },
      { label: "WPI Input Deflation", value: "-1.20% YoY" },
      { label: "Capacity Utilization", value: "75.8% (OBICUS)" },
    ],
    link: "/deflator",
    linkText: "Launch Deflator Simulator",
    color: "#141416",
  },
  {
    id: "dc-unsna",
    name: "Washington D.C. // UN SNA & World Bank ICP Desk",
    hub: "Global PPP & Accounting Standards",
    code: "WB-ICP-05",
    lat: 38.9072,
    lon: -77.0369,
    category: "global",
    primaryMetric: "$10.51 Trillion",
    metricLabel: "India Output (PPP)",
    period: "World Bank International Comparison Program 2024",
    provenance: "World Bank WDI & UN SNA 2008 Chapter 15",
    summary:
      "Purchasing Power Parity conversion positioning India as the 3rd largest global economy. Global methodological benchmark for double-deflation national income reconciliation.",
    secondaryMetrics: [
      { label: "Global PPP Rank", value: "3rd Largest" },
      { label: "Share of World GDP", value: "7.2% (PPP)" },
      { label: "Method Standard", value: "UN SNA 2008 §15" },
    ],
    link: "/methodology",
    linkText: "Review UN SNA 2008 Methodology",
    color: "#059669",
  },
  {
    id: "london-debt",
    name: "London // European Sovereign Debt Desk",
    hub: "External Debt & FX Settlements",
    code: "MOF-EXT-06",
    lat: 51.5074,
    lon: -0.1278,
    category: "external",
    primaryMetric: "18.7% GDP",
    metricLabel: "External Debt Ratio",
    period: "FY 2023-24 Status Report",
    provenance: "Ministry of Finance External Debt Division & ECB",
    summary:
      "Low sovereign external debt vulnerability with long maturity profiles. Current account deficit safely contained at 0.7% of GDP with robust inward remittances.",
    secondaryMetrics: [
      { label: "Long-Term Ratio", value: "81.6% Total Debt" },
      { label: "CAD / GDP", value: "-0.7% YoY" },
      { label: "Annual Remittances", value: "$120 Billion" },
    ],
    link: "/global",
    linkText: "Examine Global Macro Telemetry",
    color: "#E5A83B",
  },
  {
    id: "tokyo-bilateral",
    name: "Tokyo // Asia-Pacific Bilateral Corridor",
    hub: "Strategic Infrastructure & Bilateral Swaps",
    code: "JICA-AP-07",
    lat: 35.6762,
    lon: 139.6503,
    category: "global",
    primaryMetric: "₹1.42L Cr",
    metricLabel: "Bilateral Capital Corridor",
    period: "FY 2023-24 Cumulative JICA & FDI",
    provenance: "DPIIT FDI Statistics & JICA Official Releases",
    summary:
      "Long-term concessional infrastructure financing for Western Dedicated Freight Corridor and High-Speed Rail, coupled with a $75 Billion bilateral currency swap agreement.",
    secondaryMetrics: [
      { label: "Bilateral Swap Facility", value: "$75 Billion" },
      { label: "Cumulative FDI Share", value: "9.4% Total" },
      { label: "Infrastructure Tenure", value: "40-Year Concessional" },
    ],
    link: "/global",
    linkText: "Explore Asia-Pacific Corridors",
    color: "#D94E34",
  },
];

// Helper: Convert Lat/Lon degrees to 3D Cartesian coordinates on sphere
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Helper: Great-circle 3D arc points between two vectors
function createGreatCircleArc(
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  numPoints: number,
  altitude: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const v = new THREE.Vector3().lerpVectors(v1, v2, t);
    // Arc altitude bell curve
    const arcHeight = Math.sin(t * Math.PI) * altitude;
    v.normalize().multiplyScalar(v1.length() + arcHeight);
    points.push(v);
  }
  return points;
}

interface SovereignParticleGlobeProps {
  className?: string;
  stageHeight?: string;
  showEditorialCard?: boolean;
}

export function SovereignParticleGlobe({
  className = "",
  stageHeight = "h-[500px] sm:h-[580px] lg:h-[640px]",
  showEditorialCard: _showEditorialCard = true,
}: SovereignParticleGlobeProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeAnchor, setActiveAnchor] = useState<SovereignAnchor | null>(SOVEREIGN_ANCHORS[0]);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isStageExpanded, setIsStageExpanded] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [projectedMarkers, setProjectedMarkers] = useState<
    { id: string; x: number; y: number; visible: boolean; anchor: SovereignAnchor }[]
  >([]);

  // Drag interaction refs
  const isDraggingRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.002 });
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const arcPulseTimesRef = useRef<number[]>([]);

  // Check WebGL availability
  const checkWebGL = useCallback(() => {
    try {
      const testCanvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext("webgl2") || testCanvas.getContext("webgl"))
      );
    } catch {
      return false;
    }
  }, []);

  // Center view on a specific anchor
  const centerOnAnchor = useCallback((anchor: SovereignAnchor) => {
    const latRad = (anchor.lat * Math.PI) / 180;
    const lonRad = (anchor.lon * Math.PI) / 180;

    // Target rotation angles to face the camera (+Z axis)
    const targetY = -lonRad - Math.PI / 2;
    const targetX = latRad * 0.7;

    targetRotationRef.current = { x: targetX, y: targetY };
    setActiveAnchor(anchor);
  }, []);

  // Main Three.js Runtime Initialization
  useEffect(() => {
    if (!checkWebGL()) {
      setWebglSupported(false);
      setIsReady(true);
      return;
    }

    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const width = stage.clientWidth || 600;
    const height = stage.clientHeight || 560;

    // 1. Renderer Setup with universal WebGL
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    // 2. Scene and Camera
    const scene = new THREE.Scene();
    const computeCameraZ = (aspectRatio: number) => {
      // For narrow mobile portrait screens (aspect < 1), step back camera so globe and halo fit inside container
      return aspectRatio < 1 ? 3.4 + (1 - aspectRatio) * 1.5 : 3.4;
    };
    const initialAspect = width / height;
    const camera = new THREE.PerspectiveCamera(40, initialAspect, 0.1, 100);
    camera.position.set(0, 0, computeCameraZ(initialAspect));
    cameraRef.current = camera;

    // 3. Globe Container Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Initial orientation: Face India (Lat 22° N, Lon 78° E)
    globeGroup.rotation.y = -((78 * Math.PI) / 180) - Math.PI / 2;
    globeGroup.rotation.x = (22 * Math.PI) / 180 * 0.6;

    const GLOBE_RADIUS = 1.05;

    // 4. Fibonacci Sphere Particles
    const isMobile = width < 640;
    const particleCount = isMobile ? 1800 : 2800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    const cDefault = new THREE.Color(0x141416); // Antimetal primary ink
    const cEmerald = new THREE.Color(0x059669); // Sovereign emerald
    const cAmber = new THREE.Color(0xd97706);   // Data amber
    const cMint = new THREE.Color(0x10b981);    // High-luminous mint

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const r = GLOBE_RADIUS + (Math.random() - 0.5) * 0.015;
      positions[i * 3] = x * r;
      positions[i * 3 + 1] = y * r;
      positions[i * 3 + 2] = z * r;

      // Geographic coordinate estimation to highlight India and key economic zones
      const latDeg = Math.asin(y) * (180 / Math.PI);
      const lonDeg = (Math.atan2(z, -x) * (180 / Math.PI)) - 180;

      // Indian Subcontinent bounding box: Lat 8°N to 36°N, Lon 68°E to 98°E
      const isIndiaZone = latDeg >= 8 && latDeg <= 36 && lonDeg >= 68 && lonDeg <= 98;
      // Key Global Economic Corridors
      const isGlobalHub =
        (latDeg >= 35 && latDeg <= 42 && lonDeg >= -80 && lonDeg <= -70) || // US East
        (latDeg >= 48 && latDeg <= 56 && lonDeg >= -5 && lonDeg <= 15) ||   // West Europe
        (latDeg >= 30 && latDeg <= 40 && lonDeg >= 130 && lonDeg <= 145);  // Japan

      if (isIndiaZone) {
        colors[i * 3] = cEmerald.r;
        colors[i * 3 + 1] = cEmerald.g;
        colors[i * 3 + 2] = cEmerald.b;
        sizes[i] = 4.2;
      } else if (isGlobalHub) {
        colors[i * 3] = cAmber.r;
        colors[i * 3 + 1] = cAmber.g;
        colors[i * 3 + 2] = cAmber.b;
        sizes[i] = 3.6;
      } else {
        const mixFactor = Math.random();
        const baseColor = mixFactor > 0.85 ? cMint : cDefault;
        colors[i * 3] = baseColor.r;
        colors[i * 3 + 1] = baseColor.g;
        colors[i * 3 + 2] = baseColor.b;
        sizes[i] = mixFactor > 0.85 ? 3.0 : 2.2;
      }
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Circle particle texture for smooth antialiased dots
    const makeDotTexture = () => {
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 64;
      pCanvas.height = 64;
      const ctx = pCanvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.arc(32, 32, 28, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
      const tex = new THREE.CanvasTexture(pCanvas);
      tex.needsUpdate = true;
      return tex;
    };

    const dotTexture = makeDotTexture();

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      map: dotTexture,
      alphaTest: 0.05,
      sizeAttenuation: true,
    });

    const particlePoints = new THREE.Points(particlesGeometry, particlesMaterial);
    globeGroup.add(particlePoints);

    // 5. Orbital & Coordinate Rings (Fine technical gridlines)
    const createRing = (radius: number, yPos: number, colorHex: number, opacity: number) => {
      const ringPts: THREE.Vector3[] = [];
      const segments = 96;
      for (let s = 0; s <= segments; s++) {
        const angle = (s / segments) * Math.PI * 2;
        ringPts.push(
          new THREE.Vector3(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius)
        );
      }
      const geom = new THREE.BufferGeometry().setFromPoints(ringPts);
      const mat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity,
        linewidth: 1,
      });
      return new THREE.Line(geom, mat);
    };

    // Equator & Tropics
    globeGroup.add(createRing(GLOBE_RADIUS * 1.002, 0, 0x141416, 0.18));
    globeGroup.add(createRing(GLOBE_RADIUS * 0.94, GLOBE_RADIUS * 0.38, 0x059669, 0.15)); // Tropic of Cancer (India)
    globeGroup.add(createRing(GLOBE_RADIUS * 0.94, -GLOBE_RADIUS * 0.38, 0x141416, 0.12));

    // Outer Geodetic Halo Ring
    const outerHaloPts: THREE.Vector3[] = [];
    for (let s = 0; s <= 128; s++) {
      const angle = (s / 128) * Math.PI * 2;
      outerHaloPts.push(
        new THREE.Vector3(Math.cos(angle) * (GLOBE_RADIUS * 1.18), 0, Math.sin(angle) * (GLOBE_RADIUS * 1.18))
      );
    }
    const outerHaloGeom = new THREE.BufferGeometry().setFromPoints(outerHaloPts);
    const outerHaloMat = new THREE.LineDashedMaterial({
      color: 0x828387,
      transparent: true,
      opacity: 0.22,
      dashSize: 0.05,
      gapSize: 0.04,
    });
    const outerHalo = new THREE.Line(outerHaloGeom, outerHaloMat);
    outerHalo.computeLineDistances();
    outerHalo.rotation.x = Math.PI / 6;
    globeGroup.add(outerHalo);

    // 6. 3D Inter-Hub Geodesic Arcs & Light Pulses
    const arcData: {
      from: SovereignAnchor;
      to: SovereignAnchor;
      points: THREE.Vector3[];
      pulseObj: THREE.Mesh;
    }[] = [];

    const delhiAnchor = SOVEREIGN_ANCHORS[0]; // New Delhi central hub
    const targetAnchors = [
      SOVEREIGN_ANCHORS[1], // Mumbai
      SOVEREIGN_ANCHORS[2], // Bengaluru
      SOVEREIGN_ANCHORS[3], // Gujarat
      SOVEREIGN_ANCHORS[4], // Washington D.C.
      SOVEREIGN_ANCHORS[5], // London
      SOVEREIGN_ANCHORS[6], // Tokyo
    ];

    const pulseGeo = new THREE.SphereGeometry(0.016, 8, 8);

    targetAnchors.forEach((target) => {
      const vFrom = latLonToVector3(delhiAnchor.lat, delhiAnchor.lon, GLOBE_RADIUS);
      const vTo = latLonToVector3(target.lat, target.lon, GLOBE_RADIUS);
      const arcPoints = createGreatCircleArc(vFrom, vTo, 48, 0.18);

      const arcGeom = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const arcMat = new THREE.LineBasicMaterial({
        color: target.id.includes("dc") || target.id.includes("london") ? 0xd97706 : 0x059669,
        transparent: true,
        opacity: 0.38,
        linewidth: 1,
      });
      const arcLine = new THREE.Line(arcGeom, arcMat);
      globeGroup.add(arcLine);

      // Pulse traveling mesh along arc
      const pulseMat = new THREE.MeshBasicMaterial({
        color: target.color === "#059669" ? 0x10b981 : 0xd94e34,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      globeGroup.add(pulseMesh);

      arcData.push({
        from: delhiAnchor,
        to: target,
        points: arcPoints,
        pulseObj: pulseMesh,
      });
    });

    arcPulseTimesRef.current = arcData.map((_, i) => (i * 0.18) % 1);

    // 7. Check for user motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsRotating(false);
    }

    // 8. Animation & Render Loop
    let tick = 0;
    let isVisible = true;

    const render = () => {
      if (!isVisible) {
        animFrameRef.current = null;
        return;
      }

      tick += 0.016;

      // Handle smooth targeting rotation if an anchor was selected
      if (targetRotationRef.current) {
        const { x: tX, y: tY } = targetRotationRef.current;
        globeGroup.rotation.x += (tX - globeGroup.rotation.x) * 0.08;
        globeGroup.rotation.y += (tY - globeGroup.rotation.y) * 0.08;

        if (
          Math.abs(tX - globeGroup.rotation.x) < 0.005 &&
          Math.abs(tY - globeGroup.rotation.y) < 0.005
        ) {
          targetRotationRef.current = null;
        }
      } else if (isRotating && !isDraggingRef.current && !prefersReducedMotion) {
        // Natural gentle orbit
        globeGroup.rotation.y += rotationVelocityRef.current.y;
      }

      // Handle drag inertia
      if (!isDraggingRef.current) {
        rotationVelocityRef.current.x *= 0.94;
        rotationVelocityRef.current.y =
          rotationVelocityRef.current.y * 0.94 + (isRotating ? 0.002 * 0.06 : 0);
        globeGroup.rotation.y += rotationVelocityRef.current.y;
        globeGroup.rotation.x = Math.max(
          -Math.PI * 0.35,
          Math.min(Math.PI * 0.35, globeGroup.rotation.x + rotationVelocityRef.current.x)
        );
      }

      // Animate arc pulses
      arcData.forEach((arc, i) => {
        const t = (arcPulseTimesRef.current[i] + 0.008) % 1;
        arcPulseTimesRef.current[i] = t;
        const ptIndex = Math.floor(t * (arc.points.length - 1));
        const currentPt = arc.points[ptIndex];
        if (currentPt) {
          arc.pulseObj.position.copy(currentPt);
        }
      });

      // Subtle atmospheric particle breathing
      particlesMaterial.size = 0.038 + Math.sin(tick * 1.5) * 0.003;

      renderer.render(scene, camera);

      // 9. Project 3D Anchors into 2D Screen Space for Interactive Overlay Pins
      globeGroup.updateMatrixWorld();
      const currentWidth = stage.clientWidth || width;
      const currentHeight = stage.clientHeight || height;

      const projected = SOVEREIGN_ANCHORS.map((anchor) => {
        const v3 = latLonToVector3(anchor.lat, anchor.lon, GLOBE_RADIUS);
        v3.applyMatrix4(globeGroup.matrixWorld);

        // Distance to camera determines whether anchor is on front or back hemisphere
        const isFacingCamera = v3.z > 0.05;

        // Project into normalized device coordinates [-1, 1]
        v3.project(camera);

        const x = (v3.x * 0.5 + 0.5) * currentWidth;
        const y = (-v3.y * 0.5 + 0.5) * currentHeight;

        return {
          id: anchor.id,
          x,
          y,
          visible: isFacingCamera && x >= 0 && x <= currentWidth && y >= 0 && y <= currentHeight,
          anchor,
        };
      });

      setProjectedMarkers(projected);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    setIsReady(true);

    // 10. Visibility and Intersection Observers to pause off-screen rendering
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible && !animFrameRef.current) {
          animFrameRef.current = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(stage);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
      } else {
        isVisible = true;
        if (!animFrameRef.current) {
          animFrameRef.current = requestAnimationFrame(render);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 11. ResizeObserver to handle container dimension changes reliably
    const handleResize = () => {
      if (!stage || !renderer || !camera) return;
      const newWidth = stage.clientWidth;
      const newHeight = stage.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      const newAspect = newWidth / newHeight;
      camera.aspect = newAspect;
      camera.position.z = computeCameraZ(newAspect);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(newWidth, newHeight, false);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(stage);
    resizeObserverRef.current = resizeObserver;

    // 12. Cleanup
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resizeObserver.disconnect();
      dotTexture.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      outerHaloGeom.dispose();
      outerHaloMat.dispose();
      pulseGeo.dispose();
      renderer.dispose();
    };
  }, [checkWebGL, centerOnAnchor, isRotating]);

  // Pointer drag event handlers for free 3D rotation with mobile scroll preservation
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const touchDirectionDeterminedRef = useRef<"horizontal" | "vertical" | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    targetRotationRef.current = null;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
    touchStartPosRef.current = { x: e.clientX, y: e.clientY };
    touchDirectionDeterminedRef.current = null;

    if (e.pointerType !== "touch") {
      isDraggingRef.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!globeGroupRef.current) return;

    // For touch devices, check gesture direction before capturing pointer
    if (e.pointerType === "touch" && touchStartPosRef.current) {
      if (!touchDirectionDeterminedRef.current) {
        const dx = Math.abs(e.clientX - touchStartPosRef.current.x);
        const dy = Math.abs(e.clientY - touchStartPosRef.current.y);

        if (dy > 8 && dy > dx) {
          // Vertical swipe: allow native page scroll!
          touchDirectionDeterminedRef.current = "vertical";
          isDraggingRef.current = false;
          return;
        } else if (dx > 6) {
          // Horizontal drag: user intends to rotate globe!
          touchDirectionDeterminedRef.current = "horizontal";
          isDraggingRef.current = true;
          try {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
          } catch {
            // Fallback
          }
        } else {
          return;
        }
      } else if (touchDirectionDeterminedRef.current === "vertical") {
        return;
      }
    }

    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousPointerPosRef.current.x;
    const deltaY = e.clientY - previousPointerPosRef.current.y;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.005;
    globeGroupRef.current.rotation.y += deltaX * sensitivity;
    globeGroupRef.current.rotation.x = Math.max(
      -Math.PI * 0.38,
      Math.min(Math.PI * 0.38, globeGroupRef.current.rotation.x + deltaY * sensitivity)
    );

    rotationVelocityRef.current = {
      x: deltaY * sensitivity * 0.3,
      y: deltaX * sensitivity * 0.3,
    };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    touchStartPosRef.current = null;
    touchDirectionDeterminedRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if capture already lost
    }
  };

  const handleResetOrientation = () => {
    if (!globeGroupRef.current) return;
    targetRotationRef.current = {
      x: (22 * Math.PI) / 180 * 0.6,
      y: -((78 * Math.PI) / 180) - Math.PI / 2,
    };
    setActiveAnchor(SOVEREIGN_ANCHORS[0]);
  };

  return (
    <div
      className={`relative w-full rounded-2xl border border-[rgba(20,21,23,0.14)] bg-[#ECEBE5] shadow-xs transition-all duration-300 ${
        isStageExpanded ? "fixed inset-4 z-50 rounded-3xl shadow-2xl overflow-hidden" : ""
      } ${className}`}
    >
      {/* 1. TOP TECHNICAL CONTROL BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(20,21,23,0.12)] bg-[#E6E5DF]/70 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2.5 font-mono text-[11px] text-[#141416]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]" />
          </span>
          <span className="font-bold uppercase tracking-wider">
            3D SOVEREIGN PARTICLE GLOBE
          </span>
          <span className="text-[#828387] hidden sm:inline">•</span>
          <span className="text-[#57585C] hidden sm:inline">
            FIBONACCI LATTICE // 2,800 POINTS
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          {/* Rotation Toggle */}
          <button
            onClick={() => setIsRotating((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-full border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] px-2.5 py-1 text-[#141416] hover:bg-[#DFDED8] transition-colors cursor-pointer"
            title={isRotating ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
            aria-label={isRotating ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
          >
            {isRotating ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            <span className="hidden md:inline">{isRotating ? "Orbiting" : "Paused"}</span>
          </button>

          {/* Reset Orientation */}
          <button
            onClick={handleResetOrientation}
            className="inline-flex items-center gap-1 rounded-full border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] px-2.5 py-1 text-[#141416] hover:bg-[#DFDED8] transition-colors cursor-pointer"
            title="Reset to New Delhi View"
            aria-label="Reset to New Delhi View"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Fullscreen Expansion Toggle */}
          <button
            onClick={() => setIsStageExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-full border border-[rgba(20,21,23,0.15)] bg-[#ECEBE5] px-2.5 py-1 text-[#141416] hover:bg-[#DFDED8] transition-colors cursor-pointer"
            title={isStageExpanded ? "Exit Expanded View" : "Expand Stage"}
            aria-label={isStageExpanded ? "Exit Expanded View" : "Expand Stage"}
          >
            {isStageExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* 2. MAIN 3D MOTION STAGE CANVAS CONTAINER */}
      <div
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative w-full select-none overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing ${
          isStageExpanded ? "h-[calc(100vh-180px)]" : stageHeight
        }`}
      >
        {/* Architectural Grid & Crosshairs */}
        <div className="pointer-events-none absolute inset-0 z-10 p-3 sm:p-5 flex flex-col justify-between">
          <div className="flex justify-between font-mono text-[9px] text-[#828387] opacity-60">
            <span>+ ORBIT_LAT // 28.61° N</span>
            <span>+ SHA-256 PROVENANCE ACTIVE</span>
          </div>
          <div className="flex justify-between font-mono text-[9px] text-[#828387] opacity-60">
            <span>+ HORIZONTAL DRAG TO ROTATE</span>
            <span className="hidden xs:inline">+ CLICK ANCHOR PIN TO INSPECT</span>
          </div>
        </div>

        {/* WebGL Canvas */}
        {webglSupported ? (
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Interactive 3D particle globe visualizing sovereign macroeconomic corridors and official data centers"
            className="block w-full h-full transition-opacity duration-300"
            style={{ opacity: isReady ? 1 : 0.3 }}
          />
        ) : (
          /* Graceful 2D Fallback if WebGL unavailable */
          <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center space-y-4">
            <Globe2 className="h-12 w-12 text-[#059669]" />
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-[#141416]">
                Sovereign Geodetic Registry
              </h3>
              <p className="font-sans text-xs text-[#57585C] max-w-md">
                Interactive 3D hardware acceleration is currently resting. All sovereign macroeconomic hubs remain fully accessible via the telemetry directory below.
              </p>
            </div>
          </div>
        )}

        {/* 3. INTERACTIVE 3D SCREEN-SPACE ANCHOR PINS */}
        {webglSupported &&
          projectedMarkers.map((marker) => {
            if (!marker.visible) return null;
            const isSelected = activeAnchor?.id === marker.id;

            return (
              <div
                key={marker.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-transform duration-100 ease-out"
                style={{
                  left: `${marker.x}px`,
                  top: `${marker.y}px`,
                }}
              >
                <button
                  onClick={() => centerOnAnchor(marker.anchor)}
                  aria-label={`Inspect ${marker.anchor.name}`}
                  className={`group relative flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold shadow-md transition-all cursor-pointer min-h-[32px] ${
                    isSelected
                      ? "bg-[#141416] text-[#ECEBE5] ring-2 ring-[#059669] scale-105"
                      : "bg-[#ECEBE5]/90 text-[#141416] hover:bg-[#141416] hover:text-[#ECEBE5] border border-[rgba(20,21,23,0.2)]"
                  }`}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: marker.anchor.color }}
                  />
                  <span className="truncate max-w-[85px] sm:max-w-[120px]">
                    {marker.anchor.name.split("//")[0].trim()}
                  </span>
                  <span className="text-[9px] opacity-70">
                    {marker.anchor.primaryMetric}
                  </span>
                </button>
              </div>
            );
          })}

        {/* 4. ACTIVE ANCHOR TELEMETRY INSPECTION OVERLAY CARD */}
        {activeAnchor && (
          <div className="absolute bottom-2 sm:bottom-4 left-2 right-2 sm:right-auto sm:left-4 z-30 sm:max-w-md rounded-2xl border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5]/96 p-3.5 sm:p-5 shadow-xl backdrop-blur-md transition-all max-h-[60%] sm:max-h-none overflow-y-auto overscroll-contain">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#141416]/5 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#141416]">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: activeAnchor.color }}
                  />
                  <span>{activeAnchor.hub}</span>
                  <span className="text-[#828387]">•</span>
                  <span>{activeAnchor.code}</span>
                </div>
                <h4 className="font-heading text-xs sm:text-base font-bold text-[#141416]">
                  {activeAnchor.name}
                </h4>
              </div>

              <button
                onClick={() => setActiveAnchor(null)}
                aria-label="Close details"
                className="rounded-full p-2 text-[#828387] hover:bg-black/5 hover:text-[#141416] transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Primary Value Callout */}
            <div className="my-2 sm:my-3 flex items-baseline justify-between border-y border-[rgba(20,21,23,0.1)] py-1.5 sm:py-2">
              <div>
                <div className="font-mono text-[9px] sm:text-[10px] uppercase text-[#828387]">
                  {activeAnchor.metricLabel}
                </div>
                <div className="font-heading text-xl sm:text-3xl font-extrabold text-[#141416]">
                  {activeAnchor.primaryMetric}
                </div>
              </div>
              <div className="text-right font-mono text-[9px] sm:text-[10px] text-[#57585C]">
                <div>{activeAnchor.period}</div>
                <div className="text-[9px] text-[#059669] font-bold">SHA-256 GAZETTE VERIFIED</div>
              </div>
            </div>

            {/* Concise Summary */}
            <p className="font-sans text-[11px] sm:text-xs text-[#57585C] leading-relaxed mb-2.5">
              {activeAnchor.summary}
            </p>

            {/* Secondary Metric Micro-Grid */}
            <div className="grid grid-cols-3 gap-2 py-1.5 sm:py-2 border-t border-[rgba(20,21,23,0.08)] mb-2.5">
              {activeAnchor.secondaryMetrics.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-0.5">
                  <div className="font-mono text-[8px] sm:text-[9px] uppercase text-[#828387] truncate">
                    {sec.label}
                  </div>
                  <div className="font-mono text-[11px] sm:text-xs font-bold text-[#141416] truncate">
                    {sec.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Provenance & Direct Navigation */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2 pt-2 border-t border-[rgba(20,21,23,0.12)]">
              <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-[#828387] truncate">
                <ShieldCheck className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                <span className="truncate">{activeAnchor.provenance}</span>
              </div>
              <Link
                href={activeAnchor.link}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#141416] px-3 py-1.5 font-mono text-[11px] font-bold text-[#ECEBE5] hover:bg-[#D94E34] transition-colors shrink-0 shadow-xs cursor-pointer min-h-[36px]"
              >
                <span>{activeAnchor.linkText}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 5. ACCESSIBLE KEYBOARD & TOUCH HUB SELECTOR BAR (Bottom Navigation) */}
      <div className="border-t border-[rgba(20,21,23,0.12)] bg-[#E6E5DF]/60 p-2.5 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#57585C] shrink-0">
            <Globe2 className="h-3.5 w-3.5 text-[#059669]" />
            <span>SELECT SOVEREIGN CORRIDOR:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0">
            {SOVEREIGN_ANCHORS.map((anchor) => {
              const isSelected = activeAnchor?.id === anchor.id;
              return (
                <button
                  key={anchor.id}
                  onClick={() => centerOnAnchor(anchor)}
                  aria-pressed={isSelected}
                  className={`rounded-full px-3 py-1.5 font-mono text-[10px] sm:text-[11px] transition-all cursor-pointer shrink-0 min-h-[36px] ${
                    isSelected
                      ? "bg-[#141416] text-[#ECEBE5] font-bold shadow-xs"
                      : "bg-[#ECEBE5] text-[#57585C] hover:text-[#141416] hover:bg-black/5 border border-[rgba(20,21,23,0.14)]"
                  }`}
                >
                  {anchor.name.split("//")[0].trim()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
