import React from 'react'

const AdminLoginPage = () => {
  return (
    <>
        <div className='container-fluid main-div p-0 m-0'>
            <div className="row p-0 m-0 h-100 w-100 bg-primary align-items-center justify-content-center">
                <div className="col bg-warning col-6 h-auto p-5">
                    <h1 className="text-center text-dark pb-3">Theous Kai Admin Login</h1>
                    <div className="pb-3">
                        <label for="adminUsername" class="form-label" className='text-dark'>Username</label>
                        <input type="text" id="adminUsername" class="form-control"/>
                    </div>
                    <div className="pb-3">
                        <label for="adminPassword" class="form-label" className='text-dark'>Password</label>
                        <input type="password" id="adminPassword" class="form-control"/>
                    </div>
                    <div className="pt-3 w-100 d-flex justify-content-end">
                        <input class="btn btn-dark px-5" type="submit" value="Login"/>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default AdminLoginPage