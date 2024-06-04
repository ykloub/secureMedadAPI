import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { config } from "dotenv";

config({ path: "./.env" });

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "https://library.dctabudhabi.ae",
  optionsSuccessStatus: 200,
};

// app.use(cors(corsOptions));
app.use(cors());

app.post("/generate-token", async (req, res) => {
  console.log("Sending request with username:", process.env.USERID); // Log the username
  console.log("Sending request with password:", process.env.PASSWORD); // Be cautious with logging sensitive information

  try {
    const apiResponse = await fetch(
      "https://okapi-uae.ils.medad.com/authn/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-okapi-tenant": "dctuae",
        },
        body: JSON.stringify({
          username: process.env.USERID, // from .env
          password: process.env.PASSWORD, //from .env
        }),
      }
    );

    const data = await apiResponse.json();
    console.log("API response data:", data); // Log the full API response

    if (apiResponse.ok) {
      res.json({ token: data.okapiToken });
    } else {
      res
        .status(apiResponse.status)
        .json({ message: "Error generating token", details: data });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
