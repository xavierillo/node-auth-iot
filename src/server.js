import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import iotRoutes from "./routes/iot.js";
import iotLedRoutes from "./routes/iot_led.js";
import iotRingRoutes from "./routes/iot_ring.js";
import auth from "./middleware/auth.js";
import adminUsersRoutes from "./routes/admin_users.js"; // 👈 nuevo

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ ok: true, status: "Node auth sample running" });
});

app.use("/auth", authRoutes);
app.use("/", profileRoutes);
app.use("/iot", iotRoutes);
app.use("/api", iotLedRoutes);
app.use("/api/ring", iotRingRoutes);

// Rutas de administración de usuarios (todas protegidas por auth+isAdmin)
app.use("/api/admin/users", adminUsersRoutes);

// Example protected route
app.get("/protected-ping", auth, (req, res) => {
    res.json({ ok: true, userId: req.userId, ts: Date.now() });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
