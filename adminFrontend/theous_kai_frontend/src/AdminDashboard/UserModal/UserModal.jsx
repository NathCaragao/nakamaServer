import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContextProvider/AuthContextProvider";

const localServer = "http://127.0.0.1:5000";
const cloudServer =
  "https://5000-nathcaragao-nakamaserve-wqsrj0o3ahe.ws-us117.gitpod.io";

const banPlayer = async (dummyState, setDummyState, playerId, authToken) => {
  await axios
    .post(`${localServer}/ban/${playerId}`, null, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => {
      setDummyState((dummyState = dummyState + 1));
      alert("Player Successfully banned.");
    })
    .catch((err) => {
      alert("Error in Banning Player. Refresh page and try again.");
    });
};

const unbanPlayer = async (dummyState, setDummyState, playerId, authToken) => {
  await axios
    .post(`${localServer}/unban/${playerId}`, null, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => {
      setDummyState((dummyState = dummyState + 1));
      alert("Player Successfully unbanned.");
    })
    .catch((err) => {
      alert("Error in unbanning Player. Refresh page and try again.");
    });
};

const deletePlayer = async (
  dummyState,
  setDummyState,
  playerId,
  authToken,
  renderState,
  setRenderState
) => {
  await axios
    .delete(`${localServer}/delete/${playerId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => {
      alert("Player Successfully deleted.");
      setRenderState(renderState + 1);
    })
    .catch((err) => {
      alert("Error in deleting Player. Refresh page and try again.");
    });
};

const UserModal = ({
  playerId,
  setPlayerId,
  setParentRender,
  parentRender,
}) => {
  const { authToken } = useAuth();
  const [playerData, setPlayerData] = useState();
  const [playerStorageData, setPlayerStorageData] = useState();

  const [dummyState, setDummyState] = useState(0);

  useEffect(() => {
    const getUserData = async (playerId) => {
      if (playerId == "") return;
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
  }, [playerId, authToken, dummyState]);

  useEffect(() => {
    const getUserStorageData = async (playerId) => {
      if (playerId == "") return;
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
  }, [playerId, dummyState]);

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
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
                Ban Status:
              </span>
              {playerData?.disable_time ? (
                <span className="text-danger">Banned</span>
              ) : (
                <span className="text-success">Not Banned</span>
              )}
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
            <h5 className="mt-4">
              <span className="text-primary-emphasis mx-1 fw-bold fs-6">
                Additional Actions:
              </span>
            </h5>
            <div className="justify-content-start d-flex gap-3">
              {playerData?.disable_time ? (
                <button
                  className="btn btn-success"
                  onClick={(e) => {
                    unbanPlayer(dummyState, setDummyState, playerId, authToken);
                  }}
                >
                  Unban Player
                </button>
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    banPlayer(dummyState, setDummyState, playerId, authToken);
                  }}
                >
                  Ban Player
                </button>
              )}
              <button
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={(e) => {
                  deletePlayer(
                    dummyState,
                    setDummyState,
                    playerId,
                    authToken,
                    parentRender,
                    setParentRender
                  );
                }}
              >
                Delete Player
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
