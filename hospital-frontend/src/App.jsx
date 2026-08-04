import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './AppContext'
import { IconSprite } from './Icons'
import Nav from './Nav'
import Home from './Home'
import Hospitals from './Hospitals'
import HospitalDetail from './HospitalDetail'
import SymptomChecker from './SymptomChecker'
import Doctors from './Doctors'
import ChatWidget from './ChatWidget'
import Appointments from './Appointments'

function App() {
  return (
    <AppProvider>
      <IconSprite />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/hospitals/:id" element={<HospitalDetail />} />
        <Route path="/symptom-check" element={<SymptomChecker />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
      <ChatWidget />
    </AppProvider>
  )
}

export default App