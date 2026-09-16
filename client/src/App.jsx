// import './App.css'
import {Routes, Route, RouterProvider, createRoutesFromElements, createBrowserRouter} from 'react-router'
import Layout from './components/Layout'

import Dashboard from './pages/Dashboard'
import Doctors from './pages/Doctors'
import Clinics from './pages/Clinics';
import Insurances from './pages/Insurances'
import Radiology from './pages/Radiology';
import MRF from './pages/MRF';
import MRFDetail from './pages/MRFDetail'
import Groups from './pages/Groups';


const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>

        <Route index element={<Dashboard />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="clinics" element={<Clinics />} />
        <Route path='medical-groups' element={<Groups/>} />
        <Route path="insurances" element={<Insurances />} />
        <Route path="radiology" element={<Radiology />} />
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
