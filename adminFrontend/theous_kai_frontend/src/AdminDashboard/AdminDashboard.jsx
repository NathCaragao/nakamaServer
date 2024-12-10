import React, { useState } from 'react'
import icon from "../../assets/heraclesPortrait.png";

const Tabs = {
    Players: "players",
}

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState(Tabs.Players);

  return (
    <>
        <div className="container-fluid main-div p-0 m-0">
            <div className="row w-100 p-0 m-0 bg-primary">
                <nav className='navbar navbar-expand'>
                    <span className="navbar-brand mb-0 h1">
                        <img src={icon} alt="Logo" width="45" height="45" className="p-1 border border-3 bg-secondary my-2 mx-4 d-inline-block align-text-center"/>
                        Theous Kai Dashboard
                    </span>
                    <div className="container justify-content-start">
                        <button className='btn btn-outline-warning btn-sm me-2 active'>Players</button>
                    </div>
                    <div className="container justify-content-end px-5">
                        <button className='btn btn-danger'>Logout</button>
                    </div>
                </nav>
            </div>
            <div className="row w-100 p-0 m-0"></div>
            {
                // Depending on active tab, change the contents of this div
                <div className="card">
                    <div className="card-body">
                        <h5 className='card-title'>ID: 238484584383489438348</h5>
                        <p className="card-text">Email: Ni@gmail.com</p>
                    </div>
                </div>
            }
        </div>
    </>
  )
}

export default AdminDashboard