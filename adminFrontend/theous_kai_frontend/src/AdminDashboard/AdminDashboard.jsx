import React, { useEffect, useState } from 'react'
import icon from "../../assets/heraclesPortrait.png";
import UserCard from './UserCard/UserCard';
import "./AdminDashboard.css";
import axios from 'axios';
import { useAuth } from '../AuthContextProvider/AuthContextProvider';

const Tabs = {
    Players: "players",
}

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState(Tabs.Players);
    const [headerMessage, setHeaderMessage] = useState("");
    const [players, setPlayers] = useState({});
    const {authToken} = useAuth();

    useEffect(() => {
        const fetchPlayers = async (authToken) => {
            let listOfPlayers = {};
            if (authToken !== "") {
                try {
                    const result = await axios.get("http://localhost:5000/admin/players", {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    });
                    listOfPlayers = result.data.users; // Ensure you're accessing the correct property
                } catch (error) {
                    console.error('Error fetching players:', error);
                }
            }
            return listOfPlayers;
        };
    
        if (activeTab === Tabs.Players) {
            // Wait for fetchPlayers to complete and then update the state
            const fetchData = async () => {
                const playersData = await fetchPlayers(authToken);
                setPlayers(playersData); // Now update the state with the resolved data
            };
            
            fetchData(); // Call the async function to fetch and set players
    
            setHeaderMessage("List of Theous Kai Players");
        }
    }, [activeTab, authToken]); // Make sure authToken is also part of the dependency array
    



  return (
    <>
    {
        console.log(players)
    }
        <div className="container-fluid main-div p-0 m-0">
            <div className="row w-100 p-0 m-0 bg-primary">
                <nav className='navbar navbar-expand p-4'>
                    <span className="navbar-brand mb-0 h1">
                        <img src={icon} alt="Logo" width="45" height="45" className="mx-3 border border-3 bg-secondary d-inline-block align-text-center"/>
                        Theous Kai Dashboard
                    </span>
                    <div className="container justify-content-start px-5">
                        <button className='btn btn-outline-warning btn-sm active px-4'>Players</button>
                    </div>
                    <div className="container justify-content-end">
                        <button className='btn btn-danger px-5'>Logout</button>
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