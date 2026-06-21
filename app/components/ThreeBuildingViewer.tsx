"use client";

import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";

type Vec3 = [number, number, number];

type ModelType =
  | "villa"
  | "apartment"
  | "commercial"
  | "campus"
  | "hospital"
  | "mall"
  | "construction";

type ViewerProps = {
  projectName?: string;
  projectStage?: string;
};

function v(x: number, y: number, z: number): Vec3 {
  return [x, y, z];
}

function getModelType(projectName = "", projectStage = ""): ModelType {
  const text = `${projectName} ${projectStage}`.toLowerCase();

  if (
    text.includes("hospital") ||
    text.includes("medical") ||
    text.includes("clinic") ||
    text.includes("health")
  ) {
    return "hospital";
  }

  if (
    text.includes("college") ||
    text.includes("campus") ||
    text.includes("school") ||
    text.includes("university")
  ) {
    return "campus";
  }

  if (
    text.includes("mall") ||
    text.includes("shopping") ||
    text.includes("retail")
  ) {
    return "mall";
  }

  if (
    text.includes("commercial") ||
    text.includes("workspace") ||
    text.includes("office") ||
    text.includes("tech")
  ) {
    return "commercial";
  }

  if (
    text.includes("apartment") ||
    text.includes("tower") ||
    text.includes("residential") ||
    text.includes("complex")
  ) {
    return "apartment";
  }

  if (
    text.includes("construction") ||
    text.includes("monitoring") ||
    text.includes("site")
  ) {
    return "construction";
  }

  return "villa";
}

function getAccentColor(projectName = "") {
  const colors = [
    "#38bdf8",
    "#60a5fa",
    "#14b8a6",
    "#a78bfa",
    "#f59e0b",
    "#ef4444",
    "#22c55e",
  ];

  let hash = 0;

  for (let i = 0; i < projectName.length; i += 1) {
    hash = projectName.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

function Block({
  position,
  scale,
  color,
  roughness = 0.55,
  metalness = 0,
  opacity = 1,
}: {
  position: Vec3;
  scale: Vec3;
  color: string;
  roughness?: number;
  metalness?: number;
  opacity?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}

function Glass({
  position,
  scale,
  color = "#67e8f9",
  opacity = 0.42,
}: {
  position: Vec3;
  scale: Vec3;
  color?: string;
  opacity?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.08}
        metalness={0.2}
        transparent
        opacity={opacity}
        transmission={0.2}
      />
    </mesh>
  );
}

function Cylinder({
  position,
  radius = 0.1,
  height = 1,
  color = "#94a3b8",
}: {
  position: Vec3;
  radius?: number;
  height?: number;
  color?: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 32]} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );
}

function Slab({
  position,
  scale,
}: {
  position: Vec3;
  scale: Vec3;
}) {
  return (
    <Block
      position={position}
      scale={scale}
      color="#111827"
      roughness={0.75}
    />
  );
}

function BaseSite() {
  return (
    <>
      <Block
        position={v(0, -0.08, 0)}
        scale={v(10.5, 0.16, 7.4)}
        color="#020617"
        roughness={0.9}
      />

      <Block
        position={v(0, 0, 0)}
        scale={v(9.7, 0.04, 6.65)}
        color="#0f172a"
        roughness={0.85}
      />
    </>
  );
}

function Road({
  position,
  scale,
}: {
  position: Vec3;
  scale: Vec3;
}) {
  return (
    <Block
      position={position}
      scale={scale}
      color="#1e293b"
      roughness={0.82}
    />
  );
}

function Landscape({
  position,
  scale,
}: {
  position: Vec3;
  scale: Vec3;
}) {
  return (
    <Block
      position={position}
      scale={scale}
      color="#14532d"
      roughness={0.82}
    />
  );
}

function LightPost({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <Cylinder
        position={v(0, 0.25, 0)}
        radius={0.025}
        height={0.5}
        color="#94a3b8"
      />

      <mesh position={v(0, 0.55, 0)} castShadow>
        <sphereGeometry args={[0.075, 18, 18]} />
        <meshStandardMaterial
          color="#fde68a"
          emissive="#facc15"
          emissiveIntensity={1.2}
        />
      </mesh>

      <pointLight position={v(0, 0.6, 0)} intensity={0.28} distance={1.8} />
    </group>
  );
}

