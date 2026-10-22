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
import About from './About'
import Login from './Login'
import Register from './Register'
import MyAppointments from './MyAppointments'
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
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
      </Routes>
      <ChatWidget />
    </AppProvider>
  )
}

export default App