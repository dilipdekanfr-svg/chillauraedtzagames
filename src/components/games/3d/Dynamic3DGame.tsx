import { useState, useEffect, useRef, forwardRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import * as THREE from "three";

interface Dynamic3DGameProps {
  gameId: number;
  category: string;
  emoji: string;
  name: string;
  themeColor: string;
}

// Game types: 0 = Space Shooter, 1 = Space Racing, 2 = Ground Shooter (Fortnite), 3 = Track Racing (Assetto Corsa)
const getGameType = (gameId: number) => gameId % 4;

// Get game theme based on type
const getGameTheme = (gameType: number) => {
  switch (gameType) {
    case 0: return { name: "🚀 SPACE SHOOTER", environment: "space" };
    case 1: return { name: "🛸 SPACE RACING", environment: "space" };
    case 2: return { name: "🎯 BATTLE ROYALE", environment: "ground" };
    case 3: return { name: "🏎️ TRACK RACING", environment: "track" };
    default: return { name: "🎮 ARCADE", environment: "space" };
  }
};

// Generate unique color palette for each game
const generateGamePalette = (gameId: number) => {
  const hue1 = (gameId * 37) % 360;
  const hue2 = (hue1 + 60 + (gameId % 60)) % 360;
  const hue3 = (hue1 + 180 + (gameId % 40)) % 360;
  
  return {
    primary: `hsl(${hue1}, 80%, 60%)`,
    secondary: `hsl(${hue2}, 70%, 50%)`,
    accent: `hsl(${hue3}, 90%, 65%)`,
    bg1: `hsl(${hue1}, 40%, 15%)`,
    bg2: `hsl(${hue2}, 30%, 10%)`
  };
};

// ==================== SHOOTING GAME COMPONENTS ====================

interface Enemy {
  id: number;
  x: number;
  y: number;
  z: number;
  type: number;
  speed: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  z: number;
}

const EnemyShip = ({ enemy, palette, onHit }: { enemy: Enemy; palette: ReturnType<typeof generateGamePalette>; onHit: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shapes = ['box', 'sphere', 'pyramid', 'diamond'];
  const shape = shapes[enemy.type % shapes.length];
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const colors = [palette.primary, palette.secondary, palette.accent];
  const color = colors[enemy.type % colors.length];

  return (
    <mesh ref={meshRef} position={[enemy.x, enemy.y, enemy.z]} onClick={onHit}>
      {shape === 'sphere' && <sphereGeometry args={[0.5, 16, 16]} />}
      {shape === 'pyramid' && <coneGeometry args={[0.5, 0.8, 4]} />}
      {shape === 'diamond' && <octahedronGeometry args={[0.5]} />}
      {shape === 'box' && <boxGeometry args={[0.6, 0.6, 0.6]} />}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </mesh>
  );
};

const PlayerShip = ({ position, palette }: { position: { x: number; y: number }; palette: ReturnType<typeof generateGamePalette> }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={[position.x, position.y, 3]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.3, 0.8, 6]} />
        <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[-0.35, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.4]} />
        <meshStandardMaterial color={palette.secondary} emissive={palette.secondary} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.35, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.4]} />
        <meshStandardMaterial color={palette.secondary} emissive={palette.secondary} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