function TreeColumn({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <Cylinder
        position={v(0, 0.35, 0)}
        radius={0.05}
        height={0.7}
        color="#713f12"
      />

      <mesh position={v(0, 0.9, 0)} castShadow>
        <icosahedronGeometry args={[0.38, 1]} />
        <meshStandardMaterial color="#166534" roughness={0.65} />
      </mesh>
    </group>
  );
}

function Car({
  position,
  color = "#334155",
}: {
  position: Vec3;
  color?: string;
}) {
  return (
    <group position={position}>
      <Block
        position={v(0, 0.14, 0)}
        scale={v(0.8, 0.24, 0.42)}
        color={color}
        roughness={0.5}
      />

      <Glass
        position={v(0, 0.32, 0.02)}
        scale={v(0.45, 0.18, 0.32)}
        color="#bfdbfe"
        opacity={0.45}
      />
    </group>
  );
}

function WindowGrid({
  floors,
  columns,
  startX,
  startY,
  z,
  gapX,
  gapY,
  accent,
}: {
  floors: number;
  columns: number;
  startX: number;
  startY: number;
  z: number;
  gapX: number;
  gapY: number;
  accent: string;
}) {
  return (
    <>
      {Array.from({ length: floors }).map((_, floor) => (
        <group key={floor}>
          {Array.from({ length: columns }).map((__, column) => (
            <Glass
              key={`${floor}-${column}`}
              position={v(
                startX + column * gapX,
                startY + floor * gapY,
                z
              )}
              scale={v(0.34, 0.26, 0.055)}
              color={accent}
              opacity={0.42}
            />
          ))}
        </group>
      ))}
    </>
  );
}

function VerticalFins({
  count,
  startX,
  y,
  z,
  height,
}: {
  count: number;
  startX: number;
  y: number;
  z: number;
  height: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Block
          key={index}
          position={v(startX + index * 0.5, y, z)}
          scale={v(0.04, height, 0.12)}
          color="#0f172a"
          roughness={0.7}
        />
      ))}
    </>
  );
}

/* 1. Luxury Villa */
function VillaModel({ accent }: { accent: string }) {
  return (
    <group rotation={v(0, -0.35, 0)}>
      <BaseSite />

      <Landscape position={v(-3.2, 0.03, 2.0)} scale={v(2.2, 0.05, 1.6)} />
      <Landscape position={v(3.2, 0.03, 2.0)} scale={v(2.1, 0.05, 1.6)} />
      <Road position={v(0.1, 0.05, 2.55)} scale={v(3.0, 0.06, 1.35)} />

      <Block
        position={v(-0.9, 0.55, -0.4)}
        scale={v(3.8, 1.1, 2.35)}
        color="#d8dee8"
      />

      <Block
        position={v(1.4, 1.08, -0.45)}
        scale={v(2.2, 2.05, 2.15)}
        color="#f8fafc"
      />

      <Block
        position={v(-2.55, 0.68, -0.45)}
        scale={v(1.0, 1.35, 2.0)}
        color="#273449"
      />

      <Block
        position={v(-0.65, 1.8, -0.2)}
        scale={v(3.25, 1.05, 2.05)}
        color="#e5e7eb"
      />

      <Slab position={v(-0.65, 2.45, -0.2)} scale={v(3.6, 0.16, 2.35)} />
      <Slab position={v(1.45, 2.18, -0.45)} scale={v(2.55, 0.16, 2.5)} />

      <Glass position={v(-0.5, 0.75, 0.84)} scale={v(1.25, 0.7, 0.06)} color={accent} />
      <Glass position={v(1.05, 0.75, 0.84)} scale={v(1.1, 0.7, 0.06)} color={accent} />
      <Glass position={v(-1.2, 1.88, 0.68)} scale={v(1.05, 0.55, 0.06)} color={accent} />
      <Glass position={v(0.35, 1.88, 0.68)} scale={v(1.05, 0.55, 0.06)} color={accent} />

      <Block
        position={v(-0.65, 1.38, 1.1)}
        scale={v(2.45, 0.12, 0.55)}
        color="#334155"
      />

      <Glass
        position={v(-0.65, 1.68, 1.38)}
        scale={v(2.45, 0.42, 0.06)}
        color="#dbeafe"
        opacity={0.35}
      />

      <Block
        position={v(2.55, 0.08, -1.75)}
        scale={v(2.25, 0.05, 1.2)}
        color="#e2e8f0"
      />

      <Glass
        position={v(2.55, 0.15, -1.75)}
        scale={v(2.0, 0.06, 0.95)}
        color="#38bdf8"
        opacity={0.55}
      />

      <Car position={v(0.75, 0.16, 2.55)} color={accent} />

      <TreeColumn position={v(-3.7, 0, -2.3)} />
      <TreeColumn position={v(3.75, 0, -2.35)} />
      <TreeColumn position={v(3.75, 0, 1.35)} />

      <LightPost position={v(-3.2, 0, 1.2)} />
      <LightPost position={v(-1.4, 0, 2.9)} />
      <LightPost position={v(2.2, 0, 2.9)} />
    </group>
  );
}

