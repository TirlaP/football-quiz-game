import { useState, useEffect } from 'react';
import { type Question } from '../../data/questions';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../molecules/Modal';
import QuestionCard from '../molecules/QuestionCard';
import { X, Circle } from 'lucide-react';

type Player = 'X' | 'O' | null;

export interface TicTacToeCell {
  player: Player;
  question: Question;
}

interface TicTacToeBoardProps {
  questions: Question[];
  onGameEnd: (result: 'win' | 'loss' | 'draw', score: number) => void;
  className?: string;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
];

const TicTacToeBoard = ({ questions, onGameEnd, className = '' }: TicTacToeBoardProps) => {
  const [board, setBoard] = useState<TicTacToeCell[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [score, setScore] = useState(0);
  const [cpuThinking, setCpuThinking] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  // Initialize the board
  useEffect(() => {
    if (questions.length >= 9) {
      const newBoard = questions.slice(0, 9).map((question) => ({
        player: null,
        question,
      }));
      setBoard(newBoard);
      setCurrentPlayer('X');
      setWinner(null);
      setWinningLine(null);
      setScore(0);
      setCpuThinking(false);
      setGameEnded(false);
    }
  }, [questions]);

  // CPU move - SIMPLIFIED
  useEffect(() => {
    let cpuMoveTimeout: number;
    
    // Only run if it's CPU's turn, game isn't over, and not already thinking
    if (currentPlayer === 'O' && !winner && !gameEnded) {
      // Set thinking state
      setCpuThinking(true);
      
      // Random thinking time between 500-1000ms
      const thinkingTime = Math.floor(Math.random() * 500) + 500;
      
      cpuMoveTimeout = window.setTimeout(() => {
        // Always make a move if possible
        const availableCells = board
          .map((cell, index) => (cell.player === null ? index : -1))
          .filter((index) => index !== -1);
          
        if (availableCells.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableCells.length);
          const cellIndex = availableCells[randomIndex];
          
          // Create a new board with the CPU's move
          const newBoard = [...board];
          newBoard[cellIndex] = {
            ...newBoard[cellIndex],
            player: 'O',
          };
          
          // Update the board
          setBoard(newBoard);
          // Switch player
          setCurrentPlayer('X');
          // Deduct points
          setScore(prevScore => Math.max(0, prevScore - 5));
        }
        
        // Always reset thinking state
        setCpuThinking(false);
      }, thinkingTime);
      
      // Added safety timeout - force reset thinking after 3 seconds
      const safetyTimeout = window.setTimeout(() => {
        setCpuThinking(false);
      }, 3000);
      
      return () => {
        window.clearTimeout(cpuMoveTimeout);
        window.clearTimeout(safetyTimeout);
      };
    }
  }, [currentPlayer, board, winner, gameEnded]);

  // Check for a winner or draw - SIMPLIFIED
  useEffect(() => {
    // Skip if game already ended or empty board
    if (gameEnded || board.length === 0) return;
    
    // Check for winner
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (
        board[a]?.player && 
        board[a].player === board[b]?.player && 
        board[a].player === board[c]?.player
      ) {
        // Determine winner and calculate final score
        const winningPlayer = board[a].player;
        const isPlayerWin = winningPlayer === 'X';
        const finalScore = score + (isPlayerWin ? 50 : -20);
        
        // Mark game as ended
        setGameEnded(true);
        setWinner(winningPlayer);
        setWinningLine(combo);
        
        // Delay the callback to avoid race conditions
        setTimeout(() => {
          onGameEnd(isPlayerWin ? 'win' : 'loss', finalScore);
        }, 100);
        
        return;
      }
    }
    
    // Check for draw
    const isBoardFull = board.every((cell) => cell.player !== null);
    if (isBoardFull) {
      setGameEnded(true);
      setWinner('draw');
      
      // Delay the callback
      setTimeout(() => {
        onGameEnd('draw', score);
      }, 100);
    }
  }, [board, score, onGameEnd, gameEnded]);

  // Handle answering questions
  const handleAnswer = (answer: string, isCorrect: boolean) => {
    if (selectedCell === null || gameEnded) {
      setIsModalOpen(false);
      setSelectedCell(null);
      return;
    }
    
    // IMPORTANT: Always reset CPU thinking state when modal closes
    setCpuThinking(false);
    
    const newBoard = [...board];
    
    if (isCorrect) {
      // Player gets cell if answer is correct
      newBoard[selectedCell] = {
        ...newBoard[selectedCell],
        player: 'X',
      };
      
      setBoard(newBoard);
      setScore(prevScore => prevScore + 10);
      setCurrentPlayer('O');
    } else {
      // CPU gets the cell if answer is wrong
      newBoard[selectedCell] = {
        ...newBoard[selectedCell],
        player: 'O',
      };
      
      setBoard(newBoard);
      setScore(prevScore => Math.max(0, prevScore - 10));
      setCurrentPlayer('X');
    }
    
    // Close modal
    setIsModalOpen(false);
    setSelectedCell(null);
  };

  // Open a question modal
  const openQuestion = (index: number) => {
    if (!board[index].player && !winner && currentPlayer === 'X' && !cpuThinking && !gameEnded) {
      setSelectedCell(index);
      setIsModalOpen(true);
    }
  };
  
  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-3 gap-2 bg-gray-100 p-2 rounded-lg">
        {board.map((cell, index) => (
          <motion.button
            key={index}
            onClick={() => openQuestion(index)}
            className={`
              aspect-square p-2 flex items-center justify-center rounded bg-white
              ${!cell.player && !winner && !cpuThinking && !gameEnded ? 'hover:bg-gray-200 cursor-pointer' : ''}
              ${winningLine?.includes(index) ? 'bg-green-200' : ''}
              transition-all duration-200 ease-in-out
            `}
            whileHover={!cell.player && !winner && !cpuThinking && !gameEnded ? { scale: 1.05 } : {}}
            disabled={!!cell.player || !!winner || cpuThinking || gameEnded}
          >
            {cell.player === 'X' && (
              <X className="text-green-500" size={32} />
            )}
            {cell.player === 'O' && (
              <Circle className="text-red-500" size={32} />
            )}
          </motion.button>
        ))}
      </div>

      {/* Status message */}
      <div className="mt-4 text-center">
        {winner === 'X' && (
          <p className="text-lg font-bold text-green-500">You win! 🎉</p>
        )}
        {winner === 'O' && (
          <p className="text-lg font-bold text-red-500">You lose! 😢</p>
        )}
        {winner === 'draw' && (
          <p className="text-lg font-bold text-gray-500">It's a draw! 🤝</p>
        )}
        {!winner && cpuThinking && (
          <p className="text-lg font-bold text-yellow-500">CPU is thinking... 🤔</p>
        )}
        {!winner && !cpuThinking && !gameEnded && (
          <p className="text-lg font-bold text-blue-600">
            {currentPlayer === 'X' ? "Your turn" : "CPU's turn"}
          </p>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedCell !== null && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => {
              // ALWAYS reset CPU thinking when modal closes
              setCpuThinking(false);
              setIsModalOpen(false);
              setSelectedCell(null);
            }}
            title="Football Question"
            disableBackdropClick={true}
          >
            <QuestionCard
              question={board[selectedCell].question}
              onAnswer={handleAnswer}
              streak={0}
              powerUps={{
                fiftyFifty: false,
                extraTime: false,
                skipQuestion: false
              }}
              onUsePowerUp={() => {}}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TicTacToeBoard;