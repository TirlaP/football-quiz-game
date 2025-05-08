import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import LandingPage from './pages/LandingPage'
import BingoGame from './pages/BingoGame'
import TicTacToeGame from './pages/TicTacToeGame'
import NotFound from './pages/NotFound'

// Context
import { UserProvider } from './context/UserContext'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router>
          <div className="min-h-screen bg-white-100 text-gray-800 font-body">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/bingo" element={<BingoGame />} />
              <Route path="/tictactoe" element={<TicTacToeGame />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </QueryClientProvider>
  )
}

export default App
