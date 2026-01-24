import { useState, useEffect, useCallback, useRef, forwardRef, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Float, MeshWobbleMaterial, MeshDistortMaterial } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import * as THREE from "three";

interface Dynamic3DGameProps {
  gameId: number;
  category: string;
  emoji: string;
  name: string;
  themeColor: string;
}

const game3DMechanics = [
  'orbCollector', 'cubeDodge', 'sphereShooter', 'mazeRunner', 'platformJump',
  'asteroidDestroyer', 'ringToss', 'ballBounce', 'cubeStack', 'colorMatch3D',
  'spaceFlight', 'tunnelRun', 'gemCollector', 'targetPractice', 'racingOrbs',
  'puzzleCubes', 'gravityBall', 'laserDodge', 'crystalHunt', 'vortexEscape',
  'pyramidClimb', 'starCatcher', 'waveRider', 'portalJump', 'neonChase',
  'cosmicPong', 'shapeSorter', 'lightTrail', 'orbitMaster', 'quantumLeap'
];

// Generate unique color palette for each game
const generateGamePalette = (gameId: number) => {
  const hue1 = (gameId * 37) % 360;
  const hue2 = (hue1 + 60 + (gameId % 60)) % 360;
  const hue3 = (hue1 + 180 + (gameId % 40)) % 360;
  const saturation = 70 + (gameId % 30);
  const lightness = 50 + (gameId % 20);
  
  return {
    primary: `hsl(${hue1}, ${saturation}%, ${lightness}%)`,
    secondary: `hsl(${hue2}, ${saturation}%, ${lightness}%)`,
    accent: `hsl(${hue3}, ${saturation}%, ${lightness}%)`,
    background: `hsl(${hue1}, 20%, 5%)`,
    glow: `hsl(${hue1}, 100%, 60%)`
  };
};

// Different shape types
const shapeTypes = ['sphere', 'box', 'octahedron', 'dodecahedron', 'icosahedron', 'torus', 'torusKnot', 'cone', 'cylinder', 'tetrahedron'];

// Collectible with unique shape based on game
const UniqueCollectible = ({ 
  position, 
  onClick, 
  color, 
  shapeType, 
  wobble,
  distort,
  floatSpeed,
  size
}: { 
  position: [number, number, number]; 
  onClick: () => void; 
  color: string; 
  shapeType: number;
  wobble: boolean;
  distort: boolean;
  floatSpeed: number;
  size: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 + floatSpeed * 0.01;
      meshRef.current.rotation.y += 0.02 + floatSpeed * 0.01;
    }
  });

  const renderGeometry = () => {
    const s = size;
    switch (shapeType % 10) {
      case 0: return <sphereGeometry args={[s * 0.3, 32, 32]} />;
      case 1: return <boxGeometry args={[s * 0.4, s * 0.4, s * 0.4]} />;
      case 2: return <octahedronGeometry args={[s * 0.35]} />;
      case 3: return <dodecahedronGeometry args={[s * 0.3]} />;
      case 4: return <icosahedronGeometry args={[s * 0.3]} />;
      case 5: return <torusGeometry args={[s * 0.25, s * 0.1, 16, 32]} />;
      case 6: return <torusKnotGeometry args={[s * 0.2, s * 0.06, 64, 8]} />;
      case 7: return <coneGeometry args={[s * 0.25, s * 0.5, 16]} />;
      case 8: return <cylinderGeometry args={[s * 0.2, s * 0.2, s * 0.4, 16]} />;
      case 9: return <tetrahedronGeometry args={[s * 0.35]} />;
      default: return <sphereGeometry args={[s * 0.3, 32, 32]} />;
    }
  };

  const renderMaterial = () => {
    if (distort) {
      return <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.5} distort={0.4} speed={2} />;
    }
    if (wobble) {
      return <MeshWobbleMaterial color={color} emissive={color} emissiveIntensity={0.5} factor={0.6} speed={2} />;
    }
    return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.3} roughness={0.4} />;
  };

  return (
    <Float speed={floatSpeed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} onClick={onClick}>
        {renderGeometry()}
        {renderMaterial()}
      </mesh>
    </Float>
  );
};

