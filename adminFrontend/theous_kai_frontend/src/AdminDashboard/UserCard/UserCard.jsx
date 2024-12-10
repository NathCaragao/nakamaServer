import React, { useEffect, useState } from 'react'
import { useAuth } from '../../AuthContextProvider/AuthContextProvider';
import axios from 'axios';

const UserCard = ({playerId, playerDisplayName}) => {
    const {authToken} = useAuth();
    const [newEmail, setNewEmail] = useState();

    useEffect(() => {
        const getUserEmail = async(playerId) => {
            await axios.get(`http://localhost:5000/admin/players/${playerId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }).then((result) => {
                setNewEmail(result.data.account.email);
            });
        }
        getUserEmail(playerId);
    }, []);

  return (
    <>
        <div className="card">
            <div className="card-body">
                <h5 className='card-title'>PlayerID: {playerId}</h5>
                <p className="card-text"><span className='fw-bold'>Email:</span> {newEmail} | <span className='fw-bold'>Username:</span> {playerDisplayName}</p>
                <p className="card-text"></p>
            </div>
        </div>
    </>
  )
}

export default UserCard