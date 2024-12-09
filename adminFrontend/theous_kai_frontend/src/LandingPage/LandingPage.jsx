import React from 'react'
import "./LandingPage.css";
import windowsLogo from "../../assets/windows-logo.png";
import axios from "axios";
import { saveAs } from "file-saver";

const downloadGame = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:5000/download", {
            responseType: "blob", // Ensure the response is treated as a file
        });

        // Use FileSaver to trigger the download
        saveAs(response.data, "Theous Kai.exe");
    } catch (error) {
        console.error("Error downloading the file:", error);
    }
};

const LandingPage = () => {
  return (
    <>
        <div className='container-fluid main-div p-0 m-0 d-flex flex-column bg-secondary'>
            <div className="row align-items-center justify-content-center h-75 p-0 m-0 flex-grow-1">
                <div className="column hero-content w-50 align-items-center justify-content-center text-center p-0 m-0">
                    <h1 className='m-5'>THEOUS KAI</h1>
                    <h5 className='my-3 mx-5 hero-text'>
                        Have you ever wanted to dive into the fascinating world of Greek Mythology but found massive texts
                        overwhelming and boring? Fear not! Theous Kai is here to help. Explore the wonders
                        of Greek mythology through an exciting platformer experience that turns learning into an adventure.
                        Forget the boredom as you jump, run, and immerse yourself in the stories of Greek Mythology!
                    </h5>
                    <button className='m-3 btn btn-primary' onClick={downloadGame}>Download Now <img src={windowsLogo} alt="Windows Device only" className='mx-3'/></button>
                </div>
            </div>
            <div className="row align-items-center justify-content-center h-auto p-0 m-0 flex-shrink-0 text-end text-white">
                <p>© 2024-present. All rights reserved. NCST S.Y. 2024-2025 PCJS-002 BSCS41-E1 Group 1</p>
            </div>
        </div>
    </>
  )
}

export default LandingPage