/* 2. Apartment Tower */
function ApartmentTowerModel({ accent }: { accent: string }) {
  return (
    <group rotation={v(0, -0.28, 0)}>
      <BaseSite />

      <Road position={v(0, 0.05, 2.55)} scale={v(6.9, 0.06, 1.15)} />
      <Landscape position={v(3.05, 0.04, 1.35)} scale={v(1.25, 0.05, 1.0)} />

      <Block
        position={v(0, 0.35, 0.2)}
        scale={v(5.3, 0.7, 2.2)}
        color="#475569"
      />

      <Block
        position={v(0, 2.3, -0.35)}
        scale={v(3.25, 4.6, 2.0)}
        color="#dbe3ee"
      />

      <Block
        position={v(-2.25, 1.8, -0.4)}
        scale={v(1.35, 3.6, 1.85)}
        color="#64748b"
      />

      <Block
        position={v(2.25, 1.8, -0.4)}
        scale={v(1.35, 3.6, 1.85)}
        color="#94a3b8"
      />

      <Slab position={v(0, 4.7, -0.35)} scale={v(3.6, 0.18, 2.35)} />

      <WindowGrid
        floors={7}
        columns={4}
        startX={-0.9}
        startY={0.65}
        z={0.68}
        gapX={0.6}
        gapY={0.55}
        accent={accent}
      />

      <VerticalFins
        count={7}
        startX={-1.45}
        y={2.25}
        z={0.95}
        height={3.4}
      />

      <Block
        position={v(-3.1, 0.5, 1.35)}
        scale={v(1.2, 1.0, 1.1)}
        color="#0f172a"
      />

      <Glass
        position={v(-3.1, 0.62, 1.93)}
        scale={v(0.7, 0.48, 0.06)}
        color={accent}
      />

      <Car position={v(-1.2, 0.16, 2.55)} color="#334155" />
      <Car position={v(1.25, 0.16, 2.55)} color={accent} />

      <TreeColumn position={v(-3.65, 0, -2.15)} />
      <TreeColumn position={v(3.65, 0, -2.15)} />

      <LightPost position={v(-2.4, 0, 2.95)} />
      <LightPost position={v(0, 0, 2.95)} />
      <LightPost position={v(2.4, 0, 2.95)} />
    </group>
  );
}

/* 3. Commercial Office */
function CommercialOfficeModel({ accent }: { accent: string }) {
  return (
    <group rotation={v(0, -0.35, 0)}>
      <BaseSite />

      <Road position={v(0, 0.05, 2.42)} scale={v(6.6, 0.06, 1.3)} />

      <Block
        position={v(-1.35, 1.55, -0.35)}
        scale={v(2.65, 3.1, 2.25)}
        color="#e2e8f0"
      />

      <Block
        position={v(1.65, 1.85, -0.4)}
        scale={v(2.1, 3.7, 2.0)}
        color="#111827"
      />

      <Block
        position={v(-3.05, 0.85, -0.4)}
        scale={v(1.15, 1.7, 1.8)}
        color="#475569"
      />

      <Glass
        position={v(-1.35, 1.55, 0.8)}
        scale={v(2.2, 2.2, 0.07)}
        color={accent}
        opacity={0.45}
      />

      <Glass
        position={v(1.65, 1.85, 0.63)}
        scale={v(1.4, 2.65, 0.07)}
        color="#93c5fd"
        opacity={0.44}
      />

      <Slab position={v(0.15, 3.45, -0.38)} scale={v(5.0, 0.18, 2.5)} />

      <Block
        position={v(0.1, 0.42, 1.0)}
        scale={v(1.35, 0.84, 0.12)}
        color="#020617"
      />

      <Block
        position={v(0.15, 0.14, 1.65)}
        scale={v(3.4, 0.08, 0.8)}
        color="#334155"
      />

      <Block
        position={v(0.15, 3.78, -0.25)}
        scale={v(1.2, 0.08, 1.2)}
        color={accent}
        emissive={accent}
        emissiveIntensity={0.22}
      />

      <Car position={v(-1.4, 0.16, 2.5)} color={accent} />
      <Car position={v(1.25, 0.16, 2.5)} color="#f97316" />

      <TreeColumn position={v(-3.7, 0, 1.45)} />
      <TreeColumn position={v(3.75, 0, 1.45)} />
      <TreeColumn position={v(-3.65, 0, -2.25)} />

      <LightPost position={v(-2.6, 0, 2.9)} />
      <LightPost position={v(0, 0, 2.95)} />
      <LightPost position={v(2.6, 0, 2.9)} />
    </group>
  );
}

