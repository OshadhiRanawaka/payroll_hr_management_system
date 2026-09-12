import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StyleGuidePage from './pages/StyleGuidePage'
import DataCheckPage from './pages/DataCheckPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/style-guide" element={<StyleGuidePage />} />
        <Route path="/data-check" element={<DataCheckPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
