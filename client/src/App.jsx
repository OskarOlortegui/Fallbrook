// import './App.css'
import {Routes, Route, RouterProvider, createRoutesFromElements, createBrowserRouter} from 'react-router'
import Layout from './components/Layout'

import Dashboard from './pages/Dashboard'
import Doctors from './pages/Doctors'
import Clinics from './pages/Clinics';
import Insurances from './pages/Insurances'
import RadiologyCenters from './pages/RadiologyCenters';
import MRF from './pages/MRF';
import MRFDetail from './pages/MRFDetail'
import Groups from './pages/Groups';
import DoctorDetail from './pages/DoctorDetail';
import ClinicDetail from './pages/ClinicDetail';
import GroupDetail from './pages/GroupDetail';
import RadiologyCenterDetail from './pages/RadiologyCenterDetail';


const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>

        <Route index element={<Dashboard />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:id" element={<DoctorDetail />} />
        <Route path="clinics" element={<Clinics />} />
        <Route path="clinics/:id" element={<ClinicDetail />} />
        <Route path='medical-groups' element={<Groups/>} />
        <Route path='medical-groups/:id' element={<GroupDetail />} />
        <Route path="insurances" element={<Insurances />} />
        <Route path="radiology-centers" element={<RadiologyCenters />} />
        <Route path="radiology-centers/:id" element={<RadiologyCenterDetail />} />
        <Route path="clinics/mrf" element={<MRF />} />
        <Route path="clinics/mrf/:id" element={<MRFDetail />} />

    </Route>
);
const router = createBrowserRouter(routes)

// <Routes>. . .</Routes>  <>  RouterProvider
/*  RouterProvider: para características avanzadas, 
como el manejo de errores en las rutas y el control de la carga de datos. */
function App() {
    return <RouterProvider router={router} />
}

export default App
