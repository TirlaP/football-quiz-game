import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Medal, Gift, ChevronsRight, Award, Lock } from 'lucide-react';

// Achievement data structure
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  total?: number;
  rewardPoints?: number;
  rewardPowerUp?: string;
  tier?: 'bronze' | 'silver' | 'gold';
  category?: 'score' | 'streak' | 'accuracy' | 'games' | 'special';
  dateUnlocked?: string;
}

interface RewardsPanelProps {
  achievements: Achievement[];
  currentPoints: number;
  onClaimReward?: (id: string, type: 'points' | 'powerUp', value: number | string) => void;
  className?: string;
}

const RewardsPanel = ({
  achievements,
  currentPoints,
  onClaimReward,
  className = '',
}: RewardsPanelProps) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'rewards'>('achievements');
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [claimAnimation, setClaimAnimation] = useState<string | null>(null);
  
  // Filter achievements based on criteria
  const filteredAchievements = filter 
    ? achievements.filter(a => a.category === filter) 
    : achievements;
  
  // Get unclaimed rewards
  const unclaimedRewards = achievements.filter(a => 
    a.unlocked && 
    (a.rewardPoints || a.rewardPowerUp) && 
    !a.claimed
  );
  
  // Get completion percentage
  const completionPercentage = Math.round(
    (achievements.filter(a => a.unlocked).length / achievements.length) * 100
  );
  
  // Handle reward claim
  const handleClaimReward = (achievement: Achievement) => {
    if (!achievement.unlocked || !onClaimReward) return;
    
    setClaimAnimation(achievement.id);
    
    setTimeout(() => {
      if (achievement.rewardPoints) {
        onClaimReward(achievement.id, 'points', achievement.rewardPoints);
      } else if (achievement.rewardPowerUp) {
        onClaimReward(achievement.id, 'powerUp', achievement.rewardPowerUp);
      }
      setClaimAnimation(null);
    }, 1000);
  };
  
  // Handle achievement selection
  const handleSelectAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };
  
  // Close detail view
  const handleCloseDetail = () => {
    setSelectedAchievement(null);
  };
  
  // Get tier color for achievement
  const getTierColor = (tier?: 'bronze' | 'silver' | 'gold') => {
    switch (tier) {
      case 'gold':
        return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'silver':
        return 'text-slate-400 bg-slate-50 border-slate-200';
      case 'bronze':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };
  
  // Get category label
  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case 'score':
        return 'Scoring';
      case 'streak':
        return 'Streaks';
      case 'accuracy':
        return 'Accuracy';
      case 'games':
        return 'Games Played';
      case 'special':
        return 'Special';
      default:
        return 'General';
    }
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-crowd-100 overflow-hidden ${className}`}>
      {/* Tabs */}
      <div className="flex border-b border-crowd-200">
        <button
          className={`flex-1 py-3 px-4 font-medium text-center text-sm ${
            activeTab === 'achievements' 
              ? 'bg-pitch-50 text-pitch-700 border-b-2 border-pitch-500' 
              : 'text-crowd-600 hover:bg-crowd-50'
          }`}
          onClick={() => setActiveTab('achievements')}
        >
          <Trophy size={16} className="inline-block mr-1" />
          Achievements
        </button>
        <button
          className={`flex-1 py-3 px-4 font-medium text-center text-sm ${
            activeTab === 'rewards' 
              ? 'bg-jersey-50 text-jersey-700 border-b-2 border-jersey-500' 
              : 'text-crowd-600 hover:bg-crowd-50'
          }`}
          onClick={() => setActiveTab('rewards')}
        >
          <Gift size={16} className="inline-block mr-1" />
          Rewards
          {unclaimedRewards.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white">
              {unclaimedRewards.length}
            </span>
          )}
        </button>
      </div>
      
      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Progress header */}
            <div className="p-4 bg-crowd-50 border-b border-crowd-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-crowd-800">Your Progress</h3>
                <span className="text-crowd-800 font-medium">{completionPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-crowd-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pitch-500 to-jersey-500 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-crowd-600">
                {achievements.filter(a => a.unlocked).length} of {achievements.length} achievements unlocked
              </div>
            </div>
            
            {/* Filters */}
            <div className="p-3 flex overflow-x-auto no-scrollbar border-b border-crowd-100">
              <button
                className={`mr-2 py-1 px-3 text-xs rounded-full whitespace-nowrap ${
                  !filter ? 'bg-pitch-500 text-white' : 'bg-crowd-100 text-crowd-600 hover:bg-crowd-200'
                }`}
                onClick={() => setFilter(null)}
              >
                All
              </button>
              
              {['score', 'streak', 'accuracy', 'games', 'special'].map(category => (
                <button
                  key={category}
                  className={`mr-2 py-1 px-3 text-xs rounded-full whitespace-nowrap ${
                    filter === category ? 'bg-jersey-500 text-white' : 'bg-crowd-100 text-crowd-600 hover:bg-crowd-200'
                  }`}
                  onClick={() => setFilter(category)}
                >
                  {getCategoryLabel(category)}
                </button>
              ))}
            </div>
            
            {/* Achievement list */}
            {!selectedAchievement ? (
              <div className="max-h-80 overflow-y-auto p-2 space-y-2">
                {filteredAchievements.length === 0 ? (
                  <div className="p-4 text-center text-crowd-500">
                    No achievements in this category yet.
                  </div>
                ) : (
                  filteredAchievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      className={`p-3 rounded-lg border flex items-center cursor-pointer ${
                        achievement.unlocked 
                          ? `${getTierColor(achievement.tier)} hover:shadow-md` 
                          : 'bg-crowd-50 border-crowd-200 text-crowd-400'
                      }`}
                      onClick={() => handleSelectAchievement(achievement)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-2 rounded-lg mr-3 text-${achievement.unlocked ? 'white' : 'crowd-400'} ${
                        achievement.unlocked 
                          ? (achievement.tier === 'gold' 
                              ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
                              : achievement.tier === 'silver' 
                                ? 'bg-gradient-to-br from-slate-300 to-slate-500'
                                : achievement.tier === 'bronze'
                                  ? 'bg-gradient-to-br from-amber-500 to-amber-700'
                                  : 'bg-gradient-to-br from-blue-400 to-blue-600')
                          : 'bg-crowd-200'
                      }`}>
                        {achievement.unlocked ? achievement.icon : <Lock size={20} />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium">
                          {achievement.title}
                          {achievement.rewardPoints && achievement.unlocked && (
                            <span className="ml-2 text-xs bg-champion-100 text-champion-700 px-1.5 py-0.5 rounded-full">
                              +{achievement.rewardPoints}
                            </span>
                          )}
                        </div>
                        <div className="text-xs opacity-80">{achievement.description}</div>
                        
                        {/* Progress bar for in-progress achievements */}
                        {achievement.progress !== undefined && achievement.total && !achievement.unlocked && (
                          <div className="mt-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{achievement.progress} / {achievement.total}</span>
                              <span>{Math.round((achievement.progress / achievement.total) * 100)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-crowd-200 rounded-full">
                              <div 
                                className="h-full bg-jersey-500 rounded-full"
                                style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <ChevronsRight size={16} className="text-crowd-400" />
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              // Achievement detail view
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4"
              >
                <button 
                  className="mb-3 text-crowd-600 hover:text-crowd-800 text-sm flex items-center"
                  onClick={handleCloseDetail}
                >
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to list
                </button>
                
                <div className={`rounded-lg border p-5 ${getTierColor(selectedAchievement.tier)}`}>
                  <div className="flex justify-between items-start">
                    <div className={`p-4 rounded-lg text-white ${
                      selectedAchievement.unlocked 
                        ? (selectedAchievement.tier === 'gold' 
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
                            : selectedAchievement.tier === 'silver' 
                              ? 'bg-gradient-to-br from-slate-300 to-slate-500'
                              : selectedAchievement.tier === 'bronze'
                                ? 'bg-gradient-to-br from-amber-500 to-amber-700'
                                : 'bg-gradient-to-br from-blue-400 to-blue-600')
                        : 'bg-crowd-200'
                    }`}>
                      {selectedAchievement.icon}
                    </div>
                    
                    <div className="text-xs bg-crowd-100 text-crowd-600 px-2 py-1 rounded-full">
                      {getCategoryLabel(selectedAchievement.category)}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mt-4">{selectedAchievement.title}</h3>
                  <p className="text-crowd-600 mt-1">{selectedAchievement.description}</p>
                  
                  {selectedAchievement.dateUnlocked && selectedAchievement.unlocked && (
                    <div className="mt-4 text-sm text-crowd-500">
                      Unlocked on {selectedAchievement.dateUnlocked}
                    </div>
                  )}
                  
                  {/* Progress bar for in-progress achievements */}
                  {selectedAchievement.progress !== undefined && selectedAchievement.total && !selectedAchievement.unlocked && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Progress</span>
                        <span>{Math.round((selectedAchievement.progress / selectedAchievement.total) * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-crowd-200 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-pitch-500 to-jersey-500 rounded-full"
                          style={{ width: `${(selectedAchievement.progress / selectedAchievement.total) * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 text-sm text-crowd-500">
                        {selectedAchievement.progress} / {selectedAchievement.total}
                      </div>
                    </div>
                  )}
                  
                  {/* Reward section */}
                  {(selectedAchievement.rewardPoints || selectedAchievement.rewardPowerUp) && (
                    <div className="mt-5 pt-4 border-t border-crowd-200">
                      <h4 className="font-medium text-crowd-700 mb-2">Rewards</h4>
                      
                      {selectedAchievement.rewardPoints && (
                        <div className="flex items-center mb-2">
                          <div className="p-1.5 rounded-full bg-champion-100 text-champion-600 mr-2">
                            <Star size={18} />
                          </div>
                          <span>{selectedAchievement.rewardPoints} points</span>
                        </div>
                      )}
                      
                      {selectedAchievement.rewardPowerUp && (
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-jersey-100 text-jersey-600 mr-2">
                            <Gift size={18} />
                          </div>
                          <span>{selectedAchievement.rewardPowerUp} power-up</span>
                        </div>
                      )}
                      
                      {selectedAchievement.unlocked && onClaimReward && !selectedAchievement.claimed && (
                        <button
                          className={`mt-3 w-full py-2 px-4 rounded-lg font-medium text-white 
                            ${claimAnimation === selectedAchievement.id 
                              ? 'bg-green-500 animate-pulse' 
                              : 'bg-jersey-500 hover:bg-jersey-600'
                            }`}
                          onClick={() => handleClaimReward(selectedAchievement)}
                          disabled={claimAnimation === selectedAchievement.id}
                        >
                          {claimAnimation === selectedAchievement.id ? 'Claiming...' : 'Claim Reward'}
                        </button>
                      )}
                      
                      {selectedAchievement.claimed && (
                        <div className="mt-3 text-center text-green-500 font-medium">
                          Reward claimed!
                        </div>
                      )}
                      
                      {!selectedAchievement.unlocked && (
                        <div className="mt-3 text-center text-crowd-500 text-sm">
                          Unlock this achievement to claim its rewards.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        
        {activeTab === 'rewards' && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4"
          >
            {/* Points summary */}
            <div className="bg-jersey-50 border border-jersey-200 rounded-lg p-4 mb-4">
              <div className="text-sm text-jersey-600 mb-1">Current Points</div>
              <div className="text-3xl font-bold text-jersey-700">{currentPoints}</div>
            </div>
            
            {/* Rewards list */}
            <h3 className="font-bold text-crowd-800 mb-3">Available Rewards</h3>
            
            <div className="space-y-3 mb-5">
              {unclaimedRewards.length === 0 ? (
                <div className="text-center p-4 bg-crowd-50 border border-crowd-100 rounded-lg text-crowd-500">
                  No unclaimed rewards available.
                </div>
              ) : (
                unclaimedRewards.map(reward => (
                  <motion.div
                    key={reward.id}
                    className={`p-3 rounded-lg border flex items-center ${
                      getTierColor(reward.tier)
                    } ${claimAnimation === reward.id ? 'animate-pulse' : ''}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`p-2 rounded-lg mr-3 text-white ${
                      reward.tier === 'gold' 
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
                        : reward.tier === 'silver' 
                          ? 'bg-gradient-to-br from-slate-300 to-slate-500'
                          : reward.tier === 'bronze'
                            ? 'bg-gradient-to-br from-amber-500 to-amber-700'
                            : 'bg-gradient-to-br from-blue-400 to-blue-600'
                    }`}>
                      {reward.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{reward.title}</div>
                      <div className="text-xs opacity-80">
                        {reward.rewardPoints ? `${reward.rewardPoints} points` : reward.rewardPowerUp}
                      </div>
                    </div>
                    
                    <button
                      className={`py-1.5 px-3 rounded-lg text-sm font-medium text-white ${
                        claimAnimation === reward.id 
                          ? 'bg-green-500' 
                          : 'bg-jersey-500 hover:bg-jersey-600'
                      }`}
                      onClick={() => handleClaimReward(reward)}
                      disabled={claimAnimation === reward.id}
                    >
                      {claimAnimation === reward.id ? 'Claiming...' : 'Claim'}
                    </button>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Point shop */}
            <h3 className="font-bold text-crowd-800 mb-3">Points Shop</h3>
            
            <div className="space-y-3">
              {/* Power-up items that can be purchased with points */}
              {[
                { id: 'shop_1', name: '50/50 Power-up', price: 50, icon: <Shield size={18} /> },
                { id: 'shop_2', name: 'Extra Time Power-up', price: 75, icon: <Clock size={18} /> },
                { id: 'shop_3', name: 'Skip Question Power-up', price: 100, icon: <ChevronsRight size={18} /> },
                { id: 'shop_4', name: 'Hint Power-up', price: 75, icon: <HelpCircle size={18} /> }
              ].map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-crowd-200 bg-white flex items-center"
                >
                  <div className="p-2 rounded-lg bg-crowd-100 text-crowd-600 mr-3">
                    {item.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-crowd-500 flex items-center">
                      <Star size={14} className="text-champion-500 mr-1" />
                      {item.price} points
                    </div>
                  </div>
                  
                  <button
                    className={`py-1.5 px-3 rounded-lg text-sm font-medium ${
                      currentPoints >= item.price 
                        ? 'bg-jersey-500 hover:bg-jersey-600 text-white' 
                        : 'bg-crowd-100 text-crowd-500 cursor-not-allowed'
                    }`}
                    disabled={currentPoints < item.price}
                    onClick={() => onClaimReward && onClaimReward(item.id, 'powerUp', item.name.split(' ')[0].toLowerCase())}
                  >
                    Purchase
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Missing Shield icon definition
const Shield = ({ size = 24, className = "" }) => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

// Missing HelpCircle icon definition
const HelpCircle = ({ size = 24, className = "" }) => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

// Missing Clock icon definition
const Clock = ({ size = 24, className = "" }) => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default RewardsPanel;