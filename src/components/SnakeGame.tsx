import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { GameStatus, Point } from '../types';
import { AlertCircle, RefreshCw, Power } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const BASE_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const lastUpdateRef = useRef<number>(0);

  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setFood(spawnFood(INITIAL_SNAKE));
    setStatus(GameStatus.PLAYING);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (status !== GameStatus.PLAYING) return;

    const moveSnake = (time: number) => {
      if (time - lastUpdateRef.current < BASE_SPEED - Math.min(score * 2, 100)) {
        requestAnimationFrame(moveSnake);
        return;
      }
      lastUpdateRef.current = time;

      setSnake((prev) => {
        const head = prev[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setStatus(GameStatus.GAME_OVER);
          if (score > highScore) setHighScore(score);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });

      requestAnimationFrame(moveSnake);
    };

    const reqId = requestAnimationFrame(moveSnake);
    return () => cancelAnimationFrame(reqId);
  }, [status, direction, food, score, highScore, spawnFood]);

  return (
    <div className="flex flex-col items-center gap-6 font-mono">
      <div className="flex justify-between w-full px-4 max-w-[400px] border-b border-magenta/20 pb-2">
        <div className="flex flex-col">
          <span className="text-[8px] uppercase tracking-widest text-magenta/60">INTELLIGENCE_QUOTIENT</span>
          <span className="text-xl font-bold text-magenta italic">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] uppercase tracking-widest text-magenta/60">PEAK_PERFORMANCE</span>
          <span className="text-xl font-bold text-cyan italic">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div 
        className="relative border-4 border-magenta bg-void overflow-hidden magenta-glow"
        style={{
          width: 'min(85vw, 400px)',
          height: 'min(85vw, 400px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Render Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${segment.x}-${segment.y}-${i}`}
            className={`${i === 0 ? 'bg-magenta z-10' : 'bg-magenta/40'} border-[0.5px] border-void`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Render Food with Glitch Scale */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 0.8, 1.1, 1],
            opacity: [1, 0.7, 1, 0.5, 1],
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="bg-cyan"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            boxShadow: '0 0 10px var(--color-cyan)',
          }}
        />

        {/* Glitch Overlays */}
        {status === GameStatus.IDLE && (
          <div className="absolute inset-0 z-20 bg-void flex flex-col items-center justify-center p-8 text-center">
            <h2 data-text="NEURAL_TEST_01" className="text-xl font-bold glitch-text text-magenta mb-8 tracking-tighter">
              NEURAL_TEST_01
            </h2>
            <button 
              onClick={() => setStatus(GameStatus.PLAYING)}
              className="group relative px-8 py-3 bg-magenta text-void font-bold hover:bg-cyan hover:text-void transition-colors"
            >
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan group-hover:bg-magenta" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan group-hover:bg-magenta" />
              <span className="flex items-center gap-2">
                <Power size={16} /> INITIALIZE_LINK
              </span>
            </button>
            <div className="mt-8 text-[8px] text-magenta/40 space-y-1">
              <p>CONTROL: [W/A/S/D]</p>
              <p>OBJECTIVE: CONSUME_DATA_NODES</p>
            </div>
          </div>
        )}

        {status === GameStatus.GAME_OVER && (
          <div className="absolute inset-0 z-20 bg-void/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-[glitch-skew_0.2s_infinite]">
            <AlertCircle className="w-12 h-12 text-magenta mb-4" />
            <h2 data-text="LINK_SEVERED" className="text-xl font-bold glitch-text text-magenta mb-2">LINK_SEVERED</h2>
            <p className="text-sm mb-8 text-cyan">COLLECTED_BITS: {score}</p>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 border-2 border-magenta text-magenta px-6 py-2 hover:bg-magenta hover:text-void transition-none"
            >
              <RefreshCw size={16} /> RE_ESTABLISH
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