// Unique obstacle based on game variant
const UniqueObstacle = ({ 
  position, 
  color, 
  speed, 
  pattern,
  shapeType,
  size
}: { 
  position: [number, number, number]; 
  color: string; 
  speed: number;
  pattern: number;
  shapeType: number;
  size: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPos = useRef(position);
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed;
      
      // Different movement patterns
      switch (pattern % 6) {
        case 0: // Sine wave horizontal
          meshRef.current.position.x = initialPos.current[0] + Math.sin(t) * 3;
          break;
        case 1: // Circular
          meshRef.current.position.x = initialPos.current[0] + Math.cos(t) * 2;
          meshRef.current.position.y = initialPos.current[1] + Math.sin(t) * 2;
          break;
        case 2: // Figure 8
          meshRef.current.position.x = initialPos.current[0] + Math.sin(t) * 2;
          meshRef.current.position.y = initialPos.current[1] + Math.sin(t * 2) * 1.5;
          break;
        case 3: // Bounce
          meshRef.current.position.y = initialPos.current[1] + Math.abs(Math.sin(t)) * 2;
          break;
        case 4: // Spiral in
          const r = 2 + Math.sin(t * 0.5);
          meshRef.current.position.x = initialPos.current[0] + Math.cos(t) * r;
          meshRef.current.position.z = initialPos.current[2] + Math.sin(t) * r;
          break;
        case 5: // Random jitter
          meshRef.current.position.x = initialPos.current[0] + Math.sin(t * 3) * 0.5;
          meshRef.current.position.y = initialPos.current[1] + Math.cos(t * 4) * 0.5;
          break;
      }
      
      meshRef.current.rotation.x += 0.02;
      meshRef.current.rotation.z += 0.01;
    }
  });

  const renderGeometry = () => {
    switch (shapeType % 5) {
      case 0: return <boxGeometry args={[size, size, size]} />;
      case 1: return <octahedronGeometry args={[size * 0.7]} />;
      case 2: return <tetrahedronGeometry args={[size * 0.8]} />;
      case 3: return <torusGeometry args={[size * 0.5, size * 0.2, 8, 16]} />;
      case 4: return <icosahedronGeometry args={[size * 0.6]} />;
      default: return <boxGeometry args={[size, size, size]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position}>
      {renderGeometry()}
      <meshStandardMaterial color={color} wireframe opacity={0.8} transparent />
    </mesh>
  );
};

