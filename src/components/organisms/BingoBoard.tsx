import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Clock, Gift, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import Modal from '../molecules/Modal';
import QuestionCard from '../molecules/QuestionCard';
import type { Question } from '../../data/questions';

export interface BingoCell {
  question: Question;
  isRevealed: boolean;
  isSpecial?: boolean;
  specialType?: 'bonus' | 'mystery' | 'wildcard';
}

interface BingoBoardProps {
  questions: Question[];
  onBingo: (score: number) => void;
  className?: string;
}

const BOARD_SIZE = 5;
const FREE_CELL_INDEX = 12; // Center of 5x5 grid
const CONFETTI_COLORS = ['#08C757', '#0571FF', '#FCA53D', '#FB8800', '#FFD566'];
const SPECIAL_CELL_CHANCE = 0.15; // 15% chance for a special cell

// Special cells with bonus effects
const SPECIAL_CELLS = [
  { type: 'bonus', icon: <Star size={24} className="text-champion-500" />, label: '2x Points' },
  { type: 'mystery', icon: <Gift size={24} className="text-referee-500" />, label: 'Mystery' },
  { type: 'wildcard', icon: <Zap size={24} className="text-jersey-400" />, label: 'Wild Card' },
];

const BingoBoard = ({ questions, onBingo, className = '' }: BingoBoardProps) => {
  const [board, setBoard] = useState<BingoCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bingoLines, setBingoLines] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [powerUps, setPowerUps] = useState({
    fiftyFifty: true,
    extraTime: true,
    skipQuestion: true,
  });
  
  // Animation references
  const animationRef = useRef<{ id: number } | null>(null);

  // Initialize the board
  useEffect(() => {
    if (questions.length >= BOARD_SIZE * BOARD_SIZE) {
      // Create board with random special cells
      const newBoard = questions.slice(0, BOARD_SIZE * BOARD_SIZE).map((question, index) => {
        // Determine if this is a special cell (except the FREE center cell)
        const isSpecial = index !== FREE_CELL_INDEX && Math.random() < SPECIAL_CELL_CHANCE;
        const specialType = isSpecial ? 
          SPECIAL_CELLS[Math.floor(Math.random() * SPECIAL_CELLS.length)].type as 'bonus' | 'mystery' | 'wildcard' : 
          undefined;
        
        return {
          question,
          isRevealed: index === FREE_CELL_INDEX, // FREE center cell is revealed by default
          isSpecial,
          specialType,
        };
      });
      
      setBoard(newBoard);
    }
  }, [questions]);

  // Open a question modal
  const openQuestion = (index: number) => {
    if (!board[index].isRevealed) {
      setSelectedCell(index);
      setIsModalOpen(true);
    }
  };

  // Handle power-up usage
  const handleUsePowerUp = (type: 'fiftyFifty' | 'extraTime' | 'skipQuestion') => {
    setPowerUps(prev => ({
      ...prev,
      [type]: false
    }));
  };

  // Handle answer submission
  const handleAnswer = (answer: string, isCorrect: boolean, points: number) => {
    if (selectedCell === null) return;
    
    if (isCorrect) {
      // Update streak
      setStreak(prev => prev + 1);
      
      // Calculate bonus points for special cells
      let finalPoints = points;
      const currentCell = board[selectedCell];
      
      if (currentCell.isSpecial && currentCell.specialType === 'bonus') {
        finalPoints *= 2;
        triggerFloatingText(selectedCell, '2x BONUS!');
      } else if (currentCell.isSpecial && currentCell.specialType === 'mystery') {
        // Random bonus between 10-50 points
        const mysteryBonus = Math.floor(Math.random() * 41) + 10;
        finalPoints += mysteryBonus;
        triggerFloatingText(selectedCell, `+${mysteryBonus} MYSTERY!`);
      }
      
      // Update the board
      const newBoard = [...board];
      newBoard[selectedCell] = {
        ...newBoard[selectedCell],
        isRevealed: true,
      };
      
      setBoard(newBoard);
      setScore(prevScore => prevScore + finalPoints);
      
      // Check for bingo
      const newBingoLines = checkForBingo(newBoard);
      if (newBingoLines.length > bingoLines.length) {
        // New bingo lines found
        const newBingoCount = newBingoLines.length - bingoLines.length;
        const bingoBonus = newBingoCount * 50; // 50 points per bingo line
        
        // Trigger bingo celebration
        triggerBingoCelebration(newBingoLines.slice(-newBingoCount));
        
        // Update score with bingo bonus
        setScore(prevScore => prevScore + finalPoints + bingoBonus);
        setBingoLines(newBingoLines);
        
        // Report the score
        onBingo(score + finalPoints + bingoBonus);
      } else {
        // Just update the score
        onBingo(score + finalPoints);
      }
      
      // Check for game completion
      const unrevealedCount = newBoard.filter(cell => !cell.isRevealed).length;
      if (unrevealedCount === 0) {
        setGameComplete(true);
        const completionBonus = 100; // Bonus for completing the board
        triggerFloatingText(FREE_CELL_INDEX, `BOARD COMPLETE! +${completionBonus}`);
        triggerFullBoardCelebration();
        onBingo(score + finalPoints + completionBonus);
      }
    } else {
      // Reset streak on wrong answer
      setStreak(0);
    }
    
    // Close modal
    setIsModalOpen(false);
    setSelectedCell(null);
  };

  // Check for bingo lines (rows, columns, diagonals)
  const checkForBingo = (currentBoard: BingoCell[]): number[][] => {
    const bingoLines: number[][] = [];
    
    // Check rows
    for (let row = 0; row < BOARD_SIZE; row++) {
      const rowIndices = Array.from({ length: BOARD_SIZE }, (_, col) => row * BOARD_SIZE + col);
      if (rowIndices.every(index => currentBoard[index].isRevealed)) {
        bingoLines.push(rowIndices);
      }
    }
    
    // Check columns
    for (let col = 0; col < BOARD_SIZE; col++) {
      const colIndices = Array.from({ length: BOARD_SIZE }, (_, row) => row * BOARD_SIZE + col);
      if (colIndices.every(index => currentBoard[index].isRevealed)) {
        bingoLines.push(colIndices);
      }
    }
    
    // Check diagonal from top-left to bottom-right
    const diag1Indices = Array.from({ length: BOARD_SIZE }, (_, i) => i * BOARD_SIZE + i);
    if (diag1Indices.every(index => currentBoard[index].isRevealed)) {
      bingoLines.push(diag1Indices);
    }
    
    // Check diagonal from top-right to bottom-left
    const diag2Indices = Array.from({ length: BOARD_SIZE }, (_, i) => i * BOARD_SIZE + (BOARD_SIZE - 1 - i));
    if (diag2Indices.every(index => currentBoard[index].isRevealed)) {
      bingoLines.push(diag2Indices);
    }
    
    return bingoLines;
  };

  // Trigger confetti animation for a bingo line
  const triggerBingoCelebration = (newLines: number[][]) => {
    // Play celebration sound
    playSound('bingo');
    
    // Start confetti
    const end = Date.now() + 3000; // 3 seconds
    
    const runBingoAnimation = () => {
      const timeLeft = end - Date.now();
      
      if (timeLeft <= 0) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current.id);
          animationRef.current = null;
        }
        return;
      }
      
      // Launch confetti from both sides
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: CONFETTI_COLORS
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: CONFETTI_COLORS
      });
      
      animationRef.current = {
        id: requestAnimationFrame(runBingoAnimation)
      };
    };
    
    runBingoAnimation();
    
    // Highlight the bingo line
    highlightBingoLines(newLines);
  };
  
  // Highlight bingo lines
  const highlightBingoLines = (lines: number[][]) => {
    // This would be implemented with animations on the cells
    console.log('Bingo lines:', lines);
  };
  
  // Trigger full board completion celebration
  const triggerFullBoardCelebration = () => {
    // Play sound
    playSound('complete');
    
    // Epic confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    
    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      
      const particleCount = 50 * (timeLeft / duration);
      
      // Emit confetti from all sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: CONFETTI_COLORS
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: CONFETTI_COLORS
      });
    }, 250);
  };
  
  // Trigger floating text animation
  const triggerFloatingText = (cellIndex: number, text: string) => {
    // This would be implemented with DOM manipulation in a real app
    console.log(`Cell ${cellIndex}: ${text}`);
  };
  
  // Play sound effect
  const playSound = (type: 'correct' | 'wrong' | 'bingo' | 'complete') => {
    // This would be implemented with the Web Audio API in a real app
    console.log(`Play sound: ${type}`);
  };

  // Check if a cell is part of a bingo line
  const isCellInBingoLine = (index: number): boolean => {
    return bingoLines.some(line => line.includes(index));
  };
  
  // Get special cell icon
  const getSpecialCellIcon = (cell: BingoCell) => {
    if (!cell.isSpecial) return null;
    
    switch (cell.specialType) {
      case 'bonus':
        return <Star size={16} className="text-champion-500" />;
      case 'mystery':
        return <Gift size={16} className="text-referee-500" />;
      case 'wildcard':
        return <Zap size={16} className="text-jersey-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-5 gap-2 bg-white rounded-lg p-3 shadow-md">
        {board.map((cell, index) => (
          <motion.button
            key={index}
            onClick={() => openQuestion(index)}
            className={`
              aspect-square p-1 flex flex-col items-center justify-center rounded-lg
              text-xs font-bold relative overflow-hidden
              ${cell.isRevealed
                ? isCellInBingoLine(index)
                  ? 'bg-gradient-to-br from-pitch-500 to-pitch-600 text-white'
                  : 'bg-pitch-100 text-pitch-800'
                : cell.isSpecial
                  ? 'bg-gradient-to-br from-white to-crowd-50 border border-crowd-200 text-crowd-800 hover:shadow-md'
                  : 'bg-white hover:bg-crowd-50 text-crowd-800 border border-crowd-200 hover:shadow-md'
              }
              transition-all duration-200 ease-in-out
              ${!cell.isRevealed && 'cursor-pointer hover:scale-105 active:scale-95'}
            `}
            disabled={cell.isRevealed}
            whileHover={!cell.isRevealed ? { scale: 1.05 } : {}}
            whileTap={!cell.isRevealed ? { scale: 0.95 } : {}}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
          >
            {index === FREE_CELL_INDEX ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Trophy size={24} className="text-champion-500 mb-1" />
                <span className="uppercase text-[10px] font-bold">FREE</span>
              </div>
            ) : cell.isRevealed ? (
              <CheckCircle size={24} className="mb-1" />
            ) : (
              <>
                {cell.isSpecial && (
                  <div className="absolute top-1 right-1">
                    {getSpecialCellIcon(cell)}
                  </div>
                )}
                <div className="capitalize">{cell.question.category}</div>
                {cell.isSpecial && (
                  <div className="text-[9px] mt-1 opacity-80 font-medium">
                    {cell.specialType === 'bonus' ? '2x PTS' : 
                     cell.specialType === 'mystery' ? 'MYSTERY' : 
                     'WILD CARD'}
                  </div>
                )}
              </>
            )}
            
            {/* Highlighted border for bingo line cells */}
            {cell.isRevealed && isCellInBingoLine(index) && (
              <motion.div 
                className="absolute inset-0 border-2 border-champion-400 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Question Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCell !== null && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={`Football Question${board[selectedCell].isSpecial ? ` - ${board[selectedCell].specialType?.toUpperCase()}` : ''}`}
            variant={board[selectedCell].isSpecial ? 
              board[selectedCell].specialType === 'bonus' ? 'success' : 
              board[selectedCell].specialType === 'mystery' ? 'warning' : 
              'default' : 'default'
            }
          >
            <QuestionCard
              question={board[selectedCell].question}
              streak={streak}
              onAnswer={handleAnswer}
              powerUps={powerUps}
              onUsePowerUp={handleUsePowerUp}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BingoBoard;