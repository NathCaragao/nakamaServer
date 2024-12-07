import React from 'react'
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <>
        <div className='container-fluid main-div p-0 m-0 d-flex flex-column'>
            <div className="row align-items-center justify-content-center h-75 p-0 m-0 flex-grow-1">
                <div className="column hero-content w-50 align-items-center justify-content-center text-center p-0 m-0">
                    <h1 className='m-5'>THEOUS KAI</h1>
                    <h5 className='m-5'>"Learn about bullshit here!"</h5>
                    <button className='m-5 btn btn-primary'>Download</button>
                </div>
            </div>
            <div className="row align-items-center justify-content-center h-auto p-0 m-0 flex-shrink-0 text-end">
                <p>© All rights reserved. NCST S.Y. 2024-2025 PCJS-001 BSCS41-E1 Group 1</p>
            </div>
        </div>
    </>
  )
}

export default LandingPage