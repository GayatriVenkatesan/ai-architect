"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import {
  Component,
  Suspense,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

type Vec3 = [number, number, number];

type ProjectType =
  | "hospital"
  | "mall"
  | "apartment"
  | "office"
  | "villa"
  | "campus";

type MovementType =
  | "forward"
  | "backward"
  | "left"
  | "right"
  | "reset";

type MovementCommand = {
  id: number;
  type: MovementType;
};

type Hotspot = {
  id: string;
  label: string;
  description: string;
  cameraPosition: Vec3;
  cameraTarget: Vec3;
};

type ModelConfig = {
  title: string;
  modelPath: string;
  expectedFile: string;
  scale: Vec3;
  position: Vec3;
  rotation: Vec3;
  environmentPreset:
    | "apartment"
    | "city"
    | "dawn"
    | "forest"
    | "lobby"
    | "night"
    | "park"
    | "studio"
    | "sunset"
    | "warehouse";
};

type FirstPersonWalkthroughViewerProps = {
  projectName: string;
  roomName: string;
  roomDescription?: string;
};

type ModelErrorBoundaryProps = {
  resetKey: string;
  fallback: ReactNode;
  children: ReactNode;
};

type ModelErrorBoundaryState = {
  hasError: boolean;
};

const VILLA_MODEL_CONFIG: ModelConfig = {
  title: "Luxury Villa Interior Walkthrough",
  modelPath: "/models/villa-interior.glb",
  expectedFile: "public/models/villa-interior.glb",
  scale: [1, 1, 1],
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  environmentPreset: "apartment",
};

const VILLA_HOTSPOTS: Hotspot[] = [
  {
    id: "entrance",
    label: "Villa Entrance",
    description:
      "Start from the villa entrance at human eye level and look naturally into the connected interior.",
    cameraPosition: [0, 1.5, 6.45],
    cameraTarget: [0, 1.25, 3.55],
  },
  {
    id: "living",
    label: "Living Room",
    description:
      "Stand inside the living room and view the sofa, TV wall, rug, coffee table, and premium seating zone.",
    cameraPosition: [-5.25, 1.48, 4.85],
    cameraTarget: [-4.75, 1.15, 3.05],
  },
  {
    id: "dining",
    label: "Dining Area",
    description:
      "Stand in the dining area and view the dining table, pendant lights, and family dining layout.",
    cameraPosition: [0, 1.48, 4.85],
    cameraTarget: [0, 1.15, 3.1],
  },
  {
    id: "kitchen",
    label: "Kitchen",
    description:
      "Stand inside the kitchen and clearly view the counter, island, sink, hob, cabinets, and cooking workflow.",
    cameraPosition: [5.25, 1.48, 4.75],
    cameraTarget: [4.7, 1.15, 3.15],
  },
  {
    id: "bedroom",
    label: "Master Bedroom",
    description:
      "Enter the bedroom and view the bed, headboard, wardrobe wall, rug, side tables, and private ambience.",
    cameraPosition: [-5.35, 1.48, -0.75],
    cameraTarget: [-5.0, 1.12, -2.2],
  },
  {
    id: "courtyard",
    label: "Courtyard",
    description:
      "Stand inside the courtyard and look around the water feature, greenery, planter wall, and open breathing space.",
    cameraPosition: [0, 1.48, -0.35],
    cameraTarget: [0, 1.05, -2.15],
  },
  {
    id: "terrace",
    label: "Terrace",
    description:
      "Move to the terrace and view the outdoor sofa, glass railing, pergola structure, and open lifestyle seating.",
    cameraPosition: [5.25, 1.48, -0.75],
    cameraTarget: [4.7, 1.1, -2.25],
  },
];

