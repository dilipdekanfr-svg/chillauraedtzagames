import { useState, useEffect, useCallback, useRef, forwardRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Sphere, Box, Cylinder, Torus, Cone, Stars } from "@react-three/drei";
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

// Floating collectible component
const Collectible = ({ position, onClick, color, shape }: { position: [number, number, number]; onClick: () => void; color: string; shape: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.02;
      meshRef.current.rotation.y += 0.03;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3;
    }
  });

  const renderShape = () => {
    switch (shape) {
      case 'sphere': return <Sphere args={[0.3, 16, 16]}><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} /></Sphere>;
      case 'box': return <Box args={[0.4, 0.4, 0.4]}><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} /></Box>;
      case 'torus': return <Torus args={[0.25, 0.1, 16, 32]}><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} /></Torus>;
      case 'cone': return <Cone args={[0.25, 0.5, 16]}><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} /></Cone>;
      default: return <Sphere args={[0.3, 16, 16]}><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} /></Sphere>;
    }
  };

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      {renderShape()}
    </mesh>
  );
};

// Enemy/obstacle component
const Obstacle = ({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.z += 0.02 * speed;
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * speed) * 2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <Box args={[0.6, 0.6, 0.6]}>
        <meshStandardMaterial color={color} wireframe />
      </Box>
    </mesh>
  );
};

// Player component
const Player = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <Sphere args={[0.4, 32, 32]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
      </Sphere>
    </mesh>
  );
};

// Target component
const Target = ({ position, onClick, hit }: { position: [number, number, number]; onClick: () => void; hit: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && !hit) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  if (hit) return null;

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <Torus args={[0.4, 0.1, 16, 32]}>
        <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
      </Torus>
    </mesh>
  );
};

// Spinning ring component
const SpinningRing = ({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.02 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <Torus args={[1.5, 0.1, 16, 64]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.8} />
      </Torus>
    </mesh>
  );
};

// Floating platform
const Platform = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <Cylinder args={[0.8, 0.8, 0.2, 32]}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </Cylinder>
    </mesh>
  );
};

// Game scene component
const GameScene = ({ 
  mechanic, 
  variant, 
  isPlaying, 
  onScore, 
  playerPos,
  collectibles,
  onCollect,
  targets,
  onTargetHit,
  themeColors 
}: { 
  mechanic: string; 
  variant: number;
  isPlaying: boolean;
  onScore: () => void;
  playerPos: { x: number; y: number; z: number };
  collectibles: Array<{ id: number; x: number; y: number; z: number; collected: boolean }>;
  onCollect: (id: number) => void;
  targets: Array<{ id: number; x: number; y: number; z: number; hit: boolean }>;
  onTargetHit: (id: number) => void;
  themeColors: string[];
}) => {
  const shapes = ['sphere', 'box', 'torus', 'cone'];
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6666ff" />
      
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      
      {/* Background spinning rings */}
      <SpinningRing position={[0, 0, -5]} color={themeColors[0]} speed={1 + variant * 0.1} />
      <SpinningRing position={[0, 0, -8]} color={themeColors[1]} speed={0.8 + variant * 0.1} />
      
      {/* Player */}
      {isPlaying && (
        <Player position={[playerPos.x, playerPos.y, playerPos.z]} color={themeColors[2] || "#00ffff"} />
      )}
      
      {/* Collectibles */}
      {isPlaying && collectibles.filter(c => !c.collected).map((c) => (
        <Collectible 
          key={c.id}
          position={[c.x, c.y, c.z]}
          onClick={() => onCollect(c.id)}
          color={themeColors[c.id % themeColors.length]}
          shape={shapes[c.id % shapes.length]}
        />
      ))}
      
      {/* Targets */}
      {isPlaying && targets.map((t) => (
        <Target
          key={t.id}
          position={[t.x, t.y, t.z]}
          onClick={() => onTargetHit(t.id)}
          hit={t.hit}
        />
      ))}
      
      {/* Obstacles based on mechanic */}
      {isPlaying && (mechanic === 'cubeDodge' || mechanic === 'laserDodge') && (
        <>
          <Obstacle position={[-2, 0, 0]} color="#ff4444" speed={1 + variant * 0.2} />
          <Obstacle position={[2, 1, 0]} color="#ff4444" speed={1.2 + variant * 0.2} />
          <Obstacle position={[0, -1, 0]} color="#ff4444" speed={0.8 + variant * 0.2} />
        </>
      )}
      
      {/* Platforms for platform games */}
      {(mechanic === 'platformJump' || mechanic === 'pyramidClimb') && (
        <>
          <Platform position={[-2, -1, 0]} color={themeColors[0]} />
          <Platform position={[0, 0, 0]} color={themeColors[1]} />
          <Platform position={[2, 1, 0]} color={themeColors[2] || themeColors[0]} />
          <Platform position={[0, 2, 0]} color={themeColors[0]} />
        </>
      )}
      
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={!isPlaying} autoRotateSpeed={2} />
    </>
  );
};

