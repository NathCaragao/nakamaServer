import express, { response } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import axios from "axios";

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

    response.download(gamePath, "Theous Kai.exe", (err) => {
        if (err) {
            console.error("Error during file download:", err);
            response.status(500).send("Failed to download file.");
        } else {
            console.log("File successfully sent to client.");
        }
    });
});

app.post("/admin/login", async (request, response) => {
    const adminUsername = request.body["username"];
    const adminPassword = request.body["password"];

    if(request.body["username"] != "" && request.body["password"] != "") {
        await axios.post(`http://${process.env.NAKAMA_CONSOLE_ADDRESS}/v2/console/authenticate`, {
            "username": adminUsername,
            "password": adminPassword,
        }).then((result) => {
            return response.status(201).json({token: result.data["token"]})
        }).catch((err) => {
            return response.status(501).json({message: "Error in authenticating admin, try again later."})
        });
    }
});

app.get("/admin/players", async(request, response) => {
    let authToken = request.headers['authorization'];
    if(authToken == null) {
        return response.status(401).json({message: "You are not authorized to do this."});
    }

    await axios.get(`http://${process.env.NAKAMA_CONSOLE_ADDRESS}/v2/console/account`, {
        headers: {
            Authorization: `${authToken}`
        }
    }).then((result) => {
        return response.status(201).json(result.data);
    });
});

app.get("/admin/players/:playerId", async(request, response) => {
    let authToken = request.headers['authorization'];
    if(authToken == null) {
        return response.status(401).json({message: "You are not authorized to do this."});
    }

    await axios.get(`http://${process.env.NAKAMA_CONSOLE_ADDRESS}/v2/console/account/${request.params.playerId}`, {
        headers: {
            Authorization: `${authToken}`
        }
    }).then((result) => {
        return response.status(201).json(result.data);
    });
});

