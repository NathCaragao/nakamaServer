import express, { response } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gamePath = path.join(
  __dirname,
  "GameExecutable",
  "Theous Kai_12_6_24.exe"
);
// const gamePath = "C:\\Users\\Lenovo\\Desktop\\Thesis\\nakamaServer\\adminBackend\\GameExecutable\\BRUH.txt";

// const gamePath = "./GameExecutable/Theous Kai_12_6_24.exe"

// Setting up server dependencies
const app = express();
app.use("*", cors());
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

  if (request.body["username"] != "" && request.body["password"] != "") {
    await axios
      .post(`${process.env.NAKAMA_CONSOLE_ADDRESS}/v2/console/authenticate`, {
        username: adminUsername,
        password: adminPassword,
      })
      .then((result) => {
        return response.status(201).json({ token: result.data["token"] });
      })
      .catch((err) => {
        return response
          .status(501)
          .json({ message: "Error in authenticating admin, try again later." });
      });
  }
});

app.get("/admin/players", async (request, response) => {
  let authToken = request.headers["authorization"];
  if (authToken == null) {
    return response
      .status(401)
      .json({ message: "You are not authorized to do this." });
  }

  await axios
    .get(`${process.env.NAKAMA_CONSOLE_ADDRESS}/v2/console/account`, {
      headers: {
        Authorization: `${authToken}`,
      },
    })
    .then((result) => {
      return response.status(201).json(result.data);
    });
});

app.get("/admin/players/:playerId", async (request, response) => {
  let authToken = request.headers["authorization"];
  if (authToken == null) {
    return response
      .status(401)
      .json({ message: "You are not authorized to do this." });
  }

  await axios
    .get(
      `${process.env.NAKAMA_CONSOLE_ADDRESS}/v2/console/account/${request.params.playerId}`,
      {
        headers: {
          Authorization: `${authToken}`,
        },
      }
    )
    .then((result) => {
      return response.status(201).json(result.data);
    });
});

app.post("/admin/logout", async (request, response) => {
  let authToken = request.headers["authorization"];
  if (authToken == null) {
    return response
      .status(401)
      .json({ message: "You are not authorized to do this." });
  }

  await axios
    .get(
      `${process.env.NAKAMA_CONSOLE_ADDRESS}/v2/console/authenticate/logout`,
      {
        headers: {
          Authorization: `${authToken}`,
        },
      }
    )
    .then(() => {
      return response.status(201).json({ message: "Success!" });
    })
    .catch(() => {
      return response.status(500).json({ message: "Failed!" });
    });
});

app.post("/purchase", async (request, response) => {
  let authToken = request.headers["authorization"];
  if (authToken == null) {
    return response
      .status(401)
      .json({ message: "You are not authorized to do this." });
  }

  const gemAmount = request.body["gemAmount"];
  const phpAmount = request.body["phpAmount"];
  const userId = request.body["userId"];
  const phoneNumber = request.body["phoneNumber"];

  const collection = "playerData";
  const key = "playerInfo";

  let userCurrentData;

  await axios
    .get(
      `${process.env.NAKAMA_CONSOLE_ADDRESS}/v2/console/storage/${collection}/${key}/${userId}`,
      {
        headers: {
          Authorization: `${authToken}`,
        },
      }
    )
    .then((result) => {
      userCurrentData = result.data;
    });

  const dateAndTimeNow = new Date(Date.now());
  const formattedDateAndTimeNow = dateAndTimeNow.toLocaleString("en-PH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Use 12-hour format
  });

  const purchaseInfo = {
    time: formattedDateAndTimeNow,
    gcashNumber: "+639" + phoneNumber,
    gemAmount: Number(gemAmount),
    phpAmount: phpAmount,
  };

  let decodedUserData = JSON.parse(userCurrentData.value);

  // Ensure the property exists and is an array
  if (decodedUserData?.purchaseHistory == undefined) {
    decodedUserData["purchaseHistory"] = []; // Initialize as an empty array if it doesn't exist or isn't an array
  }
  decodedUserData["purchaseHistory"].push(purchaseInfo);
  decodedUserData["premiumCurrency"] =
    decodedUserData["premiumCurrency"] + Number(gemAmount);

  //   if (
  //     decodedUserData["purchaseHistory"] ||
  //     !Array.isArray(decodedUserData["purchaseHistory"])
  //   ) {
  //   }

  // Add an item to the array

  const storageUpdatePayload = {
    value: JSON.stringify(decodedUserData),
    version: userCurrentData.version,
    permission_read: userCurrentData.permission_read,
    permission_write: userCurrentData.permission_write,
  };

  await axios
    .put(
      `${process.env.NAKAMA_CONSOLE_ADDRESS}/v2/console/storage/${collection}/${key}/${userId}`,
      storageUpdatePayload,
      {
        headers: {
          Authorization: `${authToken}`,
        },
      }
    )
    .then((result) => {
      console.log("bruh");
    });

  return response.status(200).json({ message: "Success" });
});

app.get("/player/storage/:playerId", async (request, response) => {
  const collection = "playerData";
  const key = "playerInfo";
  let authToken = request.headers["authorization"];
  await axios
    .get(
      `${process.env.NAKAMA_CONSOLE_ADDRESS}/v2/console/storage/${collection}/${key}/${request.params.playerId}`,
      {
        headers: {
          Authorization: `${authToken}`,
        },
      }
    )
    .then((result) => {
      return response.status(201).json({ result: result.data });
    });
});
