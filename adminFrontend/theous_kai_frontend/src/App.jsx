import { useState } from 'react'
import LandingPage from './LandingPage/LandingPage'
import { Routes, Route } from "react-router-dom";
import AdminLoginPage from './AdminLoginPage/AdminLoginPage';
import AdminDashboard from './AdminDashboard/AdminDashboard';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage/>}></Route>
      <Route path="/admin" element={<AdminLoginPage/>}></Route>
      <Route path='/admin/dashboard' element={<AdminDashboard/>}></Route>
    </Routes>
    </>
  )
}

export default App
