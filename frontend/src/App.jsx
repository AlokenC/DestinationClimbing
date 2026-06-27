import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import BoulderDetailPage from './pages/BoulderDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-rock-950">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/boulder/:id" element={<BoulderDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
