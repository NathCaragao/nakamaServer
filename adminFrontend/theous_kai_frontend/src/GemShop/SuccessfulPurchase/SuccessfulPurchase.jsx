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
      </div>
    </div>
  );
};

export default SuccessfulPurchase;