/* 4. College Campus */
function CampusModel({ accent }: { accent: string }) {
  return (
    <group rotation={v(0, -0.3, 0)}>
      <BaseSite />

      <Road position={v(0, 0.05, 2.55)} scale={v(7.2, 0.06, 1.05)} />

      <Block
        position={v(0, 0.78, -0.75)}
        scale={v(4.3, 1.55, 1.75)}
        color="#dbe3ee"
      />

      <Block
        position={v(-2.85, 0.56, -0.65)}
        scale={v(1.2, 1.12, 1.55)}
        color="#94a3b8"
      />

      <Block
        position={v(2.85, 0.56, -0.65)}
        scale={v(1.2, 1.12, 1.55)}
        color="#94a3b8"
      />

      <Slab position={v(0, 1.65, -0.75)} scale={v(4.7, 0.18, 2.05)} />

      {[-1.55, -0.75, 0.05, 0.85, 1.65].map((x) => (
        <Glass
          key={x}
          position={v(x, 0.85, 0.15)}
          scale={v(0.42, 0.38, 0.06)}
          color={accent}
        />
      ))}

      <Block
        position={v(0, 0.44, 0.26)}
        scale={v(0.9, 0.78, 0.1)}
        color="#0f172a"
      />

      <Block
        position={v(0, 0.12, 1.15)}
        scale={v(1.65, 0.07, 1.35)}
        color="#64748b"
      />

      <Landscape
        position={v(0, 0.05, -2.35)}
        scale={v(3.3, 0.06, 1.05)}
      />

      <Block
        position={v(0, 0.12, -2.35)}
        scale={v(2.2, 0.04, 0.08)}
        color="#f8fafc"
      />

      <Block
        position={v(0, 0.12, -2.35)}
        scale={v(0.08, 0.04, 0.8)}
        color="#f8fafc"
      />

      <Block
        position={v(-3.15, 0.38, 0.75)}
        scale={v(0.85, 0.76, 0.9)}
        color="#475569"
      />

      <Block
        position={v(3.15, 0.38, 0.75)}
        scale={v(0.85, 0.76, 0.9)}
        color="#475569"
      />

      <Block
        position={v(0, 1.88, -0.75)}
        scale={v(1.1, 0.08, 0.8)}
        color={accent}
        emissive={accent}
        emissiveIntensity={0.2}
      />

      <TreeColumn position={v(-3.75, 0, 2.2)} />
      <TreeColumn position={v(3.75, 0, 2.2)} />
      <TreeColumn position={v(-3.65, 0, -2.35)} />
      <TreeColumn position={v(3.65, 0, -2.35)} />

      <LightPost position={v(-2.7, 0, 2.95)} />
      <LightPost position={v(0, 0, 2.95)} />
      <LightPost position={v(2.7, 0, 2.95)} />
    </group>
  );
}

