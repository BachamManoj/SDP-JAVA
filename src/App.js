import './App.css';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './pages/Footer';
import About from './pages/About';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Service from './pages/Service';
import Contact from './pages/Contact';
import Logins from './pages/Logins';
import DoctorsBySpecialty from './pages/Doctor';
import Appointment from './pages/Appointment';
import PatientRegistration from './Patient/PatientRegistration';
import SuccessPage from './pages/Suceess';
import PatientProfile from './Patient/PatientProfile';
import Chat from './pages/Chat';
import LoginPage from './Patient/Login';
import DoctorLoginPage from './Doctor/DocterLogin';
import PatientDashboard from './Patient/PatientDashboard';
import PatientHomePage from './Patient/PatientHomePage';
import AppointmentPatient from './Patient/Appointment';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/about' element={<About />} />
          <Route exact path='/service' element={<Service/>} />
          <Route exact path='/contact' element={<Contact/>} />
          <Route exact path='/login' element={<Logins/> } />
          <Route exact path='/patientlogin' element={<LoginPage/> } />
          <Route exact path='/doctorlogin' element={<DoctorLoginPage/> } />
          <Route exact path='/doctor' element={<DoctorsBySpecialty/>} />
          <Route exact path='/appointment' element={<Appointment/>} />
          <Route exact path='/patientRegistration' element={<PatientRegistration/>} />
          <Route exact path='/patientDashboard' element={<PatientDashboard/>} />
          <Route exact path='/patientHomepage' element={<PatientHomePage/>} />
          <Route exact path='/bookAppointments' element={<AppointmentPatient/>} />
          <Route exact path='/success' element={<SuccessPage />} />
          <Route exact path='/patientprofile' element={<PatientProfile />} />
          <Route exact path='/chat' element={<Chat/> } />
        </Routes>
       
      </Router>
    </div>
  );
}

export default App;
