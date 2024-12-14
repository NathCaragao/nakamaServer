import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContextProvider/AuthContextProvider";
import axios from "axios";

const localServer = "http://127.0.0.1:5000";
const cloudServer =
  "https://5000-nathcaragao-nakamaserve-wqsrj0o3ahe.ws-us117.gitpod.io";

const UserCard = ({ playerId, playerDisplayName, onClick }) => {
  const { authToken } = useAuth();
  const [newEmail, setNewEmail] = useState();

  useEffect(() => {
    const getUserEmail = async (playerId) => {
      await axios
        .get(`${localServer}/admin/players/${playerId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((result) => {
          console.log(result.data);
          setNewEmail(result.data.account.email);
        });
    };
    getUserEmail(playerId);
  }, []);

  return (
    <>
      <div
        className="card"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={onClick}
      >
        <div className="card-body">
          <h5 className="card-title">PlayerID: {playerId}</h5>
          <p className="card-text">
            <span className="fw-bold">Email:</span> {newEmail} |{" "}
            <span className="fw-bold">Username:</span> {playerDisplayName}
          </p>
          <p className="card-text"></p>
        </div>
      </div>
    </>
  );
};

export default UserCard;