/* 5. Hospital Building */
function HospitalModel({ accent }: { accent: string }) {
  return (
    <group rotation={v(0, -0.28, 0)}>
      <BaseSite />

      <Road position={v(0, 0.05, 2.5)} scale={v(7.0, 0.06, 1.12)} />

      <Block
        position={v(0, 1.2, -0.38)}
        scale={v(4.2, 2.4, 2.15)}
        color="#f8fafc"
      />

      <Block
        position={v(-2.65, 0.88, -0.38)}
        scale={v(1.45, 1.75, 1.95)}
        color="#dbeafe"
      />

      <Block
        position={v(2.65, 0.88, -0.38)}
        scale={v(1.45, 1.75, 1.95)}
        color="#dbeafe"
      />

      <Slab position={v(0, 2.5, -0.38)} scale={v(4.6, 0.18, 2.45)} />

      <Block
        position={v(0, 1.48, 0.73)}
        scale={v(0.68, 0.16, 0.08)}
        color="#ef4444"
        emissive="#ef4444"
        emissiveIntensity={0.35}
      />

      <Block
        position={v(0, 1.48, 0.73)}
        scale={v(0.16, 0.68, 0.08)}
        color="#ef4444"
        emissive="#ef4444"
        emissiveIntensity={0.35}
      />

      {[-1.45, -0.75, 0.75, 1.45].map((x) => (
        <Glass
          key={x}
          position={v(x, 0.82, 0.72)}
          scale={v(0.42, 0.36, 0.06)}
          color={accent}
        />
      ))}

      <Block
        position={v(0, 0.45, 0.8)}
        scale={v(1.1, 0.86, 0.12)}
        color="#020617"
      />

      <Block
        position={v(0, 0.14, 1.35)}
        scale={v(2.0, 0.08, 0.95)}
        color="#334155"
      />

      <Car position={v(2.7, 0.16, 1.85)} color="#ffffff" />

      <Block
        position={v(2.7, 0.52, 2.13)}
        scale={v(0.28, 0.06, 0.04)}
        color="#ef4444"
      />

      <Block
        position={v(2.7, 0.52, 2.13)}
        scale={v(0.06, 0.28, 0.04)}
        color="#ef4444"
      />

      <mesh position={v(-2.55, 2.64, -0.35)} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.06, 32]} />
        <meshStandardMaterial color="#111827" roughness={0.4} />
      </mesh>

      <Block
        position={v(-2.55, 2.71, -0.35)}
        scale={v(0.65, 0.05, 0.12)}
        color="#ef4444"
      />

      <Block
        position={v(-2.55, 2.71, -0.35)}
        scale={v(0.12, 0.05, 0.65)}
        color="#ef4444"
      />

      <TreeColumn position={v(-3.75, 0, 1.8)} />
      <TreeColumn position={v(3.75, 0, -2.15)} />

      <LightPost position={v(-2.5, 0, 2.9)} />
      <LightPost position={v(0, 0, 2.95)} />
      <LightPost position={v(2.5, 0, 2.9)} />
    </group>
  );
}

/* 6. Shopping Mall */
function MallModel({ accent }: { accent: string }) {
  return (
    <group rotation={v(0, -0.35, 0)}>
      <BaseSite />

      <Road position={v(0, 0.05, 2.55)} scale={v(7.2, 0.06, 1.05)} />

      <Block
        position={v(0, 0.95, -0.45)}
        scale={v(5.5, 1.9, 2.35)}
        color="#e2e8f0"
      />

      <Slab position={v(0, 2.0, -0.45)} scale={v(5.85, 0.18, 2.65)} />

      <Glass
        position={v(0, 0.95, 0.76)}
        scale={v(2.1, 1.2, 0.08)}
        color={accent}
        opacity={0.5}
      />

      <Glass
        position={v(-2.0, 0.85, 0.76)}
        scale={v(0.78, 0.84, 0.08)}
        color="#93c5fd"
        opacity={0.46}
      />

      <Glass
        position={v(2.0, 0.85, 0.76)}
        scale={v(0.78, 0.84, 0.08)}
        color="#93c5fd"
        opacity={0.46}
      />

      <Block
        position={v(0, 1.96, 0.94)}
        scale={v(2.0, 0.16, 0.14)}
        color={accent}
        emissive={accent}
        emissiveIntensity={0.25}
      />

      <Block
        position={v(-2.8, 0.08, 1.65)}
        scale={v(1.2, 0.08, 0.78)}
        color="#334155"
      />

      <Block
        position={v(2.8, 0.08, 1.65)}
        scale={v(1.2, 0.08, 0.78)}
        color="#334155"
      />

      <Car position={v(-2.6, 0.16, 2.45)} color="#f97316" />
      <Car position={v(0, 0.16, 2.45)} color="#22c55e" />
      <Car position={v(2.6, 0.16, 2.45)} color="#3b82f6" />

      <TreeColumn position={v(-3.75, 0, 2.15)} />
      <TreeColumn position={v(3.75, 0, 2.15)} />
      <TreeColumn position={v(-3.75, 0, -2.2)} />
      <TreeColumn position={v(3.75, 0, -2.2)} />

      <LightPost position={v(-2.7, 0, 2.95)} />
      <LightPost position={v(0, 0, 2.95)} />
      <LightPost position={v(2.7, 0, 2.95)} />
    </group>
  );
}

