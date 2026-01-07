import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

import Welcome from './pages/Welcome.jsx';
import HomePage from './pages/HomePage.jsx';
import Login from './pages/Login.jsx';
import Equipments from './pages/Equipments.jsx';
import StudentsData from './pages/StudentsData.jsx';
import Kattendence from './pages/Kattendence.jsx';
import Approvals from './pages/approvals.jsx';
import CalendarModern from './pages/CalendarModern.jsx';

export default function Routing() {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/login']; // דפים שבהם לא מציגים ניווט

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
 <>
      {!shouldHideNavbar && <Navbar />}
          <Routes>

           <Route path="/" element={<Welcome />} />
           <Route path="/home" element={<HomePage />} />
           <Route path="/login" element={<Login />} />     
           <Route path="/Equipments" element={<Equipments />} />
        <Route path="/Calendar" element={<CalendarModern />} />
           <Route path="/Kattendence" element={<Kattendence />} />
        <Route path="/Approvals" element={<Approvals />} />
        <Route path="/StudentsData" element={<StudentsData />} />

       </Routes>
      <div style={{padding:20}}>Routing בדיקה: נראה אותי?</div>
</>
  );

}

