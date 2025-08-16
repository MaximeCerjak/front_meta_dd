import express from "express";
import dotenv from "dotenv";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import multiChatSimulatorRoutes from "./routes/multiChatSimulatorRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 6000;

app.use(express.json());

app.use("/api", chatbotRoutes);
app.use("/api/multiplayer", multiChatSimulatorRoutes);

app.listen(port, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
});
