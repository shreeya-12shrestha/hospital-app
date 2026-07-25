import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './AppContext'
import { IconSprite } from './Icons'
import Nav from './Nav'
import Home from './Home'
import HospitalDetail from './HospitalDetail'
import ChatWidget from './ChatWidget'

function App() {
  return (
    <AppProvider>
      <IconSprite />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospitals/:id" element={<HospitalDetail />} />
      </Routes>
      <ChatWidget />
    </AppProvider>
  )
}

export default App