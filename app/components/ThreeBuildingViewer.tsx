"use client";

import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  OrbitControls,
  Sparkles,
  Text,
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

type ThreeBuildingViewerProps = {
  projectName?: string;
  projectStage?: string;
};

function v(x: number, y: number, z: number): Vec3 {
  return [x, y, z];
}

function getModelType(projectName = "", projectStage = ""): ModelType {
  const name = projectName.toLowerCase();
  const stage = projectStage.toLowerCase();

  if (
    name.includes("hospital") ||
    name.includes("clinic") ||
    name.includes("medical") ||
    name.includes("health")
  ) {
    return "hospital";
  }

  if (
    name.includes("commercial") ||
    name.includes("office") ||
    name.includes("workspace") ||
    name.includes("tech") ||
    name.includes("park")
  ) {
    return "commercial";
  }

  if (
    name.includes("college") ||
    name.includes("campus") ||
    name.includes("school") ||
    name.includes("university")
  ) {
    return "campus";
  }

  if (
    name.includes("mall") ||
    name.includes("shopping") ||
    name.includes("retail")
  ) {
    return "mall";
  }

  if (
    name.includes("apartment") ||
    name.includes("tower") ||
    name.includes("residential") ||
    name.includes("complex")
  ) {
    return "apartment";
  }

  if (
    name.includes("construction") ||
    name.includes("site") ||
    stage.includes("construction") ||
    stage.includes("site") ||
    stage.includes("monitoring")
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

  for (let index = 0; index < projectName.length; index += 1) {
    hash = projectName.charCodeAt(index) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

function Block({
  position,
  scale,
  color,
  roughness = 0.6,
  metalness = 0,
  opacity = 1,
  emissive,
  emissiveIntensity = 0,
}: {
  position: Vec3;
  scale: Vec3;
  color: string;
  roughness?: number;
  metalness?: number;
  opacity?: number;
  emissive?: string;
  emissiveIntensity?: number;
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
  opacity = 0.45,
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
        metalness={0.12}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function Cylinder({
  position,
  radius = 0.08,
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
      <cylinderGeometry args={[radius, radius, height, 24]} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );
}

function BaseSite() {
  return (
    <>
      <Block
        position={v(0, -0.08, 0)}
        scale={v(9.5, 0.16, 6.8)}
        color="#020617"
        roughness={0.9}
      />

      <Block
        position={v(0, -0.01, 0)}
        scale={v(8.8, 0.04, 6.1)}
        color="#07111f"
        roughness={0.85}
      />

      <Block
        position={v(0, 0.04, 2.55)}
        scale={v(7.3, 0.06, 1.15)}
        color="#1e293b"
        roughness={0.82}
      />
    </>
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
      color="#166534"
      roughness={0.8}
    />
  );
}

function Tree({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <Cylinder
        position={v(0, 0.28, 0)}
        radius={0.055}
        height={0.56}
        color="#78350f"
      />

      <mesh position={v(0, 0.78, 0)} castShadow>
        <coneGeometry args={[0.28, 0.75, 24]} />
        <meshStandardMaterial color="#15803d" roughness={0.6} />
      </mesh>

      <mesh position={v(0, 1.08, 0)} castShadow>
        <coneGeometry args={[0.22, 0.55, 24]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} />
      </mesh>
    </group>
  );
}

function LightPost({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <Cylinder
        position={v(0, 0.28, 0)}
        radius={0.025}
        height={0.56}
        color="#94a3b8"
      />

      <mesh position={v(0, 0.62, 0)} castShadow>
        <sphereGeometry args={[0.075, 18, 18]} />

        <meshStandardMaterial
          color="#fde68a"
          emissive="#facc15"
          emissiveIntensity={1.2}
        />
      </mesh>

      <pointLight position={v(0, 0.7, 0)} intensity={0.35} distance={1.8} />
    </group>
  );
}

function Vehicle({
  position,
  color = "#2563eb",
}: {
  position: Vec3;
  color?: string;
}) {
  return (
    <group position={position}>
      <Block
        position={v(0, 0.16, 0)}
        scale={v(0.9, 0.28, 0.48)}
        color={color}
      />

      <Glass
        position={v(0, 0.38, 0)}
        scale={v(0.5, 0.22, 0.34)}
        color="#bae6fd"
        opacity={0.75}
      />

      <mesh position={v(-0.32, 0, 0.28)} rotation={v(Math.PI / 2, 0, 0)}>
        <cylinderGeometry args={[0.08, 0.08, 0.08, 18]} />
        <meshStandardMaterial color="#020617" />
      </mesh>

      <mesh position={v(0.32, 0, 0.28)} rotation={v(Math.PI / 2, 0, 0)}>
        <cylinderGeometry args={[0.08, 0.08, 0.08, 18]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
    </group>
  );
}

function FloatingLabel({
  text,
  position,
  color = "#f8fafc",
}: {
  text: string;
  position: Vec3;
  color?: string;
}) {
  return (
    <Text
      position={position}
      fontSize={0.22}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.01}
      outlineColor="#020617"
    >
      {text}
    </Text>
  );
}

function VillaModel({ accent }: { accent: string }) {
  return (
    <group rotation={v(0, -0.35, 0)}>
      <BaseSite />

      <Landscape
        position={v(-3.1, 0.02, 1.35)}
        scale={v(1.9, 0.05, 1.25)}
      />

      <Landscape
        position={v(3.1, 0.02, 1.35)}
        scale={v(1.9, 0.05, 1.25)}
      />

      <Block
        position={v(-0.9, 0.55, -0.35)}
        scale={v(3.8, 1.1, 2.45)}
        color="#d8dee8"
      />

      <Block
        position={v(1.35, 1.08, -0.45)}
        scale={v(2.25, 2.05, 2.2)}
        color="#f8fafc"
      />

      <Block
        position={v(-0.75, 1.82, -0.18)}
        scale={v(3.25, 1.05, 2.05)}
        color="#e6edf5"
      />

      <Block
        position={v(-0.75, 2.45, -0.18)}
        scale={v(3.55, 0.16, 2.35)}
        color="#07111f"
      />

      <Block
        position={v(1.35, 2.18, -0.45)}
        scale={v(2.55, 0.16, 2.5)}
        color="#07111f"
      />

      <Glass
        position={v(-0.55, 0.75, 0.9)}
        scale={v(1.3, 0.7, 0.07)}
        color={accent}
      />

      <Glass
        position={v(1.0, 0.75, 0.9)}
        scale={v(1.1, 0.7, 0.07)}
        color={accent}
      />

      <Glass
        position={v(-1.2, 1.88, 0.72)}
        scale={v(1.05, 0.55, 0.07)}
        color={accent}
      />

      <Block
        position={v(2.55, 0.08, -1.75)}
        scale={v(2.35, 0.05, 1.25)}
        color="#e2e8f0"
      />

      <mesh position={v(2.55, 0.14, -1.75)} receiveShadow>
        <boxGeometry args={[2.1, 0.05, 1.0]} />

        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.05}
          metalness={0.08}
          transparent
          opacity={0.78}
        />
      </mesh>

      <Vehicle position={v(0.75, 0.16, 2.55)} color={accent} />

      <Tree position={v(-3.7, 0, -2.2)} />
      <Tree position={v(3.7, 0, -2.25)} />
      <Tree position={v(3.7, 0, 1.8)} />

      <LightPost position={v(-2.6, 0, 2.95)} />
      <LightPost position={v(0, 0, 2.95)} />
      <LightPost position={v(2.6, 0, 2.95)} />

      <FloatingLabel
        text="VILLA"
        position={v(0, 2.9, 0.4)}
        color={accent}
      />
    </group>
  );
}

function ApartmentModel({ accent }: { accent: string }) {
  const floors = [0, 1, 2, 3, 4, 5, 6];

  return (
    <group rotation={v(0, -0.28, 0)}>
      <BaseSite />

      <Landscape
        position={v(3.1, 0.02, 1.2)}
        scale={v(1.4, 0.05, 1.1)}
      />

      <Block
        position={v(0, 0.35, 0.2)}
        scale={v(5.2, 0.7, 2.2)}
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

      <Block
        position={v(0, 4.7, -0.35)}
        scale={v(3.55, 0.18, 2.35)}
        color="#07111f"
      />

      {floors.map((floor) => (
        <group key={floor}>
          {[-0.9, -0.3, 0.3, 0.9].map((x) => (
            <Glass
              key={`${floor}-${x}`}
              position={v(x, 0.65 + floor * 0.55, 0.68)}
              scale={v(0.35, 0.26, 0.06)}
              color={accent}
            />
          ))}

          <Block
            position={v(0, 0.45 + floor * 0.55, 0.93)}
            scale={v(2.3, 0.06, 0.28)}
            color="#1e293b"
          />
        </group>
      ))}

      <Vehicle position={v(-1.2, 0.16, 2.55)} color="#334155" />
      <Vehicle position={v(1.25, 0.16, 2.55)} color={accent} />

      <Tree position={v(-3.7, 0, -2.2)} />
      <Tree position={v(3.7, 0, -2.2)} />

      <LightPost position={v(-2.6, 0, 2.95)} />
      <LightPost position={v(0, 0, 2.95)} />
      <LightPost position={v(2.6, 0, 2.95)} />

      <FloatingLabel
        text="APARTMENT TOWER"
        position={v(0, 5.15, 0.5)}
        color={accent}
      />
    </group>
  );
}

function CommercialModel({ accent }: { accent: string }) {
  return (
    <group rotation={v(0, -0.35, 0)}>
      <BaseSite />

      <Block
        position={v(0, 0.05, 2.55)}
        scale={v(7.3, 0.08, 1.1)}
        color="#1e293b"
        roughness={0.82}
      />

      <Landscape
        position={v(-3.25, 0.03, 1.35)}
        scale={v(1.5, 0.06, 1.2)}
      />

      <Landscape
        position={v(3.25, 0.03, 1.35)}
        scale={v(1.5, 0.06, 1.2)}
      />

      <Block
        position={v(0, 2.15, -0.65)}
        scale={v(2.8, 4.3, 1.8)}
        color="#e5e7eb"
        roughness={0.45}
      />

      <Block
        position={v(-2.15, 1.45, -0.45)}
        scale={v(1.65, 2.9, 1.65)}
        color="#111827"
        roughness={0.42}
      />

      <Block
        position={v(2.15, 1.45, -0.45)}
        scale={v(1.65, 2.9, 1.65)}
        color="#111827"
        roughness={0.42}
      />

      <Glass
        position={v(0, 2.2, 0.28)}
        scale={v(2.25, 3.35, 0.08)}
        color={accent}
        opacity={0.48}
      />

      <Glass
        position={v(-2.15, 1.48, 0.4)}
        scale={v(1.2, 2.15, 0.08)}
        color="#93c5fd"
        opacity={0.45}
      />

      <Glass
        position={v(2.15, 1.48, 0.4)}
        scale={v(1.2, 2.15, 0.08)}
        color="#93c5fd"
        opacity={0.45}
      />

      {[0.95, 1.45, 1.95, 2.45, 2.95, 3.45].map((height) => (
        <Block
          key={height}
          position={v(0, height, 0.38)}
          scale={v(2.5, 0.035, 0.08)}
          color="#0f172a"
          opacity={0.85}
        />
      ))}

      {[0.75, 1.25, 1.75, 2.25].map((height) => (
        <group key={height}>
          <Block
            position={v(-2.15, height, 0.5)}
            scale={v(1.3, 0.035, 0.08)}
            color="#334155"
          />

          <Block
            position={v(2.15, height, 0.5)}
            scale={v(1.3, 0.035, 0.08)}
            color="#334155"
          />
        </group>
      ))}

      <Block
        position={v(0, 4.42, -0.65)}
        scale={v(3.25, 0.18, 2.15)}
        color="#020617"
        roughness={0.5}
      />

      <Block
        position={v(-2.15, 2.98, -0.45)}
        scale={v(1.9, 0.16, 1.95)}
        color="#020617"
        roughness={0.5}
      />

      <Block
        position={v(2.15, 2.98, -0.45)}
        scale={v(1.9, 0.16, 1.95)}
        color="#020617"
        roughness={0.5}
      />

      <Block
        position={v(0, 0.28, 0.92)}
        scale={v(2.7, 0.56, 0.55)}
        color="#0f172a"
        roughness={0.55}
      />

      <Glass
        position={v(0, 0.62, 1.22)}
        scale={v(1.45, 0.7, 0.08)}
        color="#dbeafe"
        opacity={0.55}
      />

      <Block
        position={v(0, 0.08, 1.65)}
        scale={v(2.1, 0.08, 0.45)}
        color="#475569"
      />

      <Block
        position={v(0, 0.14, 1.95)}
        scale={v(2.55, 0.08, 0.4)}
        color="#64748b"
      />

      <Block
        position={v(0, 4.62, 0.08)}
        scale={v(1.8, 0.08, 0.16)}
        color={accent}
        emissive={accent}
        emissiveIntensity={0.35}
      />

      <Vehicle position={v(-1.65, 0.16, 2.55)} color="#334155" />
      <Vehicle position={v(0.4, 0.16, 2.55)} color={accent} />
      <Vehicle position={v(2.35, 0.16, 2.55)} color="#f97316" />

      <Tree position={v(-3.75, 0, 1.85)} />
      <Tree position={v(3.75, 0, 1.85)} />
      <Tree position={v(-3.75, 0, -2.2)} />
      <Tree position={v(3.75, 0, -2.2)} />

      <LightPost position={v(-2.8, 0, 2.95)} />
      <LightPost position={v(-0.8, 0, 2.95)} />
      <LightPost position={v(0.8, 0, 2.95)} />
      <LightPost position={v(2.8, 0, 2.95)} />

      <FloatingLabel
        text="NOVA TECH OFFICE"
        position={v(0, 4.95, 0.35)}
        color={accent}
      />
    </group>
  );
}

function CampusModel({ accent }: { accent: string }) {
  return (
    <group rotation={v(0, -0.3, 0)}>
      <BaseSite />

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

      <Block
        position={v(0, 1.65, -0.75)}
        scale={v(4.7, 0.18, 2.05)}
        color="#07111f"
      />

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

      <Tree position={v(-3.75, 0, 2.2)} />
      <Tree position={v(3.75, 0, 2.2)} />
      <Tree position={v(-3.65, 0, -2.35)} />
      <Tree position={v(3.65, 0, -2.35)} />

      <LightPost position={v(-2.7, 0, 2.95)} />
      <LightPost position={v(0, 0, 2.95)} />
      <LightPost position={v(2.7, 0, 2.95)} />

      <FloatingLabel
        text="CAMPUS BLOCK"
        position={v(0, 2.05, 0.45)}
        color={accent}
      />
    </group>
  );
}

function HospitalModel({ accent }: { accent: string }) {
  return (
    <group rotation={v(0, -0.28, 0)}>
      <BaseSite />

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

      <Block
        position={v(0, 2.5, -0.38)}
        scale={v(4.6, 0.18, 2.45)}
        color="#07111f"
      />

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

      <Vehicle position={v(2.7, 0.16, 1.85)} color="#ffffff" />

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

      <Tree position={v(-3.75, 0, 1.8)} />
      <Tree position={v(3.75, 0, -2.15)} />

      <LightPost position={v(-2.5, 0, 2.9)} />
      <LightPost position={v(0, 0, 2.95)} />
      <LightPost position={v(2.5, 0, 2.9)} />

      <FloatingLabel
        text="HOSPITAL"
        position={v(0, 2.9, 0.45)}
        color="#ef4444"
      />
    </group>
  );
}

function MallModel({ accent }: { accent: string }) {
  return (
    <group rotation={v(0, -0.35, 0)}>
      <BaseSite />

      <Block
        position={v(0, 0.95, -0.45)}
        scale={v(5.5, 1.9, 2.35)}
        color="#e2e8f0"
      />

      <Block
        position={v(0, 2.0, -0.45)}
        scale={v(5.85, 0.18, 2.65)}
        color="#07111f"
      />

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

      <Vehicle position={v(-2.6, 0.16, 2.45)} color="#f97316" />
      <Vehicle position={v(0, 0.16, 2.45)} color="#22c55e" />
      <Vehicle position={v(2.6, 0.16, 2.45)} color="#3b82f6" />

      <Tree position={v(-3.75, 0, 2.15)} />
      <Tree position={v(3.75, 0, 2.15)} />
      <Tree position={v(-3.75, 0, -2.2)} />
      <Tree position={v(3.75, 0, -2.2)} />

      <LightPost position={v(-2.7, 0, 2.95)} />
      <LightPost position={v(0, 0, 2.95)} />
      <LightPost position={v(2.7, 0, 2.95)} />

      <FloatingLabel
        text="SHOPPING MALL"
        position={v(0, 2.4, 0.6)}
        color={accent}
      />
    </group>
  );
}

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

      <Vehicle position={v(2.55, 0.16, 1.45)} color="#f97316" />

      <LightPost position={v(-2.8, 0, 2.75)} />
      <LightPost position={v(0, 0, 2.85)} />
      <LightPost position={v(2.8, 0, 2.75)} />

      <FloatingLabel
        text="CONSTRUCTION SITE"
        position={v(0, 2.7, 0.4)}
        color={accent}
      />
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
  if (modelType === "hospital") {
    return <HospitalModel accent={accent} />;
  }

  if (modelType === "campus") {
    return <CampusModel accent={accent} />;
  }

  if (modelType === "mall") {
    return <MallModel accent={accent} />;
  }

  if (modelType === "construction") {
    return <ConstructionModel accent={accent} />;
  }

  if (modelType === "commercial") {
    return <CommercialModel accent={accent} />;
  }

  if (modelType === "apartment") {
    return <ApartmentModel accent={accent} />;
  }

  return <VillaModel accent={accent} />;
}

export default function ThreeBuildingViewer({
  projectName,
  projectStage,
}: ThreeBuildingViewerProps) {
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

        <ambientLight intensity={0.55} />

        <directionalLight
          position={[5, 8, 6]}
          intensity={1.9}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <pointLight
          position={[-3, 3.2, 4]}
          intensity={0.55}
          color="#38bdf8"
        />

        <pointLight
          position={[4, 2.8, -3]}
          intensity={0.45}
          color="#a78bfa"
        />

        <Sparkles
          count={28}
          scale={[8, 4, 6]}
          size={1.1}
          speed={0.25}
          opacity={0.2}
        />

        <ProjectBasedModel modelType={modelType} accent={accent} />

        <ContactShadows
          position={[0, -0.02, 0]}
          opacity={0.62}
          scale={9}
          blur={2.8}
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