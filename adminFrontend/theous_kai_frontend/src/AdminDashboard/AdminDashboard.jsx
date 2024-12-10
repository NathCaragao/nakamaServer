import React from 'react'
import icon from "../../assets/heraclesPortrait.png";

const AdminDashboard = () => {
  return (
    <>
        <div className="container-fluid main-div p-0 m-0">
            <div className="row w-100 p-0 m-0 bg-primary">
                <nav className='navbar'>
                    <span class="navbar-brand mb-0 h1">
                        <img src={icon} alt="Logo" width="40" height="40" className="my-2 mx-4 d-inline-block align-text-center"/>
                        Theous Kai Dashboard
                    </span>
                </nav>
            </div>
        </div>
    </>
  )
}

export default AdminDashboard