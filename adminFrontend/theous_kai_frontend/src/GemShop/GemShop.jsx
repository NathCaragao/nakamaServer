import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./GemShop.css";
import ConfirmPurchase from "./ConfirmPurchase/ConfirmPurchase";
import SuccessfulPurchase from "./SuccessfulPurchase/SuccessfulPurchase";

const gemToPhp = {
  60: 49,
  200: 249,
  700: 479,
  900: 949,
};

const GemShop = () => {
  const gemParam = useParams();
  const [confirmedPurchase, setConfirmedPurchase] = useState(false);

  return (
    <>
      <div className="container-fluid m-0 p-0 main-div">
        {confirmedPurchase ? (
          <SuccessfulPurchase />
        ) : (
          <ConfirmPurchase
            gemAmount={gemParam.value}
            phpAmount={gemToPhp[gemParam.value]}
            setSuccessFlag={setConfirmedPurchase}
            userId={gemParam.userId}
          />
        )}
      </div>
    </>
  );
};

export default GemShop;
