import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gamePath = path.join(__dirname, 'GameExecutable', 'Theous Kai_12_6_24.exe');
// const gamePath = "C:\\Users\\Lenovo\\Desktop\\Thesis\\nakamaServer\\adminBackend\\GameExecutable\\BRUH.txt";


// const gamePath = "./GameExecutable/Theous Kai_12_6_24.exe"

// Setting up server dependencies
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Nakama is at ${process.env.NAKAMA_CONSOLE_ADDRESS}`);
});

app.get("/download", async (request, response) => {
    console.log("Attempting to download file from:", gamePath);

    response.download(gamePath, "BRUH.txt", (err) => {
        if (err) {
            console.error("Error during file download:", err);
            response.status(500).send("Failed to download file.");
        } else {
            console.log("File successfully sent to client.");
        }
    });
});


import fs from "fs";

fs.access(gamePath, fs.constants.F_OK, (err) => {
    if (err) {
        console.error("File not accessible:", err);
    } else {
        console.log("File is accessible:", gamePath);
    }
});
