import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the user state interface
export interface UserState {
  playerName: string;
  bingo: {
    highScore: number;
    lastBoard?: any[];
  };
  ticTacToe: {
    highScore: number;
    history: GameResult[];
  };
}

// Define the game result interface for TicTacToe
export interface GameResult {
  date: string;
  result: 'win' | 'loss' | 'draw';
  score: number;
}

// Default user state
const defaultUserState: UserState = {
  playerName: '',
  bingo: {
    highScore: 0,
  },
  ticTacToe: {
    highScore: 0,
    history: [],
  },
};

// Local storage key
const STORAGE_KEY = 'footballQuizAppState';

// Create the context
interface UserContextType {
  user: UserState;
  setPlayerName: (name: string) => void;
  updateBingoHighScore: (score: number) => void;
  updateTicTacToeHighScore: (score: number) => void;
  addTicTacToeResult: (result: GameResult) => void;
  resetScores: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserState>(defaultUserState);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUserData = localStorage.getItem(STORAGE_KEY);
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData);
        setUser(parsedData);
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
      }
    }
  }, []);

  // Persist user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  // Update player name
  const setPlayerName = (name: string) => {
    setUser(prev => ({
      ...prev,
      playerName: name,
    }));
  };

  // Update Bingo high score
  const updateBingoHighScore = (score: number) => {
    if (score > user.bingo.highScore) {
      setUser(prev => ({
        ...prev,
        bingo: {
          ...prev.bingo,
          highScore: score,
        },
      }));
    }
  };

  // Update TicTacToe high score
  const updateTicTacToeHighScore = (score: number) => {
    if (score > user.ticTacToe.highScore) {
      setUser(prev => ({
        ...prev,
        ticTacToe: {
          ...prev.ticTacToe,
          highScore: score,
        },
      }));
    }
  };

  // Add TicTacToe game result
  const addTicTacToeResult = (result: GameResult) => {
    setUser(prev => ({
      ...prev,
      ticTacToe: {
        ...prev.ticTacToe,
        history: [...prev.ticTacToe.history, result],
      },
    }));
  };

  // Reset all scores
  const resetScores = () => {
    setUser(prev => ({
      ...prev,
      bingo: {
        highScore: 0,
      },
      ticTacToe: {
        highScore: 0,
        history: [],
      },
    }));
  };

  const value = {
    user,
    setPlayerName,
    updateBingoHighScore,
    updateTicTacToeHighScore,
    addTicTacToeResult,
    resetScores,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
