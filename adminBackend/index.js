import express from "express";
import cors from "cors";

// Setting up server dependencies
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
app.listen(() => {
    console.log(`Nakama is at ${process.env.NAKAMA_CONSOLE_ADDRESS}`);
});