function getProjectType(projectName = ""): ProjectType {
  const name = projectName.toLowerCase();

  if (
    name.includes("hospital") ||
    name.includes("clinic") ||
    name.includes("medical") ||
    name.includes("healthcare") ||
    name.includes("health")
  ) {
    return "hospital";
  }

  if (
    name.includes("mall") ||
    name.includes("shopping") ||
    name.includes("retail") ||
    name.includes("galleria")
  ) {
    return "mall";
  }

  if (
    name.includes("campus") ||
    name.includes("school") ||
    name.includes("college") ||
    name.includes("academic") ||
    name.includes("university")
  ) {
    return "campus";
  }

  if (
    name.includes("apartment") ||
    name.includes("tower") ||
    name.includes("residential") ||
    name.includes("complex") ||
    name.includes("skyline")
  ) {
    return "apartment";
  }

  if (
    name.includes("commercial") ||
    name.includes("office") ||
    name.includes("workspace") ||
    name.includes("tech") ||
    name.includes("park") ||
    name.includes("corporate")
  ) {
    return "office";
  }

  return "villa";
}

function vec3FromArray(value: Vec3) {
  return new THREE.Vector3(value[0], value[1], value[2]);
}

function clampVillaPosition(position: THREE.Vector3) {
  position.x = THREE.MathUtils.clamp(position.x, -7.1, 7.1);
  position.z = THREE.MathUtils.clamp(position.z, -5.55, 6.55);
  position.y = 1.48;

  return position;
}

function lerpAngle(current: number, target: number, amount: number) {
  const difference = Math.atan2(
    Math.sin(target - current),
    Math.cos(target - current)
  );

  return current + difference * amount;
}

function findMatchingHotspot(roomName: string) {
  const normalizedRoomName = roomName.toLowerCase();

  const matchedHotspot = VILLA_HOTSPOTS.find((hotspot) => {
    const normalizedLabel = hotspot.label.toLowerCase();

    return (
      normalizedRoomName.includes(normalizedLabel) ||
      normalizedLabel.includes(normalizedRoomName) ||
      normalizedRoomName.includes(hotspot.id)
    );
  });

  return matchedHotspot || VILLA_HOTSPOTS[0];
}