const BulletMesh = ({ bullet, palette }: { bullet: Bullet; palette: ReturnType<typeof generateGamePalette> }) => {
  return (
    <mesh position={[bullet.x, bullet.y, bullet.z]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={1} />
    </mesh>
  );
};

// ==================== GROUND SHOOTER COMPONENTS (Fortnite-style) ====================

const GroundTerrain = ({ palette }: { palette: ReturnType<typeof generateGamePalette> }) => {
  return (
    <group>
      {/* Ground plane */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
      {/* Buildings/cover */}
      {[[-5, 0], [5, -8], [-3, -15], [6, -20], [-6, -25]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[2 + Math.random(), 2 + Math.random() * 2, 2 + Math.random()]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#555" : "#666"} />
          </mesh>
        </group>
      ))}
      {/* Trees */}
      {[[-8, -5], [8, -12], [-7, -20], [7, -28]].map(([x, z], i) => (
        <group key={`tree-${i}`} position={[x, 0, z]}>
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 2]} />
            <meshStandardMaterial color="#5c4033" />
          </mesh>
          <mesh position={[0, 2.5, 0]}>
            <coneGeometry args={[1.2, 2, 8]} />
            <meshStandardMaterial color="#228b22" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const GroundEnemy = ({ enemy, palette, onHit }: { enemy: Enemy; palette: ReturnType<typeof generateGamePalette>; onHit: () => void }) => {
  const meshRef = useRef<THREE.Group>(null);
  const colors = ["#e74c3c", "#9b59b6", "#e67e22", "#1abc9c"];
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2 + enemy.id) * 0.3;
    }
  });

  return (
    <group ref={meshRef} position={[enemy.x, -1, enemy.z]} onClick={onHit}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
        <meshStandardMaterial color={colors[enemy.type % colors.length]} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#ffd93d" />
      </mesh>
    </group>
  );
};

const PlayerCharacter = ({ position, palette }: { position: { x: number; y: number }; palette: ReturnType<typeof generateGamePalette> }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={[position.x, -1, 3]}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
        <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.3} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#ffeaa7" />
      </mesh>
      {/* Gun */}
      <mesh position={[0.4, 0.5, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.5]} />
        <meshStandardMaterial color="#333" metalness={0.8} />
      </mesh>
    </group>
  );
};

// ==================== TRACK RACING COMPONENTS (Assetto Corsa-style) ====================

