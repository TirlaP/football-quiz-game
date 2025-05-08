import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trophy, Zap, Award, Shield, HelpCircle, Star, Flame, Sparkles, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Question } from '../../data/questions';

// Time limits by difficulty (in seconds)
const TIME_LIMITS = {
  easy: 20,
  medium: 30,
  hard: 45
};

// Points by difficulty
const BASE_POINTS = {
  easy: 10,
  medium: 20,
  hard: 30
};

// Time bonus multipliers
const TIME_BONUS_MULTIPLIER = 0.5; // Points per second remaining

// Streak bonuses (more generous to encourage longer streaks)
const STREAK_BONUS = {
  multiplier: (streak: number) => 1 + Math.min(streak * 0.15, 2), // Up to 3x multiplier at streak 20
  threshold: 3, // Streak count where bonus multiplier begins
};

// Chance of earning a power-up after a correct answer
const POWERUP_CHANCE = 0.3;

// Bonus point categories
const BONUS_CATEGORIES = {
  SPEED: 'SPEED',        // Fast answer
  STREAK: 'STREAK',      // Answer streak
  PERFECT: 'PERFECT',    // All answers correct
  DIFFICULTY: 'DIFFICULTY' // Hard question
};

interface QuestionCardProps {
  question: Question;
  streak: number;
  onAnswer: (answer: string, isCorrect: boolean, points: number, earnedPowerUp?: string) => void;
  powerUps: {
    fiftyFifty: boolean;
    extraTime: boolean;
    skipQuestion: boolean;
    hint?: boolean;
  };
  onUsePowerUp: (type: 'fiftyFifty' | 'extraTime' | 'skipQuestion' | 'hint') => void;
  className?: string;
  questionNumber?: number;
  totalQuestions?: number;
}

