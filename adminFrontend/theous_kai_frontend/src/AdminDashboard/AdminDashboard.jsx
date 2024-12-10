import React, { useEffect, useState } from 'react'
import icon from "../../assets/heraclesPortrait.png";
import UserCard from './UserCard/UserCard';
import "./AdminDashboard.css";

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
                <nav className='navbar navbar-expand p-4'>
                    <span className="navbar-brand mb-0 h1">
                        <img src={icon} alt="Logo" width="45" height="45" className="mx-3 border border-3 bg-secondary d-inline-block align-text-center"/>
                        Theous Kai Dashboard
                    </span>
                    <div className="container justify-content-start px-5">
                        <button className='btn btn-outline-warning btn-sm active'>Players</button>
                    </div>
                    <div className="container justify-content-end">
                        <button className='btn btn-danger'>Logout</button>
                    </div>
                </nav>
            </div>
            <div className="row w-100 p-0 m-0 bg-primary-subtle">
            {
                // Depending on active tab, change the contents of this div
                <>
                    <h3 className='m-0 header-message py-2'>{headerMessage}</h3>
                    <UserCard playerEmail="test1@gmail.com" playerId="69420" />
                </>
            }
            </div>
        </div>
    </>
  )
}

export default AdminDashboard