import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getBingoQuestions } from '../data/questions';
import Button from '../components/atoms/Button';
import ScoreBanner from '../components/molecules/ScoreBanner';
import BingoBoard from '../components/organisms/BingoBoard';

const BingoGame = () => {
  const navigate = useNavigate();
  const { user, updateBingoHighScore } = useUser();
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState(getBingoQuestions());

  // Update high score when score changes
  useEffect(() => {
    if (score > 0) {
      updateBingoHighScore(score);
    }
  }, [score, updateBingoHighScore]);

  // Handle bingo event
  const handleBingo = (newScore: number) => {
    setScore(newScore);
  };

  // Reset the game
  const handleReset = () => {
    setQuestions(getBingoQuestions());
    setScore(0);
  };

  // Share score
  const handleShare = () => {
    // Create share text
    const shareText = `I scored ${score} points in Football Bingo Quiz! My high score is ${Math.max(score, user.bingo.highScore)}. Can you beat me?`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'Football Bingo Quiz Score',
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

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-b from-green-100 to-white-100">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="text" 
            onClick={() => navigate('/')}
            className="flex items-center"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-extrabold text-green-500">Football Bingo</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
        
        {/* Score Banner */}
        <ScoreBanner
          currentScore={score}
          highScore={user.bingo.highScore}
          onReset={handleReset}
          onShare={handleShare}
          className="mb-6"
        />
        
        {/* Game Board */}
        <BingoBoard 
          questions={questions}
          onBingo={handleBingo}
        />
        
        {/* Instructions */}
        <div className="mt-6 bg-white-100 rounded-lg shadow-md p-4">
          <h2 className="font-bold text-lg mb-2">How to Play</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Click on a cell to reveal a question</li>
            <li>Answer correctly to mark the cell</li>
            <li>Get 5 in a row (horizontally, vertically, or diagonally) to score a Bingo!</li>
            <li>Each correct answer: 10 points</li>
            <li>Each Bingo line: 50 points</li>
            <li>Complete the board: 100 bonus points</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BingoGame;