const QuestionCard = ({ 
  question, 
  streak = 0, 
  onAnswer, 
  powerUps = {
    fiftyFifty: false,
    extraTime: false,
    skipQuestion: false,
    hint: false
  },
  onUsePowerUp = () => {},
  className = '',
  questionNumber = 1,
  totalQuestions = 10
}: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMITS[question.difficulty]);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [extraTimeUsed, setExtraTimeUsed] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [bonuses, setBonuses] = useState<{type: string, amount: number}[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [earnedPowerUp, setEarnedPowerUp] = useState<string | null>(null);
  const [showBounce, setShowBounce] = useState(false);
  const [showUrgentTimer, setShowUrgentTimer] = useState(false);
  const [timerPulse, setTimerPulse] = useState(false);
  
  // References for animations
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Timer effect
  useEffect(() => {
    if (isAnswered || timeRemaining <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeRemaining(prev => prev - 0.1);
      
      // Add urgent animation when time is running low
      if (timeRemaining < 8 && timeRemaining > 7.9) {
        setShowUrgentTimer(true);
      }
      
      // Add pulse effect when very low on time
      if (timeRemaining < 5) {
        setTimerPulse(prev => !prev);
      }
      
      if (timeRemaining <= 0) {
        handleTimeout();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [timeRemaining, isAnswered]);
  
  // Entrance animation on component mount
  useEffect(() => {
    const bounceTimer = setTimeout(() => {
      setShowBounce(true);
    }, 100);
    
    return () => clearTimeout(bounceTimer);
  }, []);
  
  // Handle timeout
  const handleTimeout = () => {
    setIsAnswered(true);
    setResult('incorrect');
    setPoints(0);
    
    // Shake the card when time runs out
    if (cardRef.current) {
      cardRef.current.classList.add('shake-animation');
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.classList.remove('shake-animation');
        }
      }, 500);
    }
    
    // Delay to show the correct answer
    setTimeout(() => {
      onAnswer('', false, 0);
    }, 2000);
  };
  
  // Select an answer
  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    
    // Adding a little "thinking" delay to create anticipation
    // This simulates the player pausing to think before submitting
    if (Math.random() > 0.7) {
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
      }, 400 + Math.random() * 300);
    }
  };
  
  // Generate a random power-up when correct
  const generateRandomPowerUp = (): string | null => {
    if (Math.random() > POWERUP_CHANCE) return null;
    
    const options = ['fiftyFifty', 'extraTime', 'skipQuestion', 'hint'];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  // Submit answer
  const handleSubmit = () => {
    if (!selectedAnswer || isAnswered || isThinking) return;
    
    const isCorrect = selectedAnswer === question.correctAnswer;
    setIsAnswered(true);
    setResult(isCorrect ? 'correct' : 'incorrect');
    
    // Calculate points
    let earnedPoints = 0;
    const calculatedBonuses: {type: string, amount: number}[] = [];
    
    if (isCorrect) {
      // Base points by difficulty
      const basePoints = BASE_POINTS[question.difficulty];
      calculatedBonuses.push({ type: 'BASE', amount: basePoints });
      
      // Time bonus (more points for faster answers)
      const timePercentage = timeRemaining / TIME_LIMITS[question.difficulty];
      let timeBonus = Math.round(timeRemaining * TIME_BONUS_MULTIPLIER);
      
      // Extra speed bonus if very fast (top 25% of time)
      if (timePercentage > 0.75) {
        timeBonus = Math.round(timeBonus * 1.5);
        calculatedBonuses.push({ 
          type: BONUS_CATEGORIES.SPEED, 
          amount: timeBonus 
        });
      } else if (timeBonus > 0) {
        calculatedBonuses.push({ type: 'TIME', amount: timeBonus });
      }
      
      // Streak multiplier (15% per streak, up to 3x)
      let streakPoints = 0;
      if (streak >= STREAK_BONUS.threshold) {
        const multiplier = STREAK_BONUS.multiplier(streak);
        streakPoints = Math.round((basePoints + timeBonus) * (multiplier - 1));
        calculatedBonuses.push({ 
          type: BONUS_CATEGORIES.STREAK, 
          amount: streakPoints 
        });
      }
      
      // Difficulty bonus for hard questions
      let difficultyBonus = 0;
      if (question.difficulty === 'hard') {
        difficultyBonus = 15;
        calculatedBonuses.push({ 
          type: BONUS_CATEGORIES.DIFFICULTY, 
          amount: difficultyBonus 
        });
      }
      
      // Final calculation
      earnedPoints = basePoints + timeBonus + streakPoints + difficultyBonus;
      
      // Set all bonuses for display
      setBonuses(calculatedBonuses);
      setPoints(earnedPoints);
      
      // Chance to earn a power-up
      const newPowerUp = generateRandomPowerUp();
      if (newPowerUp) {
        setEarnedPowerUp(newPowerUp);
      }
      
      // Celebrate with confetti for streaks or perfect scores
      if (streak >= 2) {
        generateConfetti(streak);
      }
    }
    
    // Delay to show the result
    setTimeout(() => {
      onAnswer(selectedAnswer, isCorrect, earnedPoints, earnedPowerUp || undefined);
    }, 2500);
  };
  
  // Use 50/50 power-up
  const handleFiftyFifty = () => {
    if (isAnswered || eliminatedOptions.length > 0 || !powerUps.fiftyFifty) return;
    
    // Get wrong answers
    const wrongAnswers = question.options.filter(option => option !== question.correctAnswer);
    
    // Randomly select two wrong answers to eliminate
    const shuffled = [...wrongAnswers].sort(() => 0.5 - Math.random());
    const toEliminate = shuffled.slice(0, 2);
    
    // Animation for eliminated options
    toEliminate.forEach((option, index) => {
      setTimeout(() => {
        setEliminatedOptions(prev => [...prev, option]);
      }, index * 300);
    });
    
    onUsePowerUp('fiftyFifty');
  };
  
  // Use extra time power-up
  const handleExtraTime = () => {
    if (isAnswered || extraTimeUsed || !powerUps.extraTime) return;
    
    // Add 15 seconds with a nice animation
    setExtraTimeUsed(true);
    
    // Visual feedback of time being added
    const element = document.createElement('div');
    element.className = 'time-bonus-indicator';
    element.textContent = '+15s';
    if (cardRef.current) {
      cardRef.current.appendChild(element);
      setTimeout(() => {
        element.remove();
      }, 1500);
    }
    
    setTimeRemaining(prev => prev + 15);
    onUsePowerUp('extraTime');
  };
  
  // Use hint power-up
  const handleHint = () => {
    if (isAnswered || hintUsed || !powerUps.hint) return;
    
    // Generate a hint based on the question
    let hintText = '';
    
    if (question.correctAnswer) {
      // Just give a generic clue about the first letter or length
      const firstLetter = question.correctAnswer[0].toUpperCase();
      const answerLength = question.correctAnswer.length;
      
      // 50-50 chance of giving first letter or length hint
      if (Math.random() > 0.5) {
        hintText = `The correct answer starts with the letter "${firstLetter}"`;
      } else {
        hintText = `The correct answer is ${answerLength} characters long`;
      }
    } else {
      hintText = "Think about recent football tournaments and players.";
    }
    
    setHint(hintText);
    setHintUsed(true);
    onUsePowerUp('hint');
  };
  
  // Use skip question power-up
  const handleSkipQuestion = () => {
    if (isAnswered || !powerUps.skipQuestion) return;
    
    onUsePowerUp('skipQuestion');
    onAnswer('', false, 0);
  };
  
  // Generate confetti effect
  const generateConfetti = (streakCount: number) => {
    // More elaborate confetti for higher streaks
    const intensity = Math.min(streakCount * 0.1, 1);
    
    confetti({
      particleCount: 50 + streakCount * 10,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#3B82F6', '#F59E0B'],
      scalar: 1 + intensity,
      disableForReducedMotion: true
    });
  };
  
  // Get the button variant based on answer selection and correctness
  const getButtonVariant = (option: string) => {
    const baseClasses = "answer-option relative overflow-hidden transition-all duration-200 ";
    
    if (eliminatedOptions.includes(option)) {
      return baseClasses + "opacity-30 line-through bg-gray-100 border-gray-300 text-gray-400";
    }
    
    if (!isAnswered) {
      return baseClasses + (selectedAnswer === option 
        ? "bg-blue-100 border-blue-500 text-blue-900 shadow-md font-medium" 
        : "bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50");
    }
    
    if (option === question.correctAnswer) {
      return baseClasses + "bg-emerald-100 border-emerald-500 text-emerald-900 font-medium";
    }
    
    if (selectedAnswer === option) {
      return baseClasses + "bg-red-100 border-red-500 text-red-900 font-medium";
    }
    
    return baseClasses + "opacity-50 bg-white border-gray-300 text-gray-700";
  };
  
  // Time percentage for progress bar
  const timePercentage = Math.max(0, (timeRemaining / TIME_LIMITS[question.difficulty]) * 100);
  
  // Calculate urgency color for timer
  const getTimerColor = () => {
    if (timePercentage > 60) return 'bg-emerald-500';
    if (timePercentage > 30) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Get animation class for timer
  const getTimerAnimationClass = () => {
    if (timePercentage <= 20) return 'animate-pulse';
    return '';
  };
  
  return (
    <motion.div 
      ref={cardRef}
      className={`quiz-card relative overflow-hidden rounded-xl border-2 border-crowd-200 bg-white shadow-lg ${className} ${showUrgentTimer ? 'urgent-timer' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: showBounce ? [1, 1.02, 1] : 1,
        transition: { 
          duration: 0.5,
          scale: { duration: 0.5, times: [0, 0.5, 1] }
        }
      }}
    >
      {/* Question Progress Indicator */}
      <div className="flex justify-between items-center px-4 pt-3">
        <div className="text-xs text-crowd-500 font-medium">
          Question {questionNumber} of {totalQuestions}
        </div>
        
        <div className="flex h-1.5 w-24 rounded-full bg-crowd-100 overflow-hidden">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div 
              key={i} 
              className={`h-full flex-1 ${
                i + 1 < questionNumber 
                  ? 'bg-emerald-500' 
                  : i + 1 === questionNumber 
                    ? 'bg-blue-500' 
                    : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Header with difficulty badge and timer */}
      <div className="flex justify-between items-start px-4 pt-3 pb-2">
        <div className="flex items-center">
          <span className={`badge py-1 px-2 text-xs font-semibold rounded text-white ${
            question.difficulty === 'easy' 
              ? 'bg-emerald-500' 
              : question.difficulty === 'medium' 
                ? 'bg-amber-500' 
                : 'bg-red-500'
          }`}>
            {question.difficulty.toUpperCase()}
          </span>
          
          {streak >= 2 && (
            <motion.div 
              className="ml-3 streak-counter flex items-center bg-champion-50 text-champion-700 px-2 py-0.5 rounded-full text-xs font-semibold border border-champion-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Flame className="streak-counter-icon mr-1" size={14} />
              {streak}× streak
            </motion.div>
          )}
        </div>
        
        <motion.div 
          className={`flex items-center ${
            timeRemaining < 10 
              ? `text-red-500 ${timerPulse ? 'scale-110' : 'scale-100'}` 
              : 'text-crowd-700'
          }`}
          animate={{ scale: timerPulse ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Clock size={16} className="mr-1" />
          <span className={`font-medium tabular-nums ${timeRemaining < 10 ? 'font-bold' : ''}`}>
            {Math.ceil(timeRemaining)}s
          </span>
        </motion.div>
      </div>
      
      {/* Timer bar */}
      <div className="timer-bar px-4 mb-4">
        <div className="h-2 w-full bg-crowd-100 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${getTimerColor()} ${getTimerAnimationClass()}`}
            initial={{ width: '100%' }}
            animate={{ width: `${timePercentage}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
      
      {/* Question text */}
      <div className="px-5">
        <h3 className="text-xl font-bold mb-5 text-crowd-900">{question.text}</h3>
      </div>
      
      {/* Hint display if hint is used */}
      <AnimatePresence>
        {hint && (
          <motion.div
            className="mx-5 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <HelpCircle size={18} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700">{hint}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Answer options */}
      <div className="space-y-3 mb-6 px-5">
        <AnimatePresence>
          {question.options.map((option, index) => (
            !eliminatedOptions.includes(option) && (
              <motion.button
                key={option}
                className={`${getButtonVariant(option)} w-full py-3 px-4 text-left rounded-lg border-2 font-medium`}
                onClick={() => handleSelectAnswer(option)}
                disabled={isAnswered || eliminatedOptions.includes(option) || isThinking}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                whileHover={!isAnswered ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
                whileTap={!isAnswered ? { scale: 0.98, transition: { duration: 0.1 } } : {}}
              >
                {/* Option letter indicator */}
                <span className="inline-block w-6 h-6 mr-3 rounded-full bg-gray-100 text-gray-800 text-center text-sm leading-6 font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                
                {option}
                
                {/* Show check/x mark for answered questions */}
                {isAnswered && (
                  <motion.span 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    {option === question.correctAnswer ? (
                      <Sparkles size={24} className="text-emerald-500" />
                    ) : selectedAnswer === option ? (
                      <span className="text-red-500 text-2xl">✗</span>
                    ) : null}
                  </motion.span>
                )}
                
                {/* Selected indicator */}
                {selectedAnswer === option && !isAnswered && (
                  <motion.span 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  </motion.span>
                )}
              </motion.button>
            )
          ))}
        </AnimatePresence>
      </div>
      
      {/* Power-ups row */}
      <div className="flex justify-between items-center mb-5 px-5">
        <div className="flex space-x-3">
          <motion.button 
            className={`power-up-btn p-2 rounded-lg bg-crowd-50 border border-crowd-200 text-crowd-700 transition-all ${
              !powerUps.fiftyFifty || isAnswered || eliminatedOptions.length > 0
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:bg-crowd-100 hover:text-crowd-900'
            }`}
            onClick={handleFiftyFifty}
            disabled={!powerUps.fiftyFifty || isAnswered || eliminatedOptions.length > 0}
            title="50/50: Remove two incorrect answers"
            whileHover={powerUps.fiftyFifty && !isAnswered && eliminatedOptions.length === 0 ? { scale: 1.1 } : {}}
            whileTap={powerUps.fiftyFifty && !isAnswered && eliminatedOptions.length === 0 ? { scale: 0.9 } : {}}
          >
            <Shield size={20} />
          </motion.button>
          
          <motion.button 
            className={`power-up-btn p-2 rounded-lg bg-crowd-50 border border-crowd-200 text-crowd-700 transition-all ${
              !powerUps.extraTime || isAnswered || extraTimeUsed
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:bg-crowd-100 hover:text-crowd-900'
            }`}
            onClick={handleExtraTime}
            disabled={!powerUps.extraTime || isAnswered || extraTimeUsed}
            title="Extra Time: Add 15 seconds"
            whileHover={powerUps.extraTime && !isAnswered && !extraTimeUsed ? { scale: 1.1 } : {}}
            whileTap={powerUps.extraTime && !isAnswered && !extraTimeUsed ? { scale: 0.9 } : {}}
          >
            <Clock size={20} />
          </motion.button>
          
          <motion.button 
            className={`power-up-btn p-2 rounded-lg bg-crowd-50 border border-crowd-200 text-crowd-700 transition-all ${
              !powerUps.skipQuestion || isAnswered
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:bg-crowd-100 hover:text-crowd-900'
            }`}
            onClick={handleSkipQuestion}
            disabled={!powerUps.skipQuestion || isAnswered}
            title="Skip: Move to next question"
            whileHover={powerUps.skipQuestion && !isAnswered ? { scale: 1.1 } : {}}
            whileTap={powerUps.skipQuestion && !isAnswered ? { scale: 0.9 } : {}}
          >
            <Zap size={20} />
          </motion.button>
          
          <motion.button 
            className={`power-up-btn p-2 rounded-lg bg-crowd-50 border border-crowd-200 text-crowd-700 transition-all ${
              !powerUps.hint || isAnswered || hintUsed
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:bg-crowd-100 hover:text-crowd-900'
            }`}
            onClick={handleHint}
            disabled={!powerUps.hint || isAnswered || hintUsed}
            title="Hint: Get a clue about the answer"
            whileHover={powerUps.hint && !isAnswered && !hintUsed ? { scale: 1.1 } : {}}
            whileTap={powerUps.hint && !isAnswered && !hintUsed ? { scale: 0.9 } : {}}
          >
            <HelpCircle size={20} />
          </motion.button>
        </div>
        
        {isAnswered && result === 'correct' && (
          <motion.div 
            className="flex items-center text-champion-500 font-bold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Award size={20} className="mr-1" />
            +{points} pts
          </motion.div>
        )}
      </div>
      
      {/* Submit button or next button */}
      <div className="px-5 pb-5">
        {!isAnswered ? (
          <motion.button 
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
              !selectedAnswer || isThinking
                ? 'bg-blue-300 text-white cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
            onClick={handleSubmit}
            disabled={!selectedAnswer || isThinking}
            whileHover={selectedAnswer && !isThinking ? { scale: 1.03 } : {}}
            whileTap={selectedAnswer && !isThinking ? { scale: 0.97 } : {}}
          >
            {isThinking ? (
              <span className="flex items-center justify-center">
                <span className="animate-pulse mr-2">Thinking</span>
                <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>.</span>
              </span>
            ) : (
              'Submit Answer'
            )}
          </motion.button>
        ) : (
          <button 
            className="btn-secondary w-full py-3 px-4 mt-3 rounded-lg font-semibold bg-crowd-100 hover:bg-crowd-200 text-crowd-800 transition-all"
            onClick={() => onAnswer(selectedAnswer || '', result === 'correct', points)}
          >
            Next Question
          </button>
        )}
      </div>
      
      {/* Result message with point breakdown */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.4 }}
            className={`
              mx-5 mb-5 p-4 rounded-lg font-bold
              ${result === 'correct' 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border border-red-200 text-red-800'}
            `}
          >
            {result === 'correct' ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xl flex items-center">
                    <Sparkles size={20} className="mr-2 text-emerald-500" />
                    Correct!
                  </span>
                  <span className="text-xl font-bold text-champion-500">+{points}</span>
                </div>
                
                {/* Points breakdown */}
                <div className="mt-3 space-y-1 text-sm font-normal">
                  {bonuses.map((bonus, index) => (
                    <motion.div 
                      key={index}
                      className="flex justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <span>
                        {bonus.type === 'BASE' && 'Base score'}
                        {bonus.type === 'TIME' && 'Time bonus'}
                        {bonus.type === BONUS_CATEGORIES.SPEED && 'Speed bonus'}
                        {bonus.type === BONUS_CATEGORIES.STREAK && `Streak bonus (${streak}×)`}
                        {bonus.type === BONUS_CATEGORIES.DIFFICULTY && 'Hard question bonus'}
                        {bonus.type === BONUS_CATEGORIES.PERFECT && 'Perfect score'}
                      </span>
                      <span className="font-semibold">+{bonus.amount}</span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Earned powerup */}
                {earnedPowerUp && (
                  <motion.div 
                    className="mt-3 flex items-center justify-center bg-champion-100 border border-champion-200 text-champion-800 p-2 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    <Gift size={18} className="mr-2 text-champion-500" />
                    <span className="font-medium">
                      You earned a 
                      {earnedPowerUp === 'fiftyFifty' && " 50/50 power-up!"}
                      {earnedPowerUp === 'extraTime' && " Time Boost power-up!"}
                      {earnedPowerUp === 'skipQuestion' && " Skip power-up!"}
                      {earnedPowerUp === 'hint' && " Hint power-up!"}
                    </span>
                  </motion.div>
                )}
              </>
            ) : (
              <>
                <div className="text-xl mb-2">Incorrect</div>
                <p className="text-sm font-normal">
                  The correct answer is: <span className="font-medium">{question.correctAnswer}</span>
                </p>
                {streak >= 2 && (
                  <p className="text-sm font-normal mt-2">
                    Your streak of {streak} has ended.
                  </p>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* CSS for animations */}
      <style jsx>{`
        .shake-animation {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        
        .time-bonus-indicator {
          position: absolute;
          top: 40px;
          right: 30px;
          color: #10B981;
          font-weight: bold;
          font-size: 1.2rem;
          animation: float-up 1.5s ease-out forwards;
          z-index: 10;
        }
        
        @keyframes float-up {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        
        .urgent-timer {
          animation: pulse-border 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse-border {
          0%, 100% { border-color: rgb(239, 68, 68); }
          50% { border-color: rgba(239, 68, 68, 0.5); }
        }
      `}</style>
    </motion.div>
  );
};

export default QuestionCard;