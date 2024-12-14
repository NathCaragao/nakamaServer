import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContextProvider/AuthContextProvider";

const UserModal = ({ playerId }) => {
  const localServer = "http://127.0.0.1:5000";
  const cloudServer =
    "https://5000-nathcaragao-nakamaserve-wqsrj0o3ahe.ws-us117.gitpod.io";
  const { authToken } = useAuth();
  const [playerData, setPlayerData] = useState();

  useEffect(() => {
    const getUserData = async (playerId) => {
      await axios
        .get(`${localServer}/admin/players/${playerId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((result) => {
          setPlayerData(result.data.account);
        });
    };
    getUserData(playerId);
  }, [playerId]);

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              <span className="text-primary mx-2 fw-bold">Player ID:</span>
              {playerId}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <h5>
              <span className="text-primary-emphasis mx-1 fw-bold fs-6">
                Email:
              </span>
              {playerData?.email}
            </h5>
            <h5>
              <span className="text-primary-emphasis mx-1 fw-bold fs-6">
                Username:
              </span>
              {playerData?.user?.display_name}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
