import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContextProvider/AuthContextProvider";
import { useNavigate } from "react-router-dom";

const localServer = "http://127.0.0.1:5000";
const cloudServer =
  "https://5000-nathcaragao-nakamaserve-wqsrj0o3ahe.ws-us117.gitpod.io";

const AdminLoginPage = () => {
  const { authToken, setAuthToken } = useAuth();
  const navigate = useNavigate();

  const authTokenChecker = useEffect(() => {
    if (authToken != "") {
      navigate("/admin/dashboard");
      return;
    }
  }, [authToken]);

  const adminLogin = async (adminUsername, adminPassword) => {
    let adminLoginPayload = {
      username: adminUsername,
      password: adminPassword,
    };

    await axios
      .post(`${cloudServer}/admin/login`, adminLoginPayload)
      .then((response) => {
        setAuthToken(response.data.token);
      })
      .catch((error) => {
        alert("Error occured while signing in. Try again");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminLogin(adminUsername, adminPassword);
  };

  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  return (
    <>
      <div className="container-fluid main-div p-0 m-0">
        <div className="row p-0 m-0 h-100 w-100 bg-primary align-items-center justify-content-center">
          <div className="col bg-warning col-6 h-auto p-5">
            <h1 className="text-center text-dark pb-3">
              Theous Kai Admin Login
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="pb-3">
                <label
                  htmlFor="adminUsername"
                  className="form-label text-dark fw-bold"
                >
                  Username:
                </label>
                <input
                  required
                  type="text"
                  id="adminUsername"
                  className="form-control"
                  onChange={(e) => {
                    setAdminUsername(e.target.value);
                  }}
                />
              </div>
              <div className="pb-3">
                <label
                  htmlFor="adminPassword"
                  className="form-label text-dark fw-bold"
                >
                  Password:
                </label>
                <input
                  required
                  type="password"
                  id="adminPassword"
                  className="form-control"
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                  }}
                />
              </div>
              <div className="pt-3 w-100 d-flex justify-content-end">
                <input
                  className="btn btn-dark px-5"
                  type="submit"
                  value="Login"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;
