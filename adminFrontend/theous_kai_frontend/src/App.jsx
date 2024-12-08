import { useState } from 'react'
import './App.css'
import LandingPage from './LandingPage/LandingPage'
import { Routes, Route } from "react-router-dom";
import AdmingLoginPage from './AdminLoginPage/AdmingLoginPage';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage/>}></Route>
      <Route path="/admin" element={<AdmingLoginPage/>}></Route>
    </Routes>
    </>
  )
}

export default App
