import React, { useEffect, useState } from 'react'
import icon from "../../assets/heraclesPortrait.png";
import UserCard from './UserCard/UserCard';

const Tabs = {
    Players: "players",
}

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState(Tabs.Players);
    const [headerMessage, setHeaderMessage] = useState("");

    useEffect(() => {
        if (activeTab == Tabs.Players) {
            setHeaderMessage("List of Theous Kai Players");
        }
    }, [activeTab]);

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
            <div className="row w-100 p-0 m-0 bg-primary-subtle">
            {
                // Depending on active tab, change the contents of this div
                <>
                    <h3 className='m-3 ms-5 p-0 m-0'>{headerMessage}</h3>
                    <UserCard playerEmail="test1@gmail.com" playerId="69420" />
                </>
            }
            </div>
        </div>
    </>
  )
}

export default AdminDashboard