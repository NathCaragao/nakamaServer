import { useEffect, useState } from 'react'
import LandingPage from './LandingPage/LandingPage'
import { Routes, Route } from "react-router-dom";
import AdminLoginPage from './AdminLoginPage/AdminLoginPage';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import faviconImage from "../assets/heraclesPortrait.png";

function App() {
  useEffect(() => {
    document.title = "Theous Kai - Greek Mythology Platformer Game";
    
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
        favicon.href = faviconImage;
    }
}, []);
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
