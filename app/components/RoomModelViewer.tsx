"use client";

import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  Center,
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  Text,
  useGLTF,
} from "@react-three/drei";
import { Suspense } from "react";

type Vec3 = [number, number, number];

type RoomType =
  | "reception"
  | "meeting"
  | "main"
  | "private"
  | "overview";

type RoomModelViewerProps = {
  roomName: string;
  modelPath?: string;
  description?: string;
};

type LoadedRoomModelProps = {
  modelPath: string;
};

function v(x: number, y: number, z: number): Vec3 {
  return [x, y, z];
}

function getRoomType(roomName = ""): RoomType {
  const name = roomName.toLowerCase();

  if (name.includes("reception") || name.includes("lobby")) {
    return "reception";
  }

  if (name.includes("meeting") || name.includes("discussion")) {
    return "meeting";
  }

  if (name.includes("private")) {
    return "private";
  }

  if (name.includes("overview") || name.includes("full")) {
    return "overview";
  }

  return "main";
}

function LoadedRoomModel({ modelPath }: LoadedRoomModelProps) {
  const gltf = useGLTF(modelPath);

  return <primitive object={gltf.scene} />;
}

function LoadingModel() {
  return (
    <Html center>
      <div className="rounded-2xl border border-white/10 bg-slate-950/90 px-5 py-4 text-center text-sm text-slate-300 shadow-2xl">
        Loading 3D room model...
      </div>
    </Html>
  );
}

