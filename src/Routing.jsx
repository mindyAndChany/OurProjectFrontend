import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import { resolveScreenName, useCheckPermission } from './utils/checkPermissions';

import Welcome from './pages/Welcome.jsx';
import HomePage from './pages/HomePage.jsx';
import Login from './pages/Login.jsx';
import Equipments from './pages/Equipments.jsx';
import StudentsData from './pages/StudentsData.jsx';
import Kattendence from './pages/Kattendence.jsx';
import Approvals from './pages/approvals.jsx';
import CalendarModern from './pages/CalendarModern.jsx';
import Schedule from './pages/schedule.jsx';
import Managment from './pages/Managment.jsx';
import WeeklyScheduleEditor from './pages/WeeklyScheduleEditor.jsx';
import AccessDenied from './pages/AccessDenied.jsx';

const ProtectedRoute = ({ screenOrPath, element }) => {
  const checkPermission = useCheckPermission();
  const location = useLocation();
  const debugPermissions = new URLSearchParams(location.search).has('debugPermissions');
  const user = useSelector((state) => state.user);
  const permissions = user?.userDetails?.permissions || user?.permissions || [];

  const resolvedScreen = resolveScreenName(screenOrPath);
  const permission = checkPermission(screenOrPath);

  if (permission === 'View' || permission === 'Edit') {
    return (
      <>
        {debugPermissions && (
          <div className="fixed bottom-6 left-6 z-50 rounded-2xl bg-black/80 text-white px-4 py-3 text-sm shadow-lg">
            <div className="font-bold mb-1">Debug Permissions</div>
            <div>path: {screenOrPath}</div>
            <div>resolved: {resolvedScreen}</div>
            <div>permission: {permission}</div>
            <div>permissions count: {permissions.length}</div>
          </div>
        )}
        {element}
      </>
    );
  }

  return <Navigate to="/access-denied" replace />;
};

export default function Routing() {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/login']; // דפים שבהם לא מציגים ניווט

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<ProtectedRoute screenOrPath="/home" element={<HomePage />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/access-denied" element={<><Navbar /><AccessDenied /></>} />
        <Route path="/Equipments" element={<ProtectedRoute screenOrPath="/Equipments" element={<Equipments />} />} />
        <Route path="/Calendar" element={<ProtectedRoute screenOrPath="/Calendar" element={<CalendarModern />} />} />
        <Route path="/Kattendence" element={<ProtectedRoute screenOrPath="/Kattendence" element={<Kattendence />} />} />
        <Route path="/Kattendence/:domain" element={<ProtectedRoute screenOrPath="/Kattendence" element={<Kattendence />} />} />
        <Route path="/Approvals" element={<ProtectedRoute screenOrPath="/Approvals" element={<Approvals />} />} />
        <Route path="/StudentsData" element={<ProtectedRoute screenOrPath="/StudentsData" element={<StudentsData />} />} />
        <Route path="/schedule" element={<ProtectedRoute screenOrPath="/schedule" element={<Schedule />} />} />
        <Route path="/Managment" element={<ProtectedRoute screenOrPath="/Managment" element={<Managment />} />} />
        <Route path="/WeeklyScheduleEditor" element={<ProtectedRoute screenOrPath="/WeeklyScheduleEditor" element={<WeeklyScheduleEditor />} />} />

      </Routes>
    </>
  );
}

