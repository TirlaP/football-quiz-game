import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Share2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getTicTacToeQuestions } from '../data/questions';
import Button from '../components/atoms/Button';
import ScoreBanner from '../components/molecules/ScoreBanner';
import TicTacToeBoard from '../components/organisms/TicTacToeBoard';
import Modal from '../components/molecules/Modal';
import confetti from 'canvas-confetti';

const TicTacToeGame = () => {
  const navigate = useNavigate();
  const { user, updateTicTacToeHighScore, addTicTacToeResult } = useUser();
  const [questions, setQuestions] = useState(getTicTacToeQuestions());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw' | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // Handle game end
  const handleGameEnd = (result: 'win' | 'loss' | 'draw', finalScore: number) => {
    setGameOver(true);
    setGameResult(result);
    setScore(finalScore);
    setShowResultModal(true);
    
    // Celebrate with confetti if player wins
    if (result === 'win') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']
      });
    }
    
    // Record game result
    const gameResult = {
      date: new Date().toISOString(),
      result,
      score: finalScore
    };
    addTicTacToeResult(gameResult);
    
    // Update high score if needed
    if (finalScore > 0) {
      updateTicTacToeHighScore(finalScore);
    }
  };
  
  // Reset the game
  const handleReset = () => {
    setQuestions(getTicTacToeQuestions());
    setScore(0);
    setGameOver(false);
    setGameResult(null);
    setShowResultModal(false);
    setCorrectAnswers(0);
    setTotalAnswers(0);
    setStreak(0);
  };
  
  // Share score
  const handleShare = () => {
    // Create share text
    const shareText = `I played Football Quiz Tic Tac Toe and ${
      gameResult === 'win' 
        ? `won with ${score} points!` 
        : gameResult === 'loss'
          ? 'lost, but put up a good fight!'
          : 'played to a draw!'
    } My high score is ${Math.max(score, user.ticTacToe.highScore)}. Can you beat me?`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'Football Quiz Tic Tac Toe Result',
        text: shareText,
      }).catch(err => {
        console.error('Error sharing:', err);
        // Fallback to clipboard
        copyToClipboard(shareText);
      });
    } else {
      // Fallback to clipboard
      copyToClipboard(shareText);
    }
  };
  
  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Score copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
        alert('Failed to copy to clipboard. Please try again.');
      });
  };
  
  // Track correct answers
  const handleCorrectAnswer = (isCorrect: boolean) => {
    setTotalAnswers(prev => prev + 1);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="text" 
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-extrabold text-blue-600">Tic Tac Toe Quiz</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
        
        {/* Score Banner */}
        <ScoreBanner
          currentScore={score}
          highScore={user.ticTacToe.highScore}
          onReset={handleReset}
          onShare={handleShare}
          className="mb-6"
          streak={streak}
          correctAnswers={correctAnswers}
          totalQuestions={totalAnswers}
          showDetails={true}
        />
        
        {/* Game Board */}
        <TicTacToeBoard 
          questions={questions}
          onGameEnd={handleGameEnd}
          className="mb-6"
        />
        
        {/* Reset Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center"
          >
            <RefreshCw size={18} className="mr-2" />
            New Game
          </Button>
        </div>
        
        {/* Instructions */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h2 className="font-bold text-lg mb-2">How to Play</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Click on a cell to answer a football question</li>
            <li>Answer correctly to mark the cell with X</li>
            <li>Get 3 in a row to win!</li>
            <li>Each correct answer: 10 points</li>
            <li>Winning the game: 50 bonus points</li>
            <li>Lose 5 points when CPU makes a move</li>
          </ul>
        </div>
      </div>
      
      {/* Game Result Modal */}
      <Modal 
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        title={
          gameResult === 'win' 
            ? 'Victory!' 
            : gameResult === 'loss' 
              ? 'Defeat!' 
              : 'It\'s a Draw!'
        }
        variant={
          gameResult === 'win' 
            ? 'success' 
            : gameResult === 'loss' 
              ? 'error' 
              : 'warning'
        }
      >
        <div className="text-center">
          <p className="text-lg mb-4">
            {gameResult === 'win' 
              ? 'Congratulations! You\'ve won the game!' 
              : gameResult === 'loss' 
                ? 'You\'ve lost this time. Better luck next round!' 
                : 'The game ended in a draw. So close!'
            }
          </p>
          
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Final Score</div>
            <div className="text-3xl font-bold text-blue-600">{score}</div>
            
            {score > user.ticTacToe.highScore && (
              <div className="mt-2 text-sm text-green-600 font-semibold">
                New High Score!
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex-1"
            >
              Play Again
            </Button>
            <Button 
              variant="primary" 
              onClick={handleShare}
              className="flex-1"
            >
              Share Result
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TicTacToeGame;