class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  constructor(props: ModelErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidUpdate(previousProps: ModelErrorBoundaryProps) {
    if (
      previousProps.resetKey !== this.props.resetKey &&
      this.state.hasError
    ) {
      this.setState({
        hasError: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function CanvasLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="w-[280px] rounded-3xl border border-white/10 bg-slate-950/90 p-5 text-center shadow-2xl backdrop-blur">
        <p className="text-sm font-semibold text-white">
          Loading villa walkthrough
        </p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all"
            style={{
              width: `${Math.round(progress)}%`,
            }}
          />
        </div>

        <p className="mt-3 text-xs text-slate-400">
          {Math.round(progress)}% loaded
        </p>
      </div>
    </Html>
  );
}

function MissingModelMessage({
  config,
}: {
  config: ModelConfig;
}) {
  return (
    <Html center>
      <div className="max-w-[520px] rounded-[2rem] border border-amber-400/30 bg-slate-950/95 p-6 text-center shadow-2xl backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
          Villa GLB Model Required
        </p>

        <h3 className="mt-3 text-xl font-semibold text-white">
          {config.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          Place the villa model file here:
        </p>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-cyan-200">
          {config.expectedFile}
        </div>
      </div>
    </Html>
  );
}

function RealisticGLBModel({
  config,
}: {
  config: ModelConfig;
}) {
  const gltf = useGLTF(config.modelPath) as unknown as {
    scene: THREE.Group;
  };

  const clonedScene = useMemo(() => {
    const cloned = gltf.scene.clone(true);

    cloned.traverse((object) => {
      const mesh = object as THREE.Mesh;

      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return cloned;
  }, [gltf.scene]);

  return (
    <primitive
      object={clonedScene}
      scale={config.scale}
      position={config.position}
      rotation={config.rotation}
    />
  );
}

function CameraDirector({
  activeHotspot,
  focusRequestId,
  movementCommand,
}: {
  activeHotspot: Hotspot;
  focusRequestId: number;
  movementCommand: MovementCommand;
}) {
  const { camera, gl } = useThree();

  const targetCameraPositionRef = useRef(
    vec3FromArray(activeHotspot.cameraPosition)
  );

  const yawRef = useRef(0);
  const pitchRef = useRef(0);

  const targetYawRef = useRef(0);
  const targetPitchRef = useRef(0);

  const isDraggingRef = useRef(false);
  const previousPointerRef = useRef({
    x: 0,
    y: 0,
  });

  const isAnimatingRef = useRef(true);
  const hasInitializedRef = useRef(false);

  function calculateAngles(
    cameraPosition: THREE.Vector3,
    lookAt: THREE.Vector3
  ) {
    const direction = lookAt.clone().sub(cameraPosition).normalize();

    const yaw = Math.atan2(-direction.x, -direction.z);
    const pitch = Math.asin(
      THREE.MathUtils.clamp(direction.y, -0.85, 0.85)
    );

    return {
      yaw,
      pitch,
    };
  }

  function applyCameraView() {
    const yaw = yawRef.current;
    const pitch = pitchRef.current;

    const direction = new THREE.Vector3(
      -Math.sin(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      -Math.cos(yaw) * Math.cos(pitch)
    );

    const lookAt = camera.position.clone().add(direction);

    camera.lookAt(lookAt);
  }

  useEffect(() => {
    const nextCameraPosition = vec3FromArray(activeHotspot.cameraPosition);
    const nextLookAt = vec3FromArray(activeHotspot.cameraTarget);
    const nextAngles = calculateAngles(nextCameraPosition, nextLookAt);

    targetCameraPositionRef.current = nextCameraPosition;
    targetYawRef.current = nextAngles.yaw;
    targetPitchRef.current = nextAngles.pitch;
    isAnimatingRef.current = true;

    if (!hasInitializedRef.current) {
      camera.position.copy(nextCameraPosition);

      yawRef.current = nextAngles.yaw;
      pitchRef.current = nextAngles.pitch;

      applyCameraView();

      isAnimatingRef.current = false;
      hasInitializedRef.current = true;
    }
  }, [activeHotspot, focusRequestId, camera]);

  useEffect(() => {
    if (movementCommand.id === 0) {
      return;
    }

    if (movementCommand.type === "reset") {
      const resetPosition = vec3FromArray(activeHotspot.cameraPosition);
      const resetTarget = vec3FromArray(activeHotspot.cameraTarget);
      const resetAngles = calculateAngles(resetPosition, resetTarget);

      targetCameraPositionRef.current = resetPosition;
      targetYawRef.current = resetAngles.yaw;
      targetPitchRef.current = resetAngles.pitch;
      isAnimatingRef.current = true;

      return;
    }

    const horizontalForward = new THREE.Vector3(
      -Math.sin(yawRef.current),
      0,
      -Math.cos(yawRef.current)
    ).normalize();

    const horizontalRight = new THREE.Vector3(
      Math.cos(yawRef.current),
      0,
      -Math.sin(yawRef.current)
    ).normalize();

    const stepDistance = 0.9;
    const nextPosition = camera.position.clone();

    if (movementCommand.type === "forward") {
      nextPosition.add(horizontalForward.multiplyScalar(stepDistance));
    }

    if (movementCommand.type === "backward") {
      nextPosition.sub(horizontalForward.multiplyScalar(stepDistance));
    }

    if (movementCommand.type === "left") {
      nextPosition.sub(horizontalRight.multiplyScalar(stepDistance));
    }

    if (movementCommand.type === "right") {
      nextPosition.add(horizontalRight.multiplyScalar(stepDistance));
    }

    targetCameraPositionRef.current = clampVillaPosition(nextPosition);
    isAnimatingRef.current = true;
  }, [movementCommand, activeHotspot, camera]);

  useEffect(() => {
    const canvas = gl.domElement;

    function handlePointerDown(event: PointerEvent) {
      isDraggingRef.current = true;
      isAnimatingRef.current = false;

      previousPointerRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      canvas.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isDraggingRef.current) {
        return;
      }

      const deltaX = event.clientX - previousPointerRef.current.x;
      const deltaY = event.clientY - previousPointerRef.current.y;

      previousPointerRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      yawRef.current -= deltaX * 0.004;
      pitchRef.current -= deltaY * 0.003;

      pitchRef.current = THREE.MathUtils.clamp(
        pitchRef.current,
        -0.72,
        0.52
      );

      targetYawRef.current = yawRef.current;
      targetPitchRef.current = pitchRef.current;
    }

    function handlePointerUp(event: PointerEvent) {
      isDraggingRef.current = false;

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    }

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const smoothFactor = 1 - Math.pow(0.0008, delta);

    if (isAnimatingRef.current) {
      camera.position.lerp(targetCameraPositionRef.current, smoothFactor);

      yawRef.current = lerpAngle(
        yawRef.current,
        targetYawRef.current,
        smoothFactor
      );

      pitchRef.current = THREE.MathUtils.lerp(
        pitchRef.current,
        targetPitchRef.current,
        smoothFactor
      );

      const cameraDistance = camera.position.distanceTo(
        targetCameraPositionRef.current
      );

      if (cameraDistance < 0.035) {
        camera.position.copy(targetCameraPositionRef.current);
        isAnimatingRef.current = false;
      }
    }

    camera.position.y = 1.48;
    applyCameraView();
  });

  return null;
}

function RealisticWalkthroughScene({
  config,
  activeHotspot,
  focusRequestId,
  movementCommand,
}: {
  config: ModelConfig;
  activeHotspot: Hotspot;
  focusRequestId: number;
  movementCommand: MovementCommand;
}) {
  return (
    <>
      <color attach="background" args={["#020617"]} />

      <ambientLight intensity={0.9} />

      <directionalLight
        position={[6, 8, 6]}
        intensity={1.75}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <pointLight position={[-4, 3, 4]} intensity={0.72} color="#bae6fd" />
      <pointLight position={[4, 3, -4]} intensity={0.58} color="#fef3c7" />

      <Environment preset={config.environmentPreset} />

      <CameraDirector
        activeHotspot={activeHotspot}
        focusRequestId={focusRequestId}
        movementCommand={movementCommand}
      />

      <ModelErrorBoundary
        resetKey={config.modelPath}
        fallback={<MissingModelMessage config={config} />}
      >
        <Suspense fallback={<CanvasLoader />}>
          <RealisticGLBModel config={config} />
        </Suspense>
      </ModelErrorBoundary>

      <ContactShadows
        position={[0, -0.02, 0]}
        opacity={0.42}
        scale={16}
        blur={3}
        far={7}
      />
    </>
  );
}

export default function FirstPersonWalkthroughViewer({
  projectName,
  roomName,
  roomDescription,
}: FirstPersonWalkthroughViewerProps) {
  const projectType = useMemo(() => {
    return getProjectType(projectName);
  }, [projectName]);

  const [activeHotspotId, setActiveHotspotId] = useState("entrance");
  const [autoTourEnabled, setAutoTourEnabled] = useState(false);
  const [focusView, setFocusView] = useState(false);
  const [focusRequestId, setFocusRequestId] = useState(0);

  const [movementCommand, setMovementCommand] = useState<MovementCommand>({
    id: 0,
    type: "reset",
  });

  const activeHotspot = useMemo(() => {
    const matchedHotspot = VILLA_HOTSPOTS.find((hotspot) => {
      return hotspot.id === activeHotspotId;
    });

    return matchedHotspot || VILLA_HOTSPOTS[0];
  }, [activeHotspotId]);

  useEffect(() => {
    if (projectType !== "villa") {
      setActiveHotspotId("entrance");
      setAutoTourEnabled(false);
      setFocusRequestId((current) => current + 1);
      return;
    }

    const matchedHotspot = findMatchingHotspot(roomName);

    if (matchedHotspot.id === "living" && activeHotspotId === "entrance") {
      return;
    }

    setActiveHotspotId(matchedHotspot.id);
    setAutoTourEnabled(false);
    setFocusRequestId((current) => current + 1);
  }, [roomName, projectType]);

  useEffect(() => {
    if (!autoTourEnabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveHotspotId((currentHotspotId) => {
        const currentIndex = VILLA_HOTSPOTS.findIndex((hotspot) => {
          return hotspot.id === currentHotspotId;
        });

        const nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex + 1) % VILLA_HOTSPOTS.length;

        return VILLA_HOTSPOTS[nextIndex].id;
      });

      setFocusRequestId((current) => current + 1);
    }, 5200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoTourEnabled]);

  function selectHotspot(hotspotId: string) {
    setActiveHotspotId(hotspotId);
    setAutoTourEnabled(false);
    setFocusRequestId((current) => current + 1);

    setMovementCommand((current) => {
      return {
        id: current.id + 1,
        type: "reset",
      };
    });
  }

  function sendMovementCommand(type: MovementType) {
    setAutoTourEnabled(false);

    setMovementCommand((current) => {
      return {
        id: current.id + 1,
        type,
      };
    });
  }

  return (
    <div
      className={
        focusView
          ? "fixed inset-0 z-[9999] overflow-hidden bg-slate-950 p-4 text-white"
          : "overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-2xl shadow-slate-950/50"
      }
    >
      <div className="border-b border-white/10 bg-white/[0.04] p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Realistic Villa Walkthrough
            </p>

            <h3 className="mt-2 text-xl font-semibold text-white">
              {VILLA_MODEL_CONFIG.title}
            </h3>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
              {roomDescription ||
                activeHotspot.description ||
                "Start from the villa entrance. Drag inside the viewer to look 360 degrees, then use zone buttons or walk controls to move naturally."}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
            <p className="text-xs text-slate-400">Current Position</p>

            <p className="mt-1 text-sm font-semibold text-cyan-100">
              {activeHotspot.label}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {VILLA_HOTSPOTS.map((hotspot) => {
            const isActive = hotspot.id === activeHotspot.id;

            return (
              <button
                key={hotspot.id}
                type="button"
                onClick={() => selectHotspot(hotspot.id)}
                className={
                  isActive
                    ? "rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-950/40"
                    : "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
                }
              >
                {hotspot.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-4">
          <button
            type="button"
            onClick={() => sendMovementCommand("forward")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-200"
          >
            Walk Forward
          </button>

          <button
            type="button"
            onClick={() => sendMovementCommand("backward")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-200"
          >
            Step Back
          </button>

          <button
            type="button"
            onClick={() => sendMovementCommand("left")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-200"
          >
            Move Left
          </button>

          <button
            type="button"
            onClick={() => sendMovementCommand("right")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-200"
          >
            Move Right
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setAutoTourEnabled((current) => !current)}
            className={
              autoTourEnabled
                ? "rounded-2xl border border-red-400/40 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:border-red-300"
                : "rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            }
          >
            {autoTourEnabled ? "Stop Auto Tour" : "Start Auto Tour"}
          </button>

          <button
            type="button"
            onClick={() => selectHotspot("entrance")}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
          >
            Reset to Villa Entrance
          </button>

          <button
            type="button"
            onClick={() => setFocusView((current) => !current)}
            className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300"
          >
            {focusView ? "Exit Full View" : "Open Full View"}
          </button>
        </div>

        <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm leading-6 text-slate-300">
          Drag inside the viewer to look around 360°. Use the walk buttons to
          move naturally. The camera starts from the villa entrance.
        </div>
      </div>

      <div
        className={
          focusView
            ? "h-[calc(100vh-275px)] min-h-[520px]"
            : "h-[90vh] min-h-[820px]"
        }
      >
        <Canvas
          shadows
          camera={{
            position: activeHotspot.cameraPosition,
            fov: 76,
          }}
          gl={{
            antialias: true,
          }}
        >
          <RealisticWalkthroughScene
            config={VILLA_MODEL_CONFIG}
            activeHotspot={activeHotspot}
            focusRequestId={focusRequestId}
            movementCommand={movementCommand}
          />
        </Canvas>
      </div>
    </div>
  );
}