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
import ChatPatient from './Patient/Chat';
import DoctorHomePage from './Doctor/DocterHomePage'
import LoginPage from './Patient/Login';
import DoctorLoginPage from './Doctor/DocterLogin';
import PatientDashboard from './Patient/PatientDashboard';
import PatientHomePage from './Patient/PatientHomePage';
import AppointmentPatient from './Patient/Appointment';
import DoctorDashboard from'./Doctor/DoctorDashboard';
import DoctorChat from './Doctor/DoctorChat';
import PayDoctorFee from './Patient/PayDoctorFee';
import MyAppointments from './Patient/MyAppointment';
import MyPatients from './Doctor/MyPatients';
import PharmacistLoginPage from './Pharmacist/PharmacistLoginPage';
import PharmacistDashboard from './Pharmacist/PharmacistDashboard';
import MedicineAdd from './Pharmacist/MedicineAdd';
import MedicineList from './Pharmacist/MedicineList';
import FetchEPrescriptions from './Doctor/FetchEPrescriptions';
import MyEPrescription from './Patient/MyEPrescription';
import PostReport from './Doctor/PostReport';
import PatientRecords from './Doctor/PatientRecords';
import PatientReport from './Patient/PatientReport';
import LookPayments from './Doctor/LookPayments';
import Feedback from './Doctor/Feedback';
import UpdateDoctor from './Doctor/UpdateDoctor';
import ViewPayments from './Pharmacist/ViewPayments';
import ViewOrders from './Pharmacist/ViewOrders';
import TrackOrder from './Pharmacist/TrackOrder';
import PharmacistHomePage from './Pharmacist/PharmacistHomePage';
import MyOrders from './Patient/MyOrders';
import VideoCall from './Doctor/VideoCall';

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
          <Route exact path='/chatpatient' element={<ChatPatient/> } />
          <Route exact path='/doctorDashboard' element={<DoctorDashboard /> } />
          <Route exact path='/doctorchat' element={<DoctorChat /> } />
          <Route exact path='/doctorHomepage' element={<DoctorHomePage /> } />
          <Route exact path='/billing' element={<PayDoctorFee /> } />
          <Route exact path='/myAppointments' element={<MyAppointments /> } />
          <Route exact path='/mySchedule' element={<MyPatients /> } />
          <Route exact path='/pharmacistlogin' element={<PharmacistLoginPage /> } />
          <Route exact path='/pharmacistDashboard' element={<PharmacistDashboard /> } />
          <Route exact path='/pharmacistAddMedicine' element={<MedicineAdd /> } />
          <Route exact path='/pharmacistMedicineList' element={<MedicineList /> } />
          <Route exact path='/MyEPrescription' element={<MyEPrescription /> } />
          <Route exact path='/postReportsData' element={<PostReport /> } />
          <Route exact path='/patientRecordsbyDocter' element={<PatientRecords/>} />
          <Route exact path='/patientRecordsbyPatient' element={<PatientReport/>} />
          <Route exact path='/viewMyPaymentsbyPatients' element={<LookPayments/>} />
          <Route exact path='/feedback' element={<Feedback/>} />
          <Route exact path='/updateDoctorProfile' element={<UpdateDoctor/>} />
          <Route exact path='/viewPaymentsByEPharmacist' element={<ViewPayments/>} />
          <Route exact path='/viewOrdersbyPharmasisct' element={<ViewOrders/>} />
          <Route exact path='/trackOrder' element={<TrackOrder/>} />
          <Route exact path='/pharmacistHomePage' element={<PharmacistHomePage/>} />
          <Route exact path='/myOrdersByPatient' element={<MyOrders/>} />
          <Route exact path='/onlineVideoCall' element={<VideoCall/>} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