const AsphaltTrack = ({ palette, trackLength }: { palette: ReturnType<typeof generateGamePalette>; trackLength: number }) => {
  return (
    <group>
      {/* Asphalt track */}
      <mesh position={[0, -1, -trackLength/2]}>
        <boxGeometry args={[10, 0.1, trackLength]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      {/* Racing stripes */}
      {[-3, 0, 3].map((x, i) => (
        <group key={i}>
          {Array.from({ length: Math.floor(trackLength / 3) }).map((_, j) => (
            <mesh key={j} position={[x, -0.94, -j * 3 - 1.5]}>
              <boxGeometry args={[0.15, 0.02, 2]} />
              <meshStandardMaterial color="white" />
            </mesh>
          ))}
        </group>
      ))}
      {/* Red/white curbs */}
      {[-5, 5].map((x, i) => (
        <group key={`curb-${i}`}>
          {Array.from({ length: Math.floor(trackLength / 2) }).map((_, j) => (
            <mesh key={j} position={[x, -0.9, -j * 2 - 1]}>
              <boxGeometry args={[0.5, 0.1, 1]} />
              <meshStandardMaterial color={j % 2 === 0 ? "#ff0000" : "white"} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Grass */}
      <mesh position={[-8, -1.05, -trackLength/2]}>
        <boxGeometry args={[6, 0.1, trackLength]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
      <mesh position={[8, -1.05, -trackLength/2]}>
        <boxGeometry args={[6, 0.1, trackLength]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
      {/* Tire barriers */}
      {[-6, 6].map((x, i) => (
        <group key={`barrier-${i}`}>
          {Array.from({ length: 20 }).map((_, j) => (
            <mesh key={j} position={[x, -0.6, -j * 10 - 5]}>
              <torusGeometry args={[0.3, 0.15, 8, 16]} />
              <meshStandardMaterial color="#111" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

const RaceCar = ({ position, color, isPlayer, carType }: { position: [number, number, number]; color: string; isPlayer?: boolean; carType?: number }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current && isPlayer) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 5) * 0.015;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Low sleek body */}
      <mesh>
        <boxGeometry args={[0.7, 0.15, 1.5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isPlayer ? 0.4 : 0.1} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.4, 0.12, 0.4]} />
        <meshStandardMaterial color="#111" transparent opacity={0.7} />
      </mesh>
      {/* Front wing */}
      <mesh position={[0, -0.05, 0.8]}>
        <boxGeometry args={[0.9, 0.03, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Rear wing */}
      <mesh position={[0, 0.2, -0.7]}>
        <boxGeometry args={[0.7, 0.15, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Wheels */}
      {[[-0.4, -0.08, 0.45], [0.4, -0.08, 0.45], [-0.4, -0.08, -0.45], [0.4, -0.08, -0.45]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
    </group>
  );
};

// ==================== SPACE RACING COMPONENTS ====================

const RaceTrack = ({ palette, trackLength }: { palette: ReturnType<typeof generateGamePalette>; trackLength: number }) => {
  return (
    <group>
      {/* Main track */}
      <mesh position={[0, -1, -trackLength/2]}>
        <boxGeometry args={[8, 0.1, trackLength]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Lane dividers */}
      {[-2, 0, 2].map((x, i) => (
        <group key={i}>
          {Array.from({ length: Math.floor(trackLength / 4) }).map((_, j) => (
            <mesh key={j} position={[x, -0.9, -j * 4 - 2]}>
              <boxGeometry args={[0.1, 0.15, 1.5]} />
              <meshStandardMaterial color="white" />
            </mesh>
          ))}
        </group>
      ))}
      {/* Track borders */}
      <mesh position={[-4, -0.7, -trackLength/2]}>
        <boxGeometry args={[0.3, 0.5, trackLength]} />
        <meshStandardMaterial color={palette.primary} emissive={palette.primary} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[4, -0.7, -trackLength/2]}>
        <boxGeometry args={[0.3, 0.5, trackLength]} />
        <meshStandardMaterial color={palette.secondary} emissive={palette.secondary} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

const CarModel = ({ position, color, isPlayer }: { position: [number, number, number]; color: string; isPlayer?: boolean }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current && isPlayer) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 5) * 0.02;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Car body */}
      <mesh>
        <boxGeometry args={[0.6, 0.25, 1.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isPlayer ? 0.5 : 0.2} metalness={0.7} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.2, -0.1]}>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
        <meshStandardMaterial color="#111" transparent opacity={0.8} />
      </mesh>
      {/* Wheels */}
      {[[-0.35, -0.15, 0.35], [0.35, -0.15, 0.35], [-0.35, -0.15, -0.35], [0.35, -0.15, -0.35]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      ))}
    </group>
  );
};

const RaceObstacle = ({ position, type, palette }: { position: [number, number, number]; type: number; palette: ReturnType<typeof generateGamePalette> }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const colors = [palette.primary, palette.secondary, "#ff4444"];
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      {type % 3 === 0 && <boxGeometry args={[0.8, 0.8, 0.8]} />}
      {type % 3 === 1 && <coneGeometry args={[0.4, 0.8, 8]} />}
      {type % 3 === 2 && <cylinderGeometry args={[0.3, 0.3, 0.6, 8]} />}
      <meshStandardMaterial color={colors[type % 3]} />
    </mesh>
  );
};

const PowerUp = ({ position, palette, onCollect }: { position: [number, number, number]; palette: ReturnType<typeof generateGamePalette>; onCollect: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.05;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <Float speed={2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} onClick={onCollect}>
        <torusGeometry args={[0.3, 0.1, 16, 32]} />
        <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.8} />
      </mesh>
    </Float>
  );
};

// ==================== GAME SCENES ====================

const ShootingGameScene = ({
  gameId,
  palette,
  isPlaying,
  playerPos,
  enemies,
  bullets,
  onEnemyHit
}: {
  gameId: number;
  palette: ReturnType<typeof generateGamePalette>;
  isPlaying: boolean;
  playerPos: { x: number; y: number };
  enemies: Enemy[];
  bullets: Bullet[];
  onEnemyHit: (id: number) => void;
}) => {
  const bgType = gameId % 5;
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color={palette.primary} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={palette.secondary} />
      
      {/* Dynamic backgrounds */}
      {bgType === 0 && <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={2} />}
      {bgType === 1 && <Stars radius={80} depth={40} count={2000} factor={6} saturation={1} fade speed={1} />}
      {bgType === 2 && <Stars radius={100} depth={50} count={1500} factor={3} saturation={0.5} fade speed={3} />}
      {bgType === 3 && <Stars radius={70} depth={35} count={2500} factor={5} saturation={0.9} fade speed={1.2} />}
      {bgType === 4 && <Stars radius={100} depth={50} count={2500} factor={5} saturation={0.8} fade speed={1.5} />}
      
      {/* Player ship */}
      {isPlaying && <PlayerShip position={playerPos} palette={palette} />}
      
      {/* Enemies */}
      {isPlaying && enemies.map(enemy => (
        <EnemyShip key={enemy.id} enemy={enemy} palette={palette} onHit={() => onEnemyHit(enemy.id)} />
      ))}
      
      {/* Bullets */}
      {isPlaying && bullets.map(bullet => (
        <BulletMesh key={bullet.id} bullet={bullet} palette={palette} />
      ))}
      
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
};

const RacingGameScene = ({
  gameId,
  palette,
  isPlaying,
  playerLane,
  playerZ,
  obstacles,
  powerUps,
  onPowerUpCollect,
  speed
}: {
  gameId: number;
  palette: ReturnType<typeof generateGamePalette>;
  isPlaying: boolean;
  playerLane: number;
  playerZ: number;
  obstacles: Array<{ id: number; x: number; z: number; type: number }>;
  powerUps: Array<{ id: number; x: number; z: number; type: number }>;
  onPowerUpCollect: (id: number) => void;
  speed: number;
}) => {
  const lanePositions = [-2.5, 0, 2.5];
  const trackVariant = gameId % 4;
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color={palette.accent} />
      
      {/* Sky/Background based on variant */}
      {trackVariant === 0 && <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />}
      {trackVariant === 1 && (
        <mesh>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial color="#1a0a2e" side={THREE.BackSide} />
        </mesh>
      )}
      {trackVariant === 2 && (
        <mesh>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial color="#0a1a1a" side={THREE.BackSide} />
        </mesh>
      )}
      {trackVariant === 3 && (
        <>
          <Stars radius={80} depth={40} count={3000} factor={3} saturation={1} fade speed={2} />
          <mesh>
            <sphereGeometry args={[100, 32, 32]} />
            <meshBasicMaterial color={palette.bg1} side={THREE.BackSide} />
          </mesh>
        </>
      )}
      
      {/* Track */}
      <RaceTrack palette={palette} trackLength={200} />
      
      {/* Player car */}
      {isPlaying && (
        <CarModel 
          position={[lanePositions[playerLane], -0.7, 2]} 
          color={palette.accent} 
          isPlayer 
        />
      )}
      
      {/* Obstacles */}
      {isPlaying && obstacles.map(obs => (
        <RaceObstacle 
          key={obs.id} 
          position={[obs.x, -0.5, obs.z - playerZ]} 
          type={obs.type} 
          palette={palette} 
        />
      ))}
      
      {/* Power-ups */}
      {isPlaying && powerUps.map(pu => (
        <PowerUp 
          key={pu.id} 
          position={[pu.x, 0, pu.z - playerZ]} 
          palette={palette}
          onCollect={() => onPowerUpCollect(pu.id)}
        />
      ))}
      
      {/* Speed lines effect */}
      {isPlaying && speed > 1.5 && (
        <group>
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh key={i} position={[(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4, -5 - i * 3]}>
              <boxGeometry args={[0.02, 0.02, 2]} />
              <meshBasicMaterial color="white" transparent opacity={0.5} />
            </mesh>
          ))}
        </group>
      )}
      
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
};

// Ground Shooter Scene (Fortnite-style)
const GroundShooterScene = ({
  gameId,
  palette,
  isPlaying,
  playerPos,
  enemies,
  bullets,
  onEnemyHit
}: {
  gameId: number;
  palette: ReturnType<typeof generateGamePalette>;
  isPlaying: boolean;
  playerPos: { x: number; y: number };
  enemies: Enemy[];
  bullets: Bullet[];
  onEnemyHit: (id: number) => void;
}) => {
  const timeOfDay = gameId % 3; // 0 = day, 1 = sunset, 2 = night
  const skyColors = ["#87ceeb", "#ff7f50", "#1a1a3a"];
  
  return (
    <>
      <ambientLight intensity={timeOfDay === 2 ? 0.2 : 0.5} />
      <directionalLight position={[10, 20, 10]} intensity={timeOfDay === 2 ? 0.3 : 1} color={timeOfDay === 1 ? "#ff8844" : "white"} />
      <pointLight position={[0, 5, 0]} intensity={0.3} color={palette.accent} />
      
      {/* Sky */}
      <mesh>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial color={skyColors[timeOfDay]} side={THREE.BackSide} />
      </mesh>
      
      {/* Sun/Moon */}
      <mesh position={[30, 25, -50]}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshBasicMaterial color={timeOfDay === 2 ? "#fff8dc" : "#ffff00"} />
      </mesh>
      
      {/* Ground terrain */}
      <GroundTerrain palette={palette} />
      
      {/* Player character */}
      {isPlaying && <PlayerCharacter position={playerPos} palette={palette} />}
      
      {/* Enemies */}
      {isPlaying && enemies.map(enemy => (
        <GroundEnemy key={enemy.id} enemy={enemy} palette={palette} onHit={() => onEnemyHit(enemy.id)} />
      ))}
      
      {/* Bullets */}
      {isPlaying && bullets.map(bullet => (
        <mesh key={bullet.id} position={[bullet.x, -0.5, bullet.z]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={1} />
        </mesh>
      ))}
      
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
};

// Track Racing Scene (Assetto Corsa-style)
const TrackRacingScene = ({
  gameId,
  palette,
  isPlaying,
  playerLane,
  playerZ,
  obstacles,
  powerUps,
  onPowerUpCollect,
  speed
}: {
  gameId: number;
  palette: ReturnType<typeof generateGamePalette>;
  isPlaying: boolean;
  playerLane: number;
  playerZ: number;
  obstacles: Array<{ id: number; x: number; z: number; type: number }>;
  powerUps: Array<{ id: number; x: number; z: number; type: number }>;
  onPowerUpCollect: (id: number) => void;
  speed: number;
}) => {
  const lanePositions = [-3, 0, 3];
  const weather = gameId % 4; // 0 = clear, 1 = cloudy, 2 = sunset, 3 = night
  const skyColors = ["#4a90d9", "#8899aa", "#ff6b35", "#0a0a1a"];
  
  return (
    <>
      <ambientLight intensity={weather === 3 ? 0.2 : 0.5} />
      <directionalLight position={[5, 15, 5]} intensity={weather === 3 ? 0.3 : 1} color={weather === 2 ? "#ff8844" : "white"} />
      <pointLight position={[0, 3, 5]} intensity={0.4} color={palette.accent} />
      
      {/* Sky */}
      <mesh>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial color={skyColors[weather]} side={THREE.BackSide} />
      </mesh>
      
      {/* Track */}
      <AsphaltTrack palette={palette} trackLength={200} />
      
      {/* Player race car */}
      {isPlaying && (
        <RaceCar 
          position={[lanePositions[playerLane], -0.85, 2]} 
          color={palette.accent} 
          isPlayer 
          carType={gameId % 5}
        />
      )}
      
      {/* Other cars as obstacles */}
      {isPlaying && obstacles.map(obs => (
        <RaceCar 
          key={obs.id} 
          position={[obs.x, -0.85, obs.z - playerZ]} 
          color={["#e74c3c", "#3498db", "#f39c12", "#9b59b6", "#1abc9c"][obs.type % 5]}
          carType={obs.type}
        />
      ))}
      
      {/* Power-ups (boost pads) */}
      {isPlaying && powerUps.map(pu => (
        <group key={pu.id} position={[pu.x, -0.9, pu.z - playerZ]} onClick={() => onPowerUpCollect(pu.id)}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.5, 2]} />
            <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.8} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
      
      {/* Speed effect */}
      {isPlaying && speed > 1.5 && (
        <group>
          {Array.from({ length: 15 }).map((_, i) => (
            <mesh key={i} position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 2 - 0.5, -3 - i * 2]}>
              <boxGeometry args={[0.015, 0.015, 1.5 + speed]} />
              <meshBasicMaterial color="white" transparent opacity={0.4} />
            </mesh>
          ))}
        </group>
      )}
      
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
};

// ==================== MAIN COMPONENT ====================

const Dynamic3DGame = forwardRef<HTMLDivElement, Dynamic3DGameProps>(({ gameId, category, emoji, name, themeColor }, ref) => {
  const gameType = getGameType(gameId);
  const palette = generateGamePalette(gameId);
  const variant = Math.floor(gameId / 2) % 20;
  const baseSpeed = 1 + (gameId % 10) * 0.1;
  const baseDifficulty = 1 + (gameId % 5) * 0.2;
  const timeLimit = 30 + (gameId % 30);

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameOver, setGameOver] = useState(false);

  // Shooting game state
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);

  // Racing game state
  const [playerLane, setPlayerLane] = useState(1);
  const [playerZ, setPlayerZ] = useState(0);
  const [speed, setSpeed] = useState(baseSpeed);
  const [obstacles, setObstacles] = useState<Array<{ id: number; x: number; z: number; type: number }>>([]);
  const [powerUps, setPowerUps] = useState<Array<{ id: number; x: number; z: number; type: number }>>([]);

  const lanePositions = gameType === 3 ? [-3, 0, 3] : [-2.5, 0, 2.5];

  // Timer
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameOver(true);
          setIsPlaying(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, gameOver]);

  // Keyboard controls
  useEffect(() => {
    if (!isPlaying) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameType === 0 || gameType === 2) {
        // Shooting controls (space or ground)
        const moveSpeed = 0.3;
        switch (e.key) {
          case 'ArrowLeft':
          case 'a':
            setPlayerPos(p => ({ ...p, x: Math.max(-4, p.x - moveSpeed) }));
            break;
          case 'ArrowRight':
          case 'd':
            setPlayerPos(p => ({ ...p, x: Math.min(4, p.x + moveSpeed) }));
            break;
          case 'ArrowUp':
          case 'w':
            setPlayerPos(p => ({ ...p, y: Math.min(3, p.y + moveSpeed) }));
            break;
          case 'ArrowDown':
          case 's':
            setPlayerPos(p => ({ ...p, y: Math.max(-3, p.y - moveSpeed) }));
            break;
          case ' ':
            e.preventDefault();
            // Fire bullet
            setBullets(prev => [...prev, {
              id: Date.now(),
              x: playerPos.x,
              y: playerPos.y,
              z: gameType === 2 ? 2 : 2
            }]);
            break;
        }
      } else {
        // Racing controls (space or track)
        switch (e.key) {
          case 'ArrowLeft':
          case 'a':
            setPlayerLane(l => Math.max(0, l - 1));
            break;
          case 'ArrowRight':
          case 'd':
            setPlayerLane(l => Math.min(2, l + 1));
            break;
          case 'ArrowUp':
          case 'w':
            setSpeed(s => Math.min(3, s + 0.1));
            break;
          case 'ArrowDown':
          case 's':
            setSpeed(s => Math.max(0.5, s - 0.1));
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameType, playerPos]);

  // Shooting game: spawn enemies
  useEffect(() => {
    if (!isPlaying || gameOver || (gameType !== 0 && gameType !== 2)) return;
    const spawnInterval = setInterval(() => {
      if (enemies.length < 5 + variant) {
        setEnemies(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 5,
          z: -20 - Math.random() * 10,
          type: Math.floor(Math.random() * 4),
          speed: baseSpeed + Math.random() * baseDifficulty
        }]);
      }
    }, 2000 / baseDifficulty);
    return () => clearInterval(spawnInterval);
  }, [isPlaying, gameOver, gameType, enemies.length, variant, baseSpeed, baseDifficulty]);

  // Shooting game: update bullets and check collisions
  useEffect(() => {
    if (!isPlaying || gameOver || (gameType !== 0 && gameType !== 2)) return;
    const updateInterval = setInterval(() => {
      // Move bullets
      setBullets(prev => prev.map(b => ({ ...b, z: b.z - 0.5 })).filter(b => b.z > -30));
      
      // Check bullet-enemy collisions
      setBullets(prevBullets => {
        const remainingBullets = [...prevBullets];
        setEnemies(prevEnemies => {
          return prevEnemies.filter(enemy => {
            const hit = remainingBullets.some((bullet, idx) => {
              const dist = Math.sqrt(
                Math.pow(bullet.x - enemy.x, 2) +
                Math.pow(bullet.y - enemy.y, 2) +
                Math.pow(bullet.z - enemy.z, 2)
              );
              if (dist < 1.2) {
                remainingBullets.splice(idx, 1);
                setScore(s => s + 10);
                return true;
              }
              return false;
            });
            return !hit;
          });
        });
        return remainingBullets;
      });
      
      // Move enemies forward
      setEnemies(prev => {
        const updated = prev.map(e => ({ ...e, z: e.z + e.speed * 0.05 }));
        updated.forEach(e => {
          if (e.z > 3) {
            setGameOver(true);
            setIsPlaying(false);
          }
        });
        return updated.filter(e => e.z < 5);
      });
    }, 50);
    return () => clearInterval(updateInterval);
  }, [isPlaying, gameOver, gameType]);

  // Racing game: move forward and spawn obstacles
  useEffect(() => {
    if (!isPlaying || gameOver || (gameType !== 1 && gameType !== 3)) return;
    const moveInterval = setInterval(() => {
      setPlayerZ(z => z + speed * 0.5);
      setScore(s => s + Math.floor(speed));
      
      // Spawn obstacles
      if (Math.random() < 0.05 * baseDifficulty) {
        const lane = Math.floor(Math.random() * 3);
        setObstacles(prev => [...prev.slice(-10), {
          id: Date.now(),
          x: lanePositions[lane],
          z: playerZ + 50 + Math.random() * 20,
          type: Math.floor(Math.random() * 3)
        }]);
      }
      
      // Spawn power-ups
      if (Math.random() < 0.02) {
        const lane = Math.floor(Math.random() * 3);
        setPowerUps(prev => [...prev.slice(-5), {
          id: Date.now(),
          x: lanePositions[lane],
          z: playerZ + 60 + Math.random() * 20,
          type: Math.floor(Math.random() * 2)
        }]);
      }
      
      // Check collisions with obstacles
      obstacles.forEach(obs => {
        const relZ = obs.z - playerZ;
        if (relZ > 0 && relZ < 3 && Math.abs(obs.x - lanePositions[playerLane]) < 1) {
          setGameOver(true);
          setIsPlaying(false);
        }
      });
    }, 50);
    return () => clearInterval(moveInterval);
  }, [isPlaying, gameOver, gameType, speed, playerZ, playerLane, obstacles, baseDifficulty, lanePositions]);

  const handleEnemyHit = (id: number) => {
    setEnemies(prev => prev.filter(e => e.id !== id));
    setScore(s => s + 15);
  };

  const handlePowerUpCollect = (id: number) => {
    setPowerUps(prev => prev.filter(p => p.id !== id));
    setScore(s => s + 50);
    setSpeed(s => Math.min(3, s + 0.3));
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(timeLimit);
    setGameOver(false);
    setPlayerPos({ x: 0, y: 0 });
    setEnemies([]);
    setBullets([]);
    setPlayerLane(1);
    setPlayerZ(0);
    setSpeed(baseSpeed);
    setObstacles([]);
    setPowerUps([]);
  };

  const gameTheme = getGameTheme(gameType);
  const isShooter = gameType === 0 || gameType === 2;
  const instructions = isShooter
    ? "WASD to move, SPACE to shoot! Destroy enemies before they reach you!"
    : "A/D or ←/→ to change lanes, W/S to speed up/slow down! Avoid obstacles!";

  return (
    <div ref={ref} className="flex flex-col items-center p-4">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-primary">Score: {score}</span>
        <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">{gameTheme.name}</span>
        <span className="text-muted-foreground">⏱️ {timeLeft}s</span>
      </div>

      {(gameType === 1 || gameType === 3) && isPlaying && (
        <div className="w-full mb-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed:</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all" 
              style={{ width: `${(speed / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="w-full aspect-video bg-black/90 rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
        <Canvas camera={{ 
          position: isShooter 
            ? (gameType === 2 ? [0, 5, 10] : [0, 0, 8]) 
            : (gameType === 3 ? [0, 2.5, 7] : [0, 3, 8]), 
          fov: 60 
        }}>
          <Suspense fallback={null}>
            {gameType === 0 && (
              <ShootingGameScene
                gameId={gameId}
                palette={palette}
                isPlaying={isPlaying}
                playerPos={playerPos}
                enemies={enemies}
                bullets={bullets}
                onEnemyHit={handleEnemyHit}
              />
            )}
            {gameType === 1 && (
              <RacingGameScene
                gameId={gameId}
                palette={palette}
                isPlaying={isPlaying}
                playerLane={playerLane}
                playerZ={playerZ}
                obstacles={obstacles}
                powerUps={powerUps}
                onPowerUpCollect={handlePowerUpCollect}
                speed={speed}
              />
            )}
            {gameType === 2 && (
              <GroundShooterScene
                gameId={gameId}
                palette={palette}
                isPlaying={isPlaying}
                playerPos={playerPos}
                enemies={enemies}
                bullets={bullets}
                onEnemyHit={handleEnemyHit}
              />
            )}
            {gameType === 3 && (
              <TrackRacingScene
                gameId={gameId}
                palette={palette}
                isPlaying={isPlaying}
                playerLane={playerLane}
                playerZ={playerZ}
                obstacles={obstacles}
                powerUps={powerUps}
                onPowerUpCollect={handlePowerUpCollect}
                speed={speed}
              />
            )}
          </Suspense>
        </Canvas>
      </div>

      <p className="text-sm text-muted-foreground mt-4 text-center">{instructions}</p>
      
      <p className="text-xs text-muted-foreground mt-1">
        Variant: <span className="text-primary">{variant + 1}</span> | 
        Difficulty: <span className="text-primary">{baseDifficulty.toFixed(1)}x</span>
      </p>

      {!isPlaying && (
        <Button onClick={startGame} className="mt-4">
          {gameOver ? `🔄 Play Again (Score: ${score})` : '🎮 Start Game'}
        </Button>
      )}
    </div>
  );
});

Dynamic3DGame.displayName = 'Dynamic3DGame';

export default Dynamic3DGame;
