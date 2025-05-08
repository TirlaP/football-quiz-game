import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Grid3X3, Award, XCircle, CheckCircle, Flag, Star, Gift } from 'lucide-react';
import { useUser } from '../context/UserContext';

const LandingPage = () => {
  const { user, setPlayerName } = useUser();
  const [name, setName] = useState(user.playerName || '');
  const [showNameInput, setShowNameInput] = useState(!user.playerName);
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievementAnimation, setAchievementAnimation] = useState(false);
  const navigate = useNavigate();

  // Mock achievements - in a real app, this would be stored in the user context
  const achievements = [
    { id: 'first_game', title: 'First Kick', description: 'Play your first game', unlocked: true, icon: <Flag size={24} className="text-yellow-500" /> },
    { id: 'bingo_win', title: 'Bingo Champion', description: 'Get your first Bingo', unlocked: user.bingo.highScore > 0, icon: <CheckCircle size={24} className="text-green-500" /> },
    { id: 'tictactoe_win', title: 'Tactical Genius', description: 'Win a Tic Tac Toe game', unlocked: user.ticTacToe.highScore > 0, icon: <Trophy size={24} className="text-blue-500" /> },
    { id: 'high_score', title: 'World Cup Winner', description: 'Score over 300 points in one game', unlocked: user.bingo.highScore > 300 || user.ticTacToe.highScore > 300, icon: <Star size={24} className="text-yellow-500" /> },
    { id: 'dedication', title: 'Season Ticket', description: 'Play 5 games', unlocked: (user.ticTacToe.history?.length || 0) >= 5, icon: <Gift size={24} className="text-purple-500" /> },
  ];

  // Fake stats for demo purposes - would be calculated from real game data in a full app
  const stats = {
    totalGamesPlayed: (user.ticTacToe.history?.length || 0) + 1,
    correctAnswers: 24,
    accuracy: '68%',
    totalPoints: user.bingo.highScore + user.ticTacToe.highScore,
    currentStreak: 0,
    bestStreak: 5
  };

  const handleStartGame = (game: 'bingo' | 'tictactoe') => {
    // Save name if changed
    if (name && name !== user.playerName) {
      setPlayerName(name);
    }
    
    // Set achievement animation for next visit
    setAchievementAnimation(true);
    localStorage.setItem('showAchievement', 'true');
    
    // Navigate to selected game
    navigate(`/${game}`);
  };

  // Check for pending achievement notifications
  useEffect(() => {
    const pendingAchievement = localStorage.getItem('showAchievement');
    if (pendingAchievement === 'true' && user.playerName) {
      // Clear flag
      localStorage.removeItem('showAchievement');
      
      // Show achievement notification after a delay
      setTimeout(() => {
        setAchievementAnimation(true);
      }, 1500);
    }
  }, [user.playerName]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: { 
      y: [-5, 5, -5], 
      transition: { 
        duration: 3, 
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      {/* Achievement unlocked notification */}
      <AnimatePresence>
        {achievementAnimation && (
          <motion.div 
            className="fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-3 z-50"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-white rounded-full p-2">
              <Trophy size={24} className="text-yellow-500" />
            </div>
            <div>
              <h3 className="font-bold">Achievement Unlocked!</h3>
              <p className="text-sm opacity-90">First Kick</p>
            </div>
            <button 
              className="ml-2 text-white opacity-80 hover:opacity-100"
              onClick={() => setAchievementAnimation(false)}
            >
              <XCircle size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left sidebar - Player stats & achievements */}
        {user.playerName && !showNameInput && (
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg overflow-hidden md:col-span-1"
          >
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-4 text-white">
              <h2 className="text-xl font-bold">Player Profile</h2>
            </div>
            
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 rounded-full p-2">
                  <Trophy size={24} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user.playerName}</h3>
                  <p className="text-sm text-gray-500">Football Expert</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Games Played</span>
                  <span className="font-medium">{stats.totalGamesPlayed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Correct Answers</span>
                  <span className="font-medium">{stats.correctAnswers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-medium">{stats.accuracy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Points</span>
                  <span className="font-medium text-yellow-600">{stats.totalPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Streak</span>
                  <span className="font-medium">{stats.bestStreak}x</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => setShowAchievements(!showAchievements)}
                  className="w-full text-center text-blue-500 hover:text-blue-600 font-medium"
                >
                  {showAchievements ? 'Hide Achievements' : 'Show Achievements'}
                </button>
                
                <AnimatePresence>
                  {showAchievements && (
                    <motion.div 
                      className="mt-4 space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {achievements.map(achievement => (
                        <div 
                          key={achievement.id}
                          className={`flex items-center p-2 rounded-lg ${
                            achievement.unlocked 
                              ? 'bg-green-50 text-green-800' 
                              : 'bg-gray-50 text-gray-400'
                          }`}
                        >
                          <div className="mr-3 opacity-90">
                            {achievement.unlocked ? achievement.icon : <Award size={24} className="text-gray-300" />}
                          </div>
                          <div>
                            <div className="font-medium">{achievement.title}</div>
                            <div className="text-xs opacity-80">{achievement.description}</div>
                          </div>
                          {achievement.unlocked && (
                            <CheckCircle size={16} className="ml-auto text-green-500" />
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Center panel - Main content */}
        <motion.div 
          variants={itemVariants}
          className={`bg-white rounded-xl shadow-lg overflow-hidden ${user.playerName && !showNameInput ? 'md:col-span-2' : 'md:col-span-3'}`}
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
            <motion.div
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              className="mx-auto max-w-sm"
            >
              <h1 className="text-4xl font-extrabold text-center mb-2">Football Quiz Game</h1>
              <p className="text-center text-green-100">Test your football knowledge with two fun game modes!</p>
            </motion.div>
          </div>

          <div className="p-6">
            {showNameInput ? (
              <motion.div variants={itemVariants} className="max-w-sm mx-auto">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Enter your name to start playing</label>
                  <input
                    type="text"
                    placeholder="Your name here"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                
                <motion.button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!name}
                  onClick={() => {
                    if (name) {
                      setPlayerName(name);
                      setShowNameInput(false);
                    }
                  }}
                  whileHover={name ? { scale: 1.02 } : {}}
                  whileTap={name ? { scale: 0.98 } : {}}
                >
                  Let's Play!
                </motion.button>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold mb-6 text-center">Choose a Game Mode</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <motion.div 
                    className="bg-white border-2 border-green-200 hover:border-green-500 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:scale-103"
                    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  >
                    <div className="bg-green-100 p-4 flex justify-center">
                      <div className="bg-white rounded-full p-3 shadow-md">
                        <Trophy size={48} className="text-green-500" />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-center">Football Bingo</h3>
                      <p className="text-gray-600 mb-4 text-center">Get 5 in a row to score bingo points!</p>
                      
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                          <span className="text-sm">5×5 grid of football questions</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                          <span className="text-sm">Special bonus cells for extra points</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                          <span className="text-sm">Get BINGO to trigger big rewards</span>
                        </li>
                      </ul>
                      
                      <div className="text-center">
                        <motion.button
                          onClick={() => handleStartGame('bingo')}
                          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Play Bingo
                        </motion.button>
                        {user.bingo.highScore > 0 && (
                          <div className="mt-2 text-sm text-center">
                            <span className="text-gray-500">High Score:</span>
                            <span className="font-medium text-yellow-500 ml-1">{user.bingo.highScore} points</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-white border-2 border-blue-200 hover:border-blue-500 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:scale-103"
                    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  >
                    <div className="bg-blue-100 p-4 flex justify-center">
                      <div className="bg-white rounded-full p-3 shadow-md">
                        <Grid3X3 size={48} className="text-blue-500" />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-center">Tic Tac Toe</h3>
                      <p className="text-gray-600 mb-4 text-center">Answer questions to claim cells!</p>
                      
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <CheckCircle size={16} className="text-blue-500 mr-2" />
                          <span className="text-sm">Play against AI with adjustable difficulty</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle size={16} className="text-blue-500 mr-2" />
                          <span className="text-sm">Collect power-ups to gain advantages</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle size={16} className="text-blue-500 mr-2" />
                          <span className="text-sm">Maintain streaks for bonus points</span>
                        </li>
                      </ul>
                      
                      <div className="text-center">
                        <motion.button
                          onClick={() => handleStartGame('tictactoe')}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Play Tic Tac Toe
                        </motion.button>
                        {user.ticTacToe.highScore > 0 && (
                          <div className="mt-2 text-sm text-center">
                            <span className="text-gray-500">High Score:</span>
                            <span className="font-medium text-yellow-500 ml-1">{user.ticTacToe.highScore} points</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;