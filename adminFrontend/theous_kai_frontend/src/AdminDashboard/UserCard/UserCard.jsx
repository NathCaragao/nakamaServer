import React from 'react'

const UserCard = ({playerId, playerEmail}) => {
  return (
    <>
        <div className="card">
            <div className="card-body">
                <h5 className='card-title'>PlayerID: {playerId}</h5>
                <p className="card-text">Email: {playerEmail}</p>
            </div>
        </div>
    </>
  )
}

export default UserCard