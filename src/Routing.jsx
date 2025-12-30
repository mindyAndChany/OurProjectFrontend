import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// ...existing code...
import Welcome from './pages/Welcome.jsx';
import HomePage from './pages/HomePage.jsx';
import Login from './pages/Login.jsx';
import Equipments from './pages/Equipments.jsx';
import Calendar from './pages/Calendar.jsx';
import Kattendence from './pages/Kattendence.jsx';

export default function Routing() {
//   return (
//     <>
//       <Navbar />
//       <Routes>
//       <div style={{padding:20}}>Routing בדיקה: נראה אותי?</div>

//           <Route path="/" element={<Welcome />} />
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/Equipments" element={<Equipments />} />
//           <Route path="/Calendar" element={<Calendar />} />
//           <Route path="/Kattendence" element={<Kattendence />} />

//       </Routes>
//   </>
//   );
  return (
 <>
      <Navbar />
          <Routes>

           <Route path="/" element={<Welcome />} />
           <Route path="/home" element={<HomePage />} />
           <Route path="/login" element={<Login />} />     
           <Route path="/Equipments" element={<Equipments />} />
           <Route path="/Calendar" element={<Calendar />} />
           <Route path="/Kattendence" element={<Kattendence />} />

       </Routes>
</>
  );

}