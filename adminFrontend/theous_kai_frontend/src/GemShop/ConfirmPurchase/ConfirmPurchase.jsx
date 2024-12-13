import React, { useEffect, useState } from "react";
import axios from "axios";

import gcashLogo from "../../../assets/gcash-logo.png";
import { useAuth } from "../../AuthContextProvider/AuthContextProvider";

const localServer = "http://127.0.0.1:5000";
const cloudServer =
  "https://5000-nathcaragao-nakamaserve-wqsrj0o3ahe.ws-us117.gitpod.io";

const confirmPurchase = async (
  gemAmount,
  phpAmount,
  userId,
  authToken,
  phoneNumber
) => {
  const purchasePayload = {
    gemAmount: gemAmount,
    phpAmount: phpAmount,
    userId: userId,
    phoneNumber: phoneNumber,
  };
  await axios.post(`${localServer}/purchase`, purchasePayload, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

const ConfirmPurchase = ({ gemAmount, phpAmount, setSuccessFlag, userId }) => {
  const { authToken } = useAuth();
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await confirmPurchase(gemAmount, phpAmount, userId, authToken, phoneNumber);
    setSuccessFlag(true);
  };

  useEffect(() => {
    const getUserDisplayName = async (playerId) => {
      await axios
        .get(`${localServer}/admin/players/${playerId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((result) => {
          setUserName(result.data.account.user.display_name);
        });
    };
    getUserDisplayName(userId);
  }, []);

  return (
    <div className="row w-100 h-100 bg-primary align-items-center justify-content-center p-0 m-0">
      <div className="col-6 bg-white text-center rounded-4">
        <img
          src={gcashLogo}
          alt="GCASH"
          width={100}
          height={100}
          className="my-3"
        />
        <h4 className="my-3">
          <span className="tw-bold text-primary">{`${userName}`}</span>, you are
          about to buy{" "}
          <span className="tw-bold text-primary">
            {`${gemAmount}`} &quot;Olympian Emeralds&quot;
          </span>
          .
        </h4>
        <h3 className="my-3">
          This will cost{" "}
          <span className="tw-bold text-primary">₱{phpAmount}</span>.
        </h3>
        <form onSubmit={handleSubmit}>
          +639
          <input
            type="tel"
            pattern="\d{9}"
            className="mx-1"
            placeholder="Enter your phone number"
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
          />
          <button className="btn btn-primary fw-bold m-3 mb-4" type="submit">
            Confirm Purchase
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmPurchase;
