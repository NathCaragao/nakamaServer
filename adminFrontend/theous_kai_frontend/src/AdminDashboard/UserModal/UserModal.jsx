import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContextProvider/AuthContextProvider";

const UserModal = ({ playerId }) => {
  const localServer = "http://127.0.0.1:5000";
  const cloudServer =
    "https://5000-nathcaragao-nakamaserve-wqsrj0o3ahe.ws-us117.gitpod.io";
  const { authToken } = useAuth();
  const [playerData, setPlayerData] = useState();
  const [playerStorageData, setPlayerStorageData] = useState();

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
  }, [playerId, authToken]);

  useEffect(() => {
    const getUserStorageData = async (playerId) => {
      await axios
        .get(`${localServer}/player/storage/${playerId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((result) => {
          setPlayerStorageData(JSON.parse(result?.data?.result?.value));
        });
    };
    getUserStorageData(playerId);
  }, [playerId]);

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
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
            <h5 className="mt-3">
              <span className="text-primary-emphasis mx-1 fw-bold fs-6">
                Username:
              </span>
              {playerData?.user?.display_name}
            </h5>
            <h5 className="mt-3">
              <span className="text-primary-emphasis mx-1 fw-bold fs-6">
                Purchase History:
              </span>
            </h5>
            {playerStorageData?.purchaseHistory ? (
              <table className="table-primary table table-striped-columns">
                <thead>
                  <tr className="text-center fs-6 align-middle">
                    <th>Time of purchase</th>
                    <th>GCash Number</th>
                    <th>Gems acquired by player</th>
                    <th>Philippine Peso spent by player</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStorageData.purchaseHistory.map((purchase) => (
                    <tr key={purchase.time} className="table-light">
                      <td>{purchase.time}</td>
                      <td className="text-center">{purchase.gcashNumber}</td>
                      <td className="text-center">{purchase.gemAmount}</td>
                      <td className="text-center">₱{purchase.phpAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <h5 className="fs-5 text-danger">
                Player has no purchase history yet.
              </h5>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