// Player with unique appearance
const UniquePlayer = ({ 
  position, 
  color, 
  playerShape,
  size,
  trail
}: { 
  position: [number, number, number]; 
  color: string;
  playerShape: number;
  size: number;
  trail: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  const renderGeometry = () => {
    switch (playerShape % 6) {
      case 0: return <sphereGeometry args={[size, 32, 32]} />;
      case 1: return <dodecahedronGeometry args={[size]} />;
      case 2: return <icosahedronGeometry args={[size]} />;
      case 3: return <octahedronGeometry args={[size]} />;
      case 4: return <torusKnotGeometry args={[size * 0.6, size * 0.2, 64, 8]} />;
      case 5: return <coneGeometry args={[size * 0.8, size * 1.5, 6]} />;
      default: return <sphereGeometry args={[size, 32, 32]} />;
    }
  };

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        {renderGeometry()}
        <MeshDistortMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.4} 
          metalness={0.9} 
          roughness={0.1}
          distort={0.2}
          speed={3}
        />
      </mesh>
      {trail && (
        <mesh position={[position[0], position[1], position[2] + 0.5]} scale={[0.3, 0.3, 1]}>
          <coneGeometry args={[0.5, 1.5, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
};

// Unique ring/portal
const UniqueRing = ({ 
  position, 
  color, 
  speed, 
  ringType,
  size
}: { 
  position: [number, number, number]; 
  color: string; 
  speed: number;
  ringType: number;
  size: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.02 * speed;
      meshRef.current.rotation.z += 0.005 * speed;
    }
  });

  const renderRing = () => {
    switch (ringType % 4) {
      case 0:
        return <torusGeometry args={[size, size * 0.05, 16, 64]} />;
      case 1:
        return <torusGeometry args={[size, size * 0.15, 8, 32]} />;
      case 2:
        return <torusKnotGeometry args={[size * 0.7, size * 0.1, 64, 8, 2, 3]} />;
      case 3:
        return <torusKnotGeometry args={[size * 0.6, size * 0.08, 64, 8, 3, 5]} />;
      default:
        return <torusGeometry args={[size, size * 0.05, 16, 64]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position}>
      {renderRing()}
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.4} 
        transparent 
        opacity={0.7}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

// Unique platform
const UniquePlatform = ({ 
  position, 
  color,
  platformType,
  size
}: { 
  position: [number, number, number]; 
  color: string;
  platformType: number;
  size: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.15;
    }
  });

  const renderPlatform = () => {
    switch (platformType % 5) {
      case 0: return <cylinderGeometry args={[size, size, 0.2, 32]} />;
      case 1: return <boxGeometry args={[size * 1.5, 0.2, size * 1.5]} />;
      case 2: return <cylinderGeometry args={[size, size * 0.7, 0.3, 6]} />; // Hexagon
      case 3: return <cylinderGeometry args={[size * 0.8, size * 1.2, 0.25, 32]} />; // Tapered
      case 4: return <torusGeometry args={[size * 0.6, size * 0.3, 8, 24]} />;
      default: return <cylinderGeometry args={[size, size, 0.2, 32]} />;
    }
  };

  return (
    <Float speed={1} floatIntensity={0.2}>
      <mesh ref={meshRef} position={position}>
        {renderPlatform()}
        <meshStandardMaterial 
          color={color} 
          metalness={0.6} 
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
};

// Unique background effect
const UniqueBackground = ({ gameId, palette }: { gameId: number; palette: ReturnType<typeof generateGamePalette> }) => {
  const bgType = gameId % 8;
  
  switch (bgType) {
    case 0:
      return <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />;
    case 1:
      return <Stars radius={50} depth={30} count={5000} factor={2} saturation={1} fade speed={2} />;
    case 2:
      return (
        <>
          <Stars radius={80} depth={40} count={2000} factor={3} saturation={0.3} fade speed={0.5} />
          <fog attach="fog" args={[palette.background, 5, 30]} />
        </>
      );
    case 3:
      return <Stars radius={120} depth={60} count={1500} factor={6} saturation={0.8} fade speed={1.5} />;
    case 4:
      return (
        <>
          <Stars radius={60} depth={25} count={4000} factor={1.5} saturation={0.2} fade speed={3} />
        </>
      );
    case 5:
      return <Stars radius={200} depth={100} count={1000} factor={8} saturation={0.6} fade speed={0.3} />;
    case 6:
      return (
        <>
          <Stars radius={70} depth={35} count={2500} factor={5} saturation={0.9} fade speed={1.2} />
        </>
      );
    case 7:
      return <Stars radius={40} depth={20} count={6000} factor={1} saturation={0.4} fade speed={4} />;
    default:
      return <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />;
  }
};

// Game scene component
const GameScene = ({ 
  gameId,
  mechanic, 
  variant, 
  isPlaying, 
  playerPos,
  collectibles,
  onCollect,
  obstacles,
  palette
}: { 
  gameId: number;
  mechanic: string; 
  variant: number;
  isPlaying: boolean;
  playerPos: { x: number; y: number; z: number };
  collectibles: Array<{ id: number; x: number; y: number; z: number; collected: boolean }>;
  onCollect: (id: number) => void;
  obstacles: Array<{ id: number; x: number; y: number; z: number }>;
  palette: ReturnType<typeof generateGamePalette>;
}) => {
  const collectibleShape = (gameId * 7) % 10;
  const obstacleShape = (gameId * 11) % 5;
  const playerShape = (gameId * 13) % 6;
  const ringType = (gameId * 17) % 4;
  const platformType = (gameId * 19) % 5;
  const useWobble = gameId % 3 === 0;
  const useDistort = gameId % 5 === 0;
  const floatSpeed = 1 + (gameId % 5) * 0.5;
  const collectibleSize = 0.8 + (gameId % 5) * 0.1;
  const playerSize = 0.35 + (gameId % 4) * 0.05;
  const hasTrail = gameId % 2 === 0;
  
  // Unique lighting based on game
  const lightIntensity = 0.3 + (gameId % 5) * 0.1;
  const pointLightPos1: [number, number, number] = [
    5 + (gameId % 10),
    5 + (gameId % 8),
    5 + (gameId % 6)
  ];
  const pointLightPos2: [number, number, number] = [
    -(5 + (gameId % 8)),
    -(3 + (gameId % 6)),
    -(5 + (gameId % 10))
  ];
  
  return (
    <>
      <ambientLight intensity={lightIntensity} />
      <pointLight position={pointLightPos1} intensity={1} color={palette.primary} />
      <pointLight position={pointLightPos2} intensity={0.6} color={palette.secondary} />
      <pointLight position={[0, 10, 0]} intensity={0.4} color={palette.accent} />
      
      <UniqueBackground gameId={gameId} palette={palette} />
      
      {/* Background rings - unique per game */}
      <UniqueRing 
        position={[0, 0, -5 - (gameId % 5)]} 
        color={palette.primary} 
        speed={1 + (gameId % 10) * 0.1} 
        ringType={ringType}
        size={1.5 + (gameId % 5) * 0.3}
      />
      <UniqueRing 
        position={[0, 0, -8 - (gameId % 4)]} 
        color={palette.secondary} 
        speed={0.8 + (gameId % 8) * 0.1}
        ringType={(ringType + 1) % 4}
        size={2 + (gameId % 4) * 0.4}
      />
      {gameId % 3 === 0 && (
        <UniqueRing 
          position={[0, 0, -12]} 
          color={palette.accent} 
          speed={0.5}
          ringType={(ringType + 2) % 4}
          size={2.5}
        />
      )}
      
      {/* Player */}
      {isPlaying && (
        <UniquePlayer 
          position={[playerPos.x, playerPos.y, playerPos.z]} 
          color={palette.glow}
          playerShape={playerShape}
          size={playerSize}
          trail={hasTrail}
        />
      )}
      
      {/* Collectibles */}
      {isPlaying && collectibles.filter(c => !c.collected).map((c, idx) => (
        <UniqueCollectible 
          key={c.id}
          position={[c.x, c.y, c.z]}
          onClick={() => onCollect(c.id)}
          color={idx % 2 === 0 ? palette.primary : palette.secondary}
          shapeType={(collectibleShape + idx) % 10}
          wobble={useWobble}
          distort={useDistort}
          floatSpeed={floatSpeed}
          size={collectibleSize}
        />
      ))}
      
      {/* Obstacles */}
      {isPlaying && obstacles.map((o, idx) => (
        <UniqueObstacle
          key={o.id}
          position={[o.x, o.y, o.z]}
          color={palette.accent}
          speed={0.8 + (gameId % 5) * 0.2}
          pattern={(gameId + idx) % 6}
          shapeType={(obstacleShape + idx) % 5}
          size={0.5 + (gameId % 3) * 0.2}
        />
      ))}
      
      {/* Platforms */}
      {(mechanic === 'platformJump' || mechanic === 'pyramidClimb' || gameId % 4 === 0) && (
        <>
          <UniquePlatform position={[-2, -1, 0]} color={palette.primary} platformType={platformType} size={0.8} />
          <UniquePlatform position={[0, 0, 0]} color={palette.secondary} platformType={(platformType + 1) % 5} size={0.7} />
          <UniquePlatform position={[2, 1, 0]} color={palette.accent} platformType={(platformType + 2) % 5} size={0.9} />
          <UniquePlatform position={[0, 2, 0]} color={palette.primary} platformType={(platformType + 3) % 5} size={0.6} />
        </>
      )}
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate={!isPlaying} 
        autoRotateSpeed={1 + (gameId % 5)}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
      />
    </>
  );
};

const Dynamic3DGame = forwardRef<HTMLDivElement, Dynamic3DGameProps>(({ gameId, category, emoji, name, themeColor }, ref) => {
  const mechanic = game3DMechanics[gameId % game3DMechanics.length];
  const variant = Math.floor(gameId / game3DMechanics.length) % 10;
  const speedMod = 1 + (gameId % 5) * 0.2;
  const targetScore = 10 + (gameId % 20);
  const timeLimit = 20 + (gameId % 40);
  
  const palette = useMemo(() => generateGamePalette(gameId), [gameId]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameOver, setGameOver] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0, z: 2 });
  const [collectibles, setCollectibles] = useState<Array<{ id: number; x: number; y: number; z: number; collected: boolean }>>([]);
  const [obstacles, setObstacles] = useState<Array<{ id: number; x: number; y: number; z: number }>>([]);

  // Timer effect
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
      const speed = 0.4;
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          setPlayerPos(p => ({ ...p, x: Math.max(-4, p.x - speed) }));
          break;
        case 'ArrowRight':
        case 'd':
          setPlayerPos(p => ({ ...p, x: Math.min(4, p.x + speed) }));
          break;
        case 'ArrowUp':
        case 'w':
          setPlayerPos(p => ({ ...p, y: Math.min(3, p.y + speed) }));
          break;
        case 'ArrowDown':
        case 's':
          setPlayerPos(p => ({ ...p, y: Math.max(-3, p.y - speed) }));
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Spawn collectibles periodically
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    
    const spawnInterval = setInterval(() => {
      if (collectibles.filter(c => !c.collected).length < 4 + variant) {
        setCollectibles(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: (Math.random() - 0.5) * 7,
          y: (Math.random() - 0.5) * 5,
          z: (Math.random() - 0.5) * 3,
          collected: false
        }]);
      }
    }, 1800 / speedMod);
    
    return () => clearInterval(spawnInterval);
  }, [isPlaying, gameOver, collectibles.length, variant, speedMod]);

  // Spawn obstacles
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    
    const spawnInterval = setInterval(() => {
      if (obstacles.length < 3 + (gameId % 3)) {
        setObstacles(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 4,
          z: (Math.random() - 0.5) * 2
        }]);
      }
    }, 3000 / speedMod);
    
    return () => clearInterval(spawnInterval);
  }, [isPlaying, gameOver, obstacles.length, gameId, speedMod]);

  const handleCollect = (id: number) => {
    setCollectibles(prev => prev.map(c => c.id === id ? { ...c, collected: true } : c));
    setScore(s => s + 1 + (gameId % 3));
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(timeLimit);
    setGameOver(false);
    setPlayerPos({ x: 0, y: 0, z: 2 });
    setObstacles([]);
    
    // Initial collectibles with varied positions based on gameId
    const initialCollectibles = Array.from({ length: 3 + variant }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 7,
      y: (Math.random() - 0.5) * 5,
      z: (Math.random() - 0.5) * 3,
      collected: false
    }));
    setCollectibles(initialCollectibles);
  };

  const getInstructions = () => {
    const base = [
      'Collect the floating shapes! Click or use WASD to move.',
      'Gather all crystals before time runs out!',
      'Navigate through space and collect orbs!',
      'Dodge obstacles while collecting gems!',
      'Jump between platforms and collect stars!',
      'Race to collect as many shapes as possible!',
      'Avoid the wireframe obstacles!',
      'Master the cosmic playground!'
    ];
    return base[gameId % base.length];
  };

  return (
    <div ref={ref} className="flex flex-col items-center p-4">
      <div className="flex justify-between w-full mb-4">
        <span className="font-display" style={{ color: palette.primary }}>
          Score: {score}
        </span>
        <span className="text-muted-foreground">
          ⏱️ {timeLeft}s
        </span>
      </div>

      <div 
        className="w-full aspect-video rounded-xl overflow-hidden border-2 shadow-lg"
        style={{ 
          borderColor: palette.primary,
          boxShadow: `0 0 30px ${palette.primary}40`
        }}
      >
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <Suspense fallback={null}>
            <color attach="background" args={[palette.background]} />
            <GameScene
              gameId={gameId}
              mechanic={mechanic}
              variant={variant}
              isPlaying={isPlaying}
              playerPos={playerPos}
              collectibles={collectibles}
              onCollect={handleCollect}
              obstacles={obstacles}
              palette={palette}
            />
          </Suspense>
        </Canvas>
      </div>

      <p className="text-sm text-muted-foreground mt-4 text-center">
        {getInstructions()}
      </p>
      
      <p className="text-xs mt-1" style={{ color: palette.secondary }}>
        Mechanic: <span style={{ color: palette.primary }}>{mechanic}</span> | 
        Variant: {variant + 1} | 
        Style: #{gameId % 100}
      </p>

      {!isPlaying && (
        <Button 
          onClick={startGame}
          className="mt-4"
          style={{ 
            background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
            border: 'none'
          }}
        >
          {gameOver ? `🔄 Play Again (Score: ${score})` : '🎮 Start Game'}
        </Button>
      )}
    </div>
  );
});

Dynamic3DGame.displayName = 'Dynamic3DGame';

export default Dynamic3DGame;