const Dynamic3DGame = forwardRef<HTMLDivElement, Dynamic3DGameProps>(({ gameId, category, emoji, name, themeColor }, ref) => {
  const mechanic = game3DMechanics[gameId % game3DMechanics.length];
  const variant = Math.floor(gameId / game3DMechanics.length) % 10;
  const speedMod = 1 + (gameId % 5) * 0.2;
  const targetScore = 10 + (gameId % 20);
  const timeLimit = 20 + (gameId % 40);

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameOver, setGameOver] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0, z: 2 });
  const [collectibles, setCollectibles] = useState<Array<{ id: number; x: number; y: number; z: number; collected: boolean }>>([]);
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number; z: number; hit: boolean }>>([]);

  const themeColors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9',
    '#fd79a8', '#a29bfe', '#00b894', '#e17055', '#74b9ff', '#55efc4'
  ];
  const gameColors = [
    themeColors[(gameId * 3) % themeColors.length],
    themeColors[(gameId * 5 + 1) % themeColors.length],
    themeColors[(gameId * 7 + 2) % themeColors.length]
  ];

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
      const speed = 0.3;
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
        case ' ':
          handleScore();
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
      if (collectibles.filter(c => !c.collected).length < 5 + variant) {
        setCollectibles(prev => [...prev, {
          id: Date.now(),
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 4,
          z: (Math.random() - 0.5) * 2,
          collected: false
        }]);
      }
    }, 2000 / speedMod);
    
    return () => clearInterval(spawnInterval);
  }, [isPlaying, gameOver, collectibles.length, variant, speedMod]);

  // Spawn targets for shooting games
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    if (!['sphereShooter', 'targetPractice', 'asteroidDestroyer'].includes(mechanic)) return;
    
    const spawnInterval = setInterval(() => {
      if (targets.filter(t => !t.hit).length < 3 + variant) {
        setTargets(prev => [...prev, {
          id: Date.now(),
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 4,
          z: -2 - Math.random() * 2,
          hit: false
        }]);
      }
    }, 1500 / speedMod);
    
    return () => clearInterval(spawnInterval);
  }, [isPlaying, gameOver, targets.length, mechanic, variant, speedMod]);

  const handleScore = () => {
    setScore(s => s + 1);
  };

  const handleCollect = (id: number) => {
    setCollectibles(prev => prev.map(c => c.id === id ? { ...c, collected: true } : c));
    setScore(s => s + 1);
  };

  const handleTargetHit = (id: number) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, hit: true } : t));
    setScore(s => s + 2);
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(timeLimit);
    setGameOver(false);
    setPlayerPos({ x: 0, y: 0, z: 2 });
    setCollectibles([]);
    setTargets([]);
    
    // Initial spawn
    const initialCollectibles = Array.from({ length: 3 + variant }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 2,
      collected: false
    }));
    setCollectibles(initialCollectibles);
    
    if (['sphereShooter', 'targetPractice', 'asteroidDestroyer'].includes(mechanic)) {
      const initialTargets = Array.from({ length: 2 }, (_, i) => ({
        id: 100 + i,
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 4,
        z: -2 - Math.random() * 2,
        hit: false
      }));
      setTargets(initialTargets);
    }
  };

  const getInstructions = () => {
    const instructions: Record<string, string> = {
      'orbCollector': 'Click floating orbs to collect them!',
      'cubeDodge': 'Avoid the spinning cubes! Use WASD to move.',
      'sphereShooter': 'Click the red targets to destroy them!',
      'mazeRunner': 'Navigate through the 3D maze.',
      'platformJump': 'Jump between platforms using WASD.',
      'asteroidDestroyer': 'Shoot down the asteroids!',
      'ringToss': 'Toss rings onto the targets.',
      'ballBounce': 'Keep the ball bouncing!',
      'cubeStack': 'Stack cubes as high as possible.',
      'colorMatch3D': 'Match colors in 3D space.',
      'spaceFlight': 'Fly through space and collect stars.',
      'tunnelRun': 'Race through the neon tunnel.',
      'gemCollector': 'Collect all the gems before time runs out!',
      'targetPractice': 'Hit all targets for bonus points!',
      'racingOrbs': 'Race against the orbs to the finish.',
      'puzzleCubes': 'Solve the 3D cube puzzle.',
      'gravityBall': 'Control gravity to guide the ball.',
      'laserDodge': 'Dodge the laser beams!',
      'crystalHunt': 'Hunt for crystals in the void.',
      'vortexEscape': 'Escape the gravitational vortex!',
      'pyramidClimb': 'Climb to the top of the pyramid.',
      'starCatcher': 'Catch falling stars!',
      'waveRider': 'Ride the cosmic waves.',
      'portalJump': 'Jump through portals to score.',
      'neonChase': 'Chase the neon lights!',
      'cosmicPong': 'Play pong in space!',
      'shapeSorter': 'Sort shapes into correct positions.',
      'lightTrail': 'Follow the light trail.',
      'orbitMaster': 'Master the orbital mechanics.',
      'quantumLeap': 'Make quantum leaps to collect points!'
    };
    return instructions[mechanic] || 'Click objects to score points!';
  };

  return (
    <div ref={ref} className="flex flex-col items-center p-4">
      <div className="flex justify-between w-full mb-4">
        <span className={`font-display ${themeColor.replace('bg-', 'text-')}`}>
          Score: {score}
        </span>
        <span className="text-muted-foreground">
          ⏱️ {timeLeft}s
        </span>
      </div>

      <div className="w-full aspect-video bg-black/90 rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <Suspense fallback={null}>
            <GameScene
              mechanic={mechanic}
              variant={variant}
              isPlaying={isPlaying}
              onScore={handleScore}
              playerPos={playerPos}
              collectibles={collectibles}
              onCollect={handleCollect}
              targets={targets}
              onTargetHit={handleTargetHit}
              themeColors={gameColors}
            />
          </Suspense>
        </Canvas>
      </div>

      <p className="text-sm text-muted-foreground mt-4 text-center">
        {getInstructions()}
      </p>
      
      <p className="text-xs text-muted-foreground mt-1">
        Mechanic: <span className="text-primary">{mechanic}</span> | Variant: {variant + 1} | Target: {targetScore}
      </p>

      {!isPlaying && (
        <Button 
          onClick={startGame}
          className={`mt-4 ${themeColor} hover:opacity-90`}
        >
          {gameOver ? `🔄 Play Again (Score: ${score})` : '🎮 Start Game'}
        </Button>
      )}
    </div>
  );
});

Dynamic3DGame.displayName = 'Dynamic3DGame';

export default Dynamic3DGame;
