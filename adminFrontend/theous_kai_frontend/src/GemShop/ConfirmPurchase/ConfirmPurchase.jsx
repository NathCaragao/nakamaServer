import React from "react";

import gcashLogo from "../../../assets/gcash-logo.png";

const ConfirmPurchase = ({ gemAmount, phpAmount, setSuccessFlag }) => {
  const handleSubmit = async (e) => {
    console.log("SUBMIT CONFIRM!");
    e.preventDefault();
    // await adminLogin(adminUsername, adminPassword);
    setSuccessFlag(true);
  };

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
          You are about to buy{" "}
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
          +63
          <input
            type="tel"
            pattern="\d{10}"
            className="mx-1"
            placeholder="Enter your phone number"
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
