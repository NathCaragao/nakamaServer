import React from "react";

import gcashLogo from "../../../assets/gcash-logo.png";

const SuccessfulPurchase = () => {
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
        <h2 className="text-primary m-4">Purchase Successful!</h2>
        <h5 className="my-5 mx-3">
          You may now close this browser tab. To reflect the changes of
          currency, navigate to the Lobby once you return to the game.
        </h5>
      </div>
    </div>
  );
};

export default SuccessfulPurchase;