/* 7. Construction Site */
function ConstructionModel({ accent }: { accent: string }) {
  return (
    <group rotation={v(0, -0.32, 0)}>
      <BaseSite />

      <Block
        position={v(0, 0.05, 0)}
        scale={v(5.9, 0.12, 3.9)}
        color="#57534e"
        roughness={0.82}
      />

      {[-1.7, 0, 1.7].map((x) => (
        <group key={x}>
          <Cylinder
            position={v(x, 0.58, -1.2)}
            radius={0.075}
            height={1.16}
            color="#94a3b8"
          />

          <Cylinder
            position={v(x, 0.58, 0.15)}
            radius={0.075}
            height={1.16}
            color="#94a3b8"
          />
        </group>
      ))}

      <Block
        position={v(0, 1.15, -0.55)}
        scale={v(3.85, 0.18, 2.2)}
        color="#cbd5e1"
      />

      <Block
        position={v(0, 2.0, -0.55)}
        scale={v(3.1, 0.16, 1.75)}
        color="#e2e8f0"
      />

      <Block
        position={v(-3.0, 1.35, -1.35)}
        scale={v(0.16, 2.7, 0.16)}
        color="#facc15"
      />

      <Block
        position={v(-1.75, 2.65, -1.35)}
        scale={v(2.7, 0.13, 0.13)}
        color="#facc15"
      />

      <Block
        position={v(-0.55, 2.33, -1.35)}
        scale={v(0.11, 0.62, 0.11)}
        color="#facc15"
      />

      <Block
        position={v(-0.55, 2.0, -1.35)}
        scale={v(0.42, 0.18, 0.42)}
        color={accent}
      />

      <Car position={v(2.55, 0.16, 1.45)} color="#f97316" />

      <Block
        position={v(-3.2, 0.18, 1.55)}
        scale={v(1.05, 0.36, 0.78)}
        color="#334155"
      />

      <Block
        position={v(3.25, 0.18, -1.9)}
        scale={v(0.95, 0.34, 0.95)}
        color="#64748b"
      />

      <LightPost position={v(-2.8, 0, 2.75)} />
      <LightPost position={v(0, 0, 2.85)} />
      <LightPost position={v(2.8, 0, 2.75)} />
    </group>
  );
}

function ProjectBasedModel({
  modelType,
  accent,
}: {
  modelType: ModelType;
  accent: string;
}) {
  if (modelType === "apartment") {
    return <ApartmentTowerModel accent={accent} />;
  }

  if (modelType === "commercial") {
    return <CommercialOfficeModel accent={accent} />;
  }

  if (modelType === "campus") {
    return <CampusModel accent={accent} />;
  }

  if (modelType === "hospital") {
    return <HospitalModel accent={accent} />;
  }

  if (modelType === "mall") {
    return <MallModel accent={accent} />;
  }

  if (modelType === "construction") {
    return <ConstructionModel accent={accent} />;
  }

  return <VillaModel accent={accent} />;
}

export default function ThreeBuildingViewer({
  projectName,
  projectStage,
}: ViewerProps) {
  const modelType = getModelType(projectName, projectStage);
  const accent = getAccentColor(projectName);

  return (
    <div className="h-[430px] w-full overflow-hidden rounded-3xl bg-slate-950">
      <Canvas
        shadows
        camera={{
          position: [6.2, 4.6, 7.2],
          fov: 40,
        }}
        gl={{
          antialias: true,
        }}
      >
        <color attach="background" args={["#020617"]} />
        <fog attach="fog" args={["#020617", 9, 18]} />

        <ambientLight intensity={0.45} />

        <directionalLight
          position={[5, 8, 6]}
          intensity={2.1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <pointLight
          position={[-3, 3.2, 4]}
          intensity={0.5}
          color="#38bdf8"
        />

        <pointLight
          position={[4, 2.8, -3]}
          intensity={0.35}
          color="#a78bfa"
        />

        <Environment preset="city" />

        <ProjectBasedModel modelType={modelType} accent={accent} />

        <ContactShadows
          position={[0, -0.02, 0]}
          opacity={0.68}
          scale={10}
          blur={3}
          far={5}
        />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={4}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>
    </div>
  );
}