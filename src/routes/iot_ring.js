// routes/iot_ring.js
import { Router } from "express";
import db from "../db/knex.js";
const router = Router();

// import auth from '../middleware/auth.js'; // jwt auth middleware
// Si quieres protegerla con JWT:
// router.use(requireAuth);

// GET /api/ring -> color actual
router.get("/", async (req, res) => {
    try {
        const ring = await db("ring_color").first();
        if (!ring) {
            return res.status(404).json({ error: "Ring color no configurado" });
        }

        res.json({
            red: ring.red,
            green: ring.green,
            blue: ring.blue,
            brightness: ring.brightness,
        });
    } catch (error) {
        console.error("Error al obtener ring color:", error);
        res.status(500).json({ error: "Error al obtener ring color" });
    }
});

// PUT /api/ring
// Body: { red: 0-255, green: 0-255, blue: 0-255, brightness?: 0-255 }
router.put("/", async (req, res) => {
    let { red, green, blue, brightness } = req.body;

    // Validación simple
    const isValid = (v) =>
        typeof v === "number" && v >= 0 && v <= 255 && Number.isInteger(v);

    if (![red, green, blue].every(isValid)) {
        return res
            .status(400)
            .json({ error: "red, green y blue deben ser enteros 0-255" });
    }

    if (brightness !== undefined && !isValid(brightness)) {
        return res
            .status(400)
            .json({ error: "brightness debe ser entero 0-255" });
    }

    try {
        const ring = await db("ring_color").first();
        if (!ring) {
            return res.status(404).json({ error: "Ring color no configurado" });
        }

        const dataUpdate = {
            red,
            green,
            blue,
            updated_at: db.fn.now(),
        };

        if (brightness !== undefined) {
            dataUpdate.brightness = brightness;
        }

        await db("ring_color").where({ id: ring.id }).update(dataUpdate);

        const updated = await db("ring_color").where({ id: ring.id }).first();

        res.json({
            red: updated.red,
            green: updated.green,
            blue: updated.blue,
            brightness: updated.brightness,
        });
    } catch (error) {
        console.error("Error al actualizar ring color:", error);
        res.status(500).json({ error: "Error al actualizar ring color" });
    }
});

export default router;
