import { useState } from 'react'
import LandingPage from './LandingPage/LandingPage'
import { Routes, Route } from "react-router-dom";
import AdminLoginPage from './AdminLoginPage/AdminLoginPage';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage/>}></Route>
      <Route path="/admin" element={<AdminLoginPage/>}></Route>
    </Routes>
    </>
  )
}

export default App
