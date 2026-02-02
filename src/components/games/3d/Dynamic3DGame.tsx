import { useState, useEffect, useRef, forwardRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { useAchievements } from "@/contexts/AchievementsContext";
import * as THREE from "three";

interface Dynamic3DGameProps {
  gameId: number;
  category: string;
  emoji: string;
  name: string;
  themeColor: string;
}

// Game types: 0 = Shooting, 1 = Racing
const getGameType = (gameId: number) => gameId % 2;

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

// ==================== RACING GAME COMPONENTS ====================

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

// ==================== MAIN COMPONENT ====================

const Dynamic3DGame = forwardRef<HTMLDivElement, Dynamic3DGameProps>(({ gameId, category, emoji, name, themeColor }, ref) => {
  const { trackGamePlay } = useAchievements();
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

  const lanePositions = [-2.5, 0, 2.5];

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
      if (gameType === 0) {
        // Shooting controls
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
              z: 2
            }]);
            break;
        }
      } else {
        // Racing controls
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
    if (!isPlaying || gameOver || gameType !== 0) return;
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
    if (!isPlaying || gameOver || gameType !== 0) return;
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
    if (!isPlaying || gameOver || gameType !== 1) return;
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
    trackGamePlay(true);
  };

  const gameTypeLabel = gameType === 0 ? "🎯 SPACE SHOOTER" : "🏎️ RACING";
  const instructions = gameType === 0 
    ? "WASD to move, SPACE to shoot! Destroy enemies before they reach you!"
    : "A/D or ←/→ to change lanes, W/S to speed up/slow down! Avoid obstacles!";

  return (
    <div ref={ref} className="flex flex-col items-center p-4">
      <div className="flex justify-between w-full mb-2">
        <span className="font-display text-primary">Score: {score}</span>
        <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">{gameTypeLabel}</span>
        <span className="text-muted-foreground">⏱️ {timeLeft}s</span>
      </div>

      {gameType === 1 && isPlaying && (
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
        <Canvas camera={{ position: gameType === 0 ? [0, 0, 8] : [0, 3, 8], fov: 60 }}>
          <Suspense fallback={null}>
            {gameType === 0 ? (
              <ShootingGameScene
                gameId={gameId}
                palette={palette}
                isPlaying={isPlaying}
                playerPos={playerPos}
                enemies={enemies}
                bullets={bullets}
                onEnemyHit={handleEnemyHit}
              />
            ) : (
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
