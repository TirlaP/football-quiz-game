import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Share2, RotateCcw, ChevronDown, ChevronUp, Star, Clock } from 'lucide-react';
import Button from '../atoms/Button';
import confetti from 'canvas-confetti';

interface ScoreBannerProps {
  currentScore: number;
  highScore: number;
  onReset?: () => void;
  onShare?: () => void;
  className?: string;
  streak?: number;
  correctAnswers?: number;
  totalQuestions?: number;
  timeBonus?: number;
  showDetails?: boolean;
}

const ScoreBanner = ({
  currentScore,
  highScore,
  onReset,
  onShare,
  className = '',
  streak = 0,
  correctAnswers = 0,
  totalQuestions = 0,
  timeBonus = 0,
  showDetails = false,
}: ScoreBannerProps) => {
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [expanded, setExpanded] = useState(showDetails);
  const [celebrateScore, setCelebrateScore] = useState(false);
  
  // Check for new high score
  useEffect(() => {
    if (currentScore > highScore && currentScore > 0) {
      setIsNewHighScore(true);
      // Trigger confetti for new high score
      const duration = 2000;
      const particleCount = 100;
      
      confetti({
        particleCount,
        spread: 70,
        origin: { y: 0.3 },
        colors: ['#FFD700', '#FFA500', '#FFFF00'],
        zIndex: 1000,
        disableForReducedMotion: true,
        scalar: 1.2,
        shapes: ['star', 'circle'],
        gravity: 1.2
      });
      
      // Trigger score celebration animation
      setCelebrateScore(true);
      setTimeout(() => setCelebrateScore(false), 2000);
    }
  }, [currentScore, highScore]);
  
  // Calculate stats for display
  const accuracy = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;
  
  // Get color based on accuracy
  const getAccuracyColor = () => {
    if (accuracy >= 80) return 'text-emerald-500';
    if (accuracy >= 60) return 'text-blue-500';
    if (accuracy >= 40) return 'text-amber-500';
    return 'text-red-500';
  };
  
  // Get description based on score
  const getScoreDescription = () => {
    if (currentScore >= 500) return 'World Class';
    if (currentScore >= 300) return 'Champion';
    if (currentScore >= 200) return 'Professional';
    if (currentScore >= 100) return 'Amateur';
    if (currentScore >= 50) return 'Rookie';
    return 'Beginner';
  };

  return (
    <motion.div 
      className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-200 p-4 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-stretch justify-between">
        {/* Current Score */}
        <motion.div 
          className="flex-1"
          animate={celebrateScore ? {
            scale: [1, 1.1, 1],
            transition: { duration: 1, times: [0, 0.5, 1], repeat: 1 }
          } : {}}
        >
          <h3 className="text-lg font-bold text-blue-700 flex items-center">
            <Medal className="mr-2" size={18} />
            Current Score
          </h3>
          <div className="relative">
            <motion.p 
              className={`text-4xl font-extrabold tabular-nums ${
                celebrateScore ? 'text-indigo-600' : 'text-blue-700'
              }`}
              key={currentScore}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {currentScore}
            </motion.p>
            
            {/* Level indicator */}
            <span className="absolute -bottom-1 left-0 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {getScoreDescription()}
            </span>
          </div>
        </motion.div>

        {/* High Score */}
        <div className="flex-1 text-right relative">
          <div className="flex items-center justify-end">
            <Trophy
              size={18}
              className={`mr-2 ${isNewHighScore ? 'text-yellow-500' : 'text-blue-400'}`}
            />
            <h3 className="text-lg font-bold text-blue-700">High Score</h3>
          </div>
          <p
            className={`text-4xl font-extrabold tabular-nums ${
              isNewHighScore ? 'text-yellow-500' : 'text-blue-700'
            }`}
          >
            {isNewHighScore ? currentScore : highScore}
          </p>
          
          {/* New high score badge */}
          <AnimatePresence>
            {isNewHighScore && (
              <motion.span 
                className="absolute -top-3 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 20 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 500, 
                  damping: 15,
                  delay: 0.5 
                }}
              >
                NEW!
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Expandable stats section */}
      <div className="mt-3 border-t border-blue-200 pt-2">
        <button 
          className="w-full flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 font-medium py-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>Hide Stats <ChevronUp size={16} className="ml-1" /></>
          ) : (
            <>Show Stats <ChevronDown size={16} className="ml-1" /></>
          )}
        </button>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 grid grid-cols-2 gap-3"
            >
              {/* Accuracy */}
              <div className="bg-white bg-opacity-60 rounded-lg p-3 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Award size={20} className={getAccuracyColor()} />
                </div>
                <div>
                  <div className="text-xs text-blue-700 font-medium">Accuracy</div>
                  <div className={`text-lg font-bold ${getAccuracyColor()}`}>{accuracy}%</div>
                </div>
              </div>
              
              {/* Streak */}
              <div className="bg-white bg-opacity-60 rounded-lg p-3 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Flame size={20} className={streak > 0 ? "text-amber-500" : "text-blue-400"} />
                </div>
                <div>
                  <div className="text-xs text-blue-700 font-medium">Streak</div>
                  <div className={`text-lg font-bold ${streak > 0 ? "text-amber-500" : "text-blue-500"}`}>
                    {streak}× {streak >= 3 ? "🔥" : ""}
                  </div>
                </div>
              </div>
              
              {/* Correct Answers */}
              <div className="bg-white bg-opacity-60 rounded-lg p-3 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Star size={20} className="text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs text-blue-700 font-medium">Correct Answers</div>
                  <div className="text-lg font-bold text-emerald-600">
                    {correctAnswers} / {totalQuestions}
                  </div>
                </div>
              </div>
              
              {/* Time Bonus */}
              <div className="bg-white bg-opacity-60 rounded-lg p-3 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Clock size={20} className="text-purple-500" />
                </div>
                <div>
                  <div className="text-xs text-blue-700 font-medium">Time Bonus</div>
                  <div className="text-lg font-bold text-purple-600">+{timeBonus}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      {(onReset || onShare) && (
        <div className="flex gap-2 mt-4">
          {onReset && (
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center bg-white"
              onClick={onReset}
            >
              <RotateCcw size={16} className="mr-2" />
              Reset
            </Button>
          )}
          {onShare && (
            <Button
              variant="primary"
              className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onShare}
            >
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Missing Flame icon definition
const Flame = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
  </svg>
);

export default ScoreBanner;