function Block({
  position,
  scale,
  color,
  rotation,
  roughness = 0.6,
  metalness = 0,
  opacity = 1,
  emissive,
  emissiveIntensity = 0,
}: {
  position: Vec3;
  scale: Vec3;
  color: string;
  rotation?: Vec3;
  roughness?: number;
  metalness?: number;
  opacity?: number;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={scale} />

      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        transparent={opacity < 1}
        opacity={opacity}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}

function Glass({
  position,
  scale,
  color = "#93c5fd",
  opacity = 0.35,
}: {
  position: Vec3;
  scale: Vec3;
  color?: string;
  opacity?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />

      <meshStandardMaterial
        color={color}
        roughness={0.08}
        metalness={0.15}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function Cylinder({
  position,
  radius = 0.06,
  height = 1,
  color = "#475569",
}: {
  position: Vec3;
  radius?: number;
  height?: number;
  color?: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 24]} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );
}

function RoomShell({
  wallColor = "#e5e7eb",
  floorColor = "#1f2937",
  accent = "#8b5cf6",
}: {
  wallColor?: string;
  floorColor?: string;
  accent?: string;
}) {
  return (
    <group>
      <Block
        position={v(0, -0.05, 0)}
        scale={v(7.2, 0.1, 5.2)}
        color={floorColor}
        roughness={0.82}
      />

      <Block
        position={v(0, 2.45, 0)}
        scale={v(7.2, 0.12, 5.2)}
        color="#111827"
        roughness={0.75}
      />

      <Block
        position={v(0, 1.2, -2.6)}
        scale={v(7.2, 2.5, 0.12)}
        color={wallColor}
        roughness={0.68}
      />

      <Block
        position={v(-3.6, 1.2, 0)}
        scale={v(0.12, 2.5, 5.2)}
        color="#f3f4f6"
        roughness={0.68}
      />

      <Block
        position={v(3.6, 1.2, 0)}
        scale={v(0.12, 2.5, 5.2)}
        color="#d6d3d1"
        roughness={0.68}
      />

      <Block
        position={v(0, 0.02, 2.62)}
        scale={v(7.2, 0.08, 0.12)}
        color="#334155"
        roughness={0.75}
      />

      <Block
        position={v(0, 2.38, -2.48)}
        scale={v(6.6, 0.08, 0.12)}
        color={accent}
        emissive={accent}
        emissiveIntensity={0.12}
      />

      <Block
        position={v(-3.45, 2.35, 0)}
        scale={v(0.08, 0.08, 4.6)}
        color="#64748b"
      />

      <Block
        position={v(3.45, 2.35, 0)}
        scale={v(0.08, 0.08, 4.6)}
        color="#64748b"
      />
    </group>
  );
}

function WallPanel({
  position,
  scale,
  color = "#334155",
}: {
  position: Vec3;
  scale: Vec3;
  color?: string;
}) {
  return (
    <Block
      position={position}
      scale={scale}
      color={color}
      roughness={0.55}
    />
  );
}

function CeilingLight({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <Block
        position={v(0, 0, 0)}
        scale={v(0.95, 0.04, 0.25)}
        color="#fef3c7"
        emissive="#fde68a"
        emissiveIntensity={0.9}
      />

      <pointLight
        position={v(0, -0.1, 0)}
        intensity={0.7}
        distance={3.2}
        color="#fde68a"
      />
    </group>
  );
}

function Plant({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <Cylinder
        position={v(0, 0.22, 0)}
        radius={0.18}
        height={0.42}
        color="#334155"
      />

      <mesh position={v(0, 0.62, 0)} castShadow>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#16a34a" roughness={0.65} />
      </mesh>

      <mesh position={v(-0.18, 0.78, 0.08)} castShadow>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshStandardMaterial color="#22c55e" roughness={0.65} />
      </mesh>

      <mesh position={v(0.18, 0.75, -0.08)} castShadow>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshStandardMaterial color="#15803d" roughness={0.65} />
      </mesh>
    </group>
  );
}

function Sofa({
  position,
  color = "#334155",
}: {
  position: Vec3;
  color?: string;
}) {
  return (
    <group position={position}>
      <Block
        position={v(0, 0.32, 0)}
        scale={v(1.7, 0.32, 0.62)}
        color={color}
        roughness={0.75}
      />

      <Block
        position={v(0, 0.65, -0.28)}
        scale={v(1.8, 0.62, 0.18)}
        color={color}
        roughness={0.75}
      />

      <Block
        position={v(-0.92, 0.48, 0)}
        scale={v(0.18, 0.55, 0.65)}
        color={color}
      />

      <Block
        position={v(0.92, 0.48, 0)}
        scale={v(0.18, 0.55, 0.65)}
        color={color}
      />

      <Block
        position={v(-0.45, 0.56, 0.08)}
        scale={v(0.42, 0.2, 0.42)}
        color="#e5e7eb"
      />

      <Block
        position={v(0.45, 0.56, 0.08)}
        scale={v(0.42, 0.2, 0.42)}
        color="#cbd5e1"
      />
    </group>
  );
}

function Chair({
  position,
  rotation,
  color = "#1e293b",
}: {
  position: Vec3;
  rotation?: Vec3;
  color?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <Block
        position={v(0, 0.32, 0)}
        scale={v(0.42, 0.16, 0.42)}
        color={color}
        roughness={0.68}
      />

      <Block
        position={v(0, 0.63, -0.18)}
        scale={v(0.42, 0.5, 0.12)}
        color={color}
        roughness={0.68}
      />

      <Cylinder
        position={v(-0.15, 0.15, -0.14)}
        radius={0.025}
        height={0.3}
        color="#111827"
      />

      <Cylinder
        position={v(0.15, 0.15, -0.14)}
        radius={0.025}
        height={0.3}
        color="#111827"
      />

      <Cylinder
        position={v(-0.15, 0.15, 0.14)}
        radius={0.025}
        height={0.3}
        color="#111827"
      />

      <Cylinder
        position={v(0.15, 0.15, 0.14)}
        radius={0.025}
        height={0.3}
        color="#111827"
      />
    </group>
  );
}

function Table({
  position,
  scale = v(1.45, 0.12, 0.75),
  color = "#3f3f46",
}: {
  position: Vec3;
  scale?: Vec3;
  color?: string;
}) {
  return (
    <group position={position}>
      <Block
        position={v(0, 0.48, 0)}
        scale={scale}
        color={color}
        roughness={0.48}
      />

      <Cylinder
        position={v(-scale[0] / 2.4, 0.23, -scale[2] / 2.4)}
        radius={0.035}
        height={0.46}
        color="#111827"
      />

      <Cylinder
        position={v(scale[0] / 2.4, 0.23, -scale[2] / 2.4)}
        radius={0.035}
        height={0.46}
        color="#111827"
      />

      <Cylinder
        position={v(-scale[0] / 2.4, 0.23, scale[2] / 2.4)}
        radius={0.035}
        height={0.46}
        color="#111827"
      />

      <Cylinder
        position={v(scale[0] / 2.4, 0.23, scale[2] / 2.4)}
        radius={0.035}
        height={0.46}
        color="#111827"
      />
    </group>
  );
}

function DisplayBoard({
  text,
  position,
  accent = "#8b5cf6",
}: {
  text: string;
  position: Vec3;
  accent?: string;
}) {
  return (
    <group position={position}>
      <Block
        position={v(0, 0, 0)}
        scale={v(2.2, 0.65, 0.08)}
        color="#0f172a"
        roughness={0.45}
        emissive={accent}
        emissiveIntensity={0.08}
      />

      <Text
        position={v(0, 0.04, 0.06)}
        fontSize={0.14}
        color="#f8fafc"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {text}
      </Text>
    </group>
  );
}

function ReceptionRoom({ roomName }: { roomName: string }) {
  return (
    <group>
      <RoomShell
        wallColor="#f8fafc"
        floorColor="#273449"
        accent="#38bdf8"
      />

      <CeilingLight position={v(-1.6, 2.37, -0.6)} />
      <CeilingLight position={v(1.6, 2.37, -0.6)} />

      <WallPanel
        position={v(0, 1.35, -2.52)}
        scale={v(2.5, 1.05, 0.08)}
        color="#dbeafe"
      />

      <DisplayBoard
        text={roomName}
        position={v(0, 1.55, -2.44)}
        accent="#38bdf8"
      />

      <Block
        position={v(0, 0.55, -1.05)}
        scale={v(2.55, 0.78, 0.62)}
        color="#111827"
        roughness={0.5}
      />

      <Glass
        position={v(0, 1.02, -0.72)}
        scale={v(2.25, 0.22, 0.08)}
        color="#38bdf8"
        opacity={0.48}
      />

      <Sofa position={v(-2.15, 0, 0.85)} color="#475569" />
      <Sofa position={v(2.15, 0, 0.85)} color="#475569" />

      <Table
        position={v(0, 0, 1.15)}
        scale={v(1.2, 0.1, 0.65)}
        color="#1e293b"
      />

      <Plant position={v(-3, 0, -1.75)} />
      <Plant position={v(3, 0, -1.75)} />

      <Block
        position={v(0, 0.03, 0.85)}
        scale={v(2.6, 0.04, 1.35)}
        color="#0f172a"
        roughness={0.7}
      />
    </group>
  );
}

function MeetingRoom({ roomName }: { roomName: string }) {
  const chairPositions: {
    position: Vec3;
    rotation?: Vec3;
  }[] = [
    { position: v(-1.55, 0, -0.2), rotation: v(0, Math.PI / 2, 0) },
    { position: v(1.55, 0, -0.2), rotation: v(0, -Math.PI / 2, 0) },
    { position: v(-1.55, 0, 0.55), rotation: v(0, Math.PI / 2, 0) },
    { position: v(1.55, 0, 0.55), rotation: v(0, -Math.PI / 2, 0) },
    { position: v(-0.65, 0, 1.2), rotation: v(0, Math.PI, 0) },
    { position: v(0.65, 0, 1.2), rotation: v(0, Math.PI, 0) },
  ];

  return (
    <group>
      <RoomShell
        wallColor="#f1f5f9"
        floorColor="#1e293b"
        accent="#a78bfa"
      />

      <CeilingLight position={v(-1.5, 2.37, 0)} />
      <CeilingLight position={v(1.5, 2.37, 0)} />

      <DisplayBoard
        text={roomName}
        position={v(0, 1.55, -2.44)}
        accent="#a78bfa"
      />

      <Table
        position={v(0, 0, 0.25)}
        scale={v(2.35, 0.12, 1.15)}
        color="#27272a"
      />

      {chairPositions.map((chair) => (
        <Chair
          key={`${chair.position[0]}-${chair.position[2]}`}
          position={chair.position}
          rotation={chair.rotation}
          color="#334155"
        />
      ))}

      <Glass
        position={v(-3.53, 1.35, -0.55)}
        scale={v(0.08, 1.15, 2.4)}
        color="#bfdbfe"
        opacity={0.38}
      />

      <WallPanel
        position={v(2.95, 1.22, -0.8)}
        scale={v(0.08, 1.2, 1.9)}
        color="#e0e7ff"
      />

      <Plant position={v(-3, 0, 1.8)} />
      <Plant position={v(3, 0, 1.8)} />
    </group>
  );
}

function MainRoom({ roomName }: { roomName: string }) {
  return (
    <group>
      <RoomShell
        wallColor="#f8fafc"
        floorColor="#20242f"
        accent="#22c55e"
      />

      <CeilingLight position={v(0, 2.37, -0.5)} />

      <DisplayBoard
        text={roomName}
        position={v(0, 1.55, -2.44)}
        accent="#22c55e"
      />

      <Sofa position={v(0, 0, 0.8)} color="#334155" />

      <Table
        position={v(0, 0, -0.05)}
        scale={v(1.35, 0.1, 0.75)}
        color="#3f3f46"
      />

      <Chair
        position={v(-2.0, 0, 0.1)}
        rotation={v(0, Math.PI / 2, 0)}
        color="#475569"
      />

      <Chair
        position={v(2.0, 0, 0.1)}
        rotation={v(0, -Math.PI / 2, 0)}
        color="#475569"
      />

      <Block
        position={v(0, 1.15, -2.48)}
        scale={v(3.4, 1.55, 0.08)}
        color="#d1fae5"
        roughness={0.65}
      />

      <Glass
        position={v(0, 1.3, -2.4)}
        scale={v(1.9, 0.85, 0.08)}
        color="#86efac"
        opacity={0.32}
      />

      <Plant position={v(-3, 0, -1.65)} />
      <Plant position={v(3, 0, -1.65)} />

      <Block
        position={v(0, 0.03, 0.3)}
        scale={v(3.25, 0.04, 2.1)}
        color="#111827"
        roughness={0.74}
      />
    </group>
  );
}

function PrivateRoom({ roomName }: { roomName: string }) {
  return (
    <group>
      <RoomShell
        wallColor="#fafaf9"
        floorColor="#292524"
        accent="#f59e0b"
      />

      <CeilingLight position={v(0, 2.37, -0.4)} />

      <DisplayBoard
        text={roomName}
        position={v(0, 1.55, -2.44)}
        accent="#f59e0b"
      />

      <Block
        position={v(-0.65, 0.38, 0.25)}
        scale={v(2.1, 0.36, 1.25)}
        color="#78716c"
        roughness={0.72}
      />

      <Block
        position={v(-0.65, 0.67, -0.3)}
        scale={v(2.15, 0.42, 0.24)}
        color="#57534e"
      />

      <Block
        position={v(-0.65, 0.72, 0.22)}
        scale={v(1.75, 0.18, 0.95)}
        color="#e7e5e4"
        roughness={0.75}
      />

      <Table
        position={v(2.0, 0, 0.45)}
        scale={v(1.1, 0.1, 0.65)}
        color="#44403c"
      />

      <Chair
        position={v(2.0, 0, 1.18)}
        rotation={v(0, Math.PI, 0)}
        color="#57534e"
      />

      <Block
        position={v(2.85, 0.85, -1.35)}
        scale={v(0.6, 1.7, 0.45)}
        color="#1c1917"
      />

      <Glass
        position={v(-3.53, 1.35, -0.35)}
        scale={v(0.08, 1.2, 2.1)}
        color="#fde68a"
        opacity={0.32}
      />

      <Plant position={v(3, 0, 1.8)} />
    </group>
  );
}

function OverviewRoom({ roomName }: { roomName: string }) {
  return (
    <group>
      <RoomShell
        wallColor="#f8fafc"
        floorColor="#1f2937"
        accent="#38bdf8"
      />

      <CeilingLight position={v(-1.8, 2.37, -0.8)} />
      <CeilingLight position={v(0, 2.37, 0)} />
      <CeilingLight position={v(1.8, 2.37, -0.8)} />

      <DisplayBoard
        text={roomName}
        position={v(0, 1.55, -2.44)}
        accent="#38bdf8"
      />

      <Block
        position={v(-2.2, 0.04, 0)}
        scale={v(0.08, 0.08, 4.2)}
        color="#475569"
      />

      <Block
        position={v(2.2, 0.04, 0)}
        scale={v(0.08, 0.08, 4.2)}
        color="#475569"
      />

      <Block
        position={v(0, 0.04, -0.35)}
        scale={v(4.4, 0.08, 0.08)}
        color="#475569"
      />

      <Sofa position={v(-1.25, 0, 1.0)} color="#334155" />

      <Table
        position={v(1.25, 0, 1.0)}
        scale={v(1.25, 0.1, 0.7)}
        color="#3f3f46"
      />

      <Chair
        position={v(1.25, 0, 1.75)}
        rotation={v(0, Math.PI, 0)}
        color="#475569"
      />

      <Block
        position={v(-1.15, 0.42, -1.25)}
        scale={v(1.35, 0.28, 0.9)}
        color="#78716c"
      />

      <Block
        position={v(1.2, 0.5, -1.35)}
        scale={v(1.25, 0.65, 0.55)}
        color="#111827"
      />

      <Plant position={v(-3, 0, 1.75)} />
      <Plant position={v(3, 0, 1.75)} />
    </group>
  );
}

function PlaceholderRoom({
  roomName,
  roomType,
}: {
  roomName: string;
  roomType: RoomType;
}) {
  if (roomType === "reception") {
    return <ReceptionRoom roomName={roomName} />;
  }

  if (roomType === "meeting") {
    return <MeetingRoom roomName={roomName} />;
  }

  if (roomType === "private") {
    return <PrivateRoom roomName={roomName} />;
  }

  if (roomType === "overview") {
    return <OverviewRoom roomName={roomName} />;
  }

  return <MainRoom roomName={roomName} />;
}

export default function RoomModelViewer({
  roomName,
  modelPath,
  description,
}: RoomModelViewerProps) {
  const roomType = getRoomType(roomName);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
      <div className="border-b border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-purple-400">
          Real 3D Room Model
        </p>

        <h3 className="mt-2 text-lg font-semibold text-white">
          {roomName}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {description ||
            "This viewer is ready to load a real GLB/GLTF interior model."}
        </p>

        {!modelPath && (
          <div className="mt-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
            No GLB model connected yet. Showing upgraded professional placeholder room.
          </div>
        )}
      </div>

      <div className="h-[70vh] min-h-[620px]">
        <Canvas
          shadows
          camera={{
            position: [0, 2.1, 5.8],
            fov: 45,
          }}
          gl={{
            antialias: true,
          }}
        >
          <color attach="background" args={["#020617"]} />
          <fog attach="fog" args={["#020617", 9, 18]} />

          <ambientLight intensity={0.55} />

          <directionalLight
            position={[4, 6, 5]}
            intensity={1.6}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          <pointLight
            position={[-2.8, 2.5, 3]}
            intensity={0.5}
            color="#a78bfa"
          />

          <pointLight
            position={[2.8, 2.5, 3]}
            intensity={0.45}
            color="#38bdf8"
          />

          <Environment preset="apartment" />

          <Suspense fallback={<LoadingModel />}>
            {modelPath ? (
              <Bounds fit clip observe margin={1.2}>
                <Center>
                  <LoadedRoomModel modelPath={modelPath} />
                </Center>
              </Bounds>
            ) : (
              <PlaceholderRoom roomName={roomName} roomType={roomType} />
            )}
          </Suspense>

          <ContactShadows
            position={[0, -0.04, 0]}
            opacity={0.65}
            scale={8}
            blur={3}
            far={4}
          />

          <OrbitControls
            enablePan={false}
            enableZoom
            enableRotate
            minDistance={2.5}
            maxDistance={8}
            maxPolarAngle={Math.PI / 1.9}
          />
        </Canvas>
      </div>
    </div>
  );
}