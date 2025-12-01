// src/routes/admin_users.js
import { Router } from 'express';
import db from '../db/knex.js';
import auth, { isAdmin } from "../middleware/auth.js";
const router = Router();
import bcrypt from 'bcryptjs';

// Proteger TODAS las rutas de este router:
// Primero JWT válido, luego rol admin
router.use(auth, isAdmin);

/**
 * GET /api/admin/users
 * Lista todos los usuarios (sin password_hash)
 */
router.get("/", async (req, res) => {
    try {
        const users = await db("users")
            .select("id", "name", "last_name", "email", "role", "created_at")
            .orderBy("id", "asc");

        res.json({ success: true, users });
    } catch (error) {
        console.error("Error al listar usuarios:", error);
        res.status(500).json({ success: false, message: "Error al listar usuarios" });
    }
});

/**
 * GET /api/admin/users/:id
 * Obtiene un usuario por ID
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await db("users")
            .select("id", "name", "last_name", "email", "role", "created_at")
            .where({ id })
            .first();

        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ success: false, message: "Error al obtener usuario" });
    }
});

/**
 * POST /api/admin/users
 * Crea un nuevo usuario
 * Body esperado:
 * {
 *   "name": "Ana",
 *   "last_name": "Pérez",
 *   "email": "ana@example.com",
 *   "password": "123456",
 *   "role": "admin" | "user"
 * }
 */
router.post("/", async (req, res) => {
    const { name, last_name, email, password, role } = req.body;

    if (!name || !last_name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "name, last_name, email y password son obligatorios",
        });
    }

    const userRole = role === "admin" ? "admin" : "user"; // default "user"

    try {
        // Verificar si el email ya existe
        const existing = await db("users").where({ email }).first();
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Ya existe un usuario con ese email",
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const [newId] = await db("users").insert(
            {
                name,
                last_name,
                email,
                password_hash,
                role: userRole,
            },
            ["id"]
        );

        const createdUser = await db("users")
            .select("id", "name", "last_name", "email", "role", "created_at")
            .where({ id: typeof newId === "object" ? newId.id : newId })
            .first();

        res.status(201).json({
            success: true,
            user: createdUser,
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ success: false, message: "Error al crear usuario" });
    }
});

/**
 * PUT /api/admin/users/:id
 * Actualiza datos de un usuario
 * Campos opcionales: name, last_name, email, password, role
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, last_name, email, password, role } = req.body;

    try {
        const user = await db("users").where({ id }).first();
        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (last_name !== undefined) updateData.last_name = last_name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role === "admin" ? "admin" : "user";

        if (password) {
            updateData.password_hash = await bcrypt.hash(password, 10);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No hay campos para actualizar",
            });
        }

        updateData.updated_at = db.fn.now();

        await db("users").where({ id }).update(updateData);

        const updatedUser = await db("users")
            .select("id", "name", "last_name", "email", "role", "created_at")
            .where({ id })
            .first();

        res.json({
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ success: false, message: "Error al actualizar usuario" });
    }
});

/**
 * DELETE /api/admin/users/:id
 * Elimina un usuario por ID
 * (opcional: impedir que un admin se borre a sí mismo)
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await db("users").where({ id }).first();
        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        // (Opcional) Evitar que un admin se borre a sí mismo:
        // if (req.userId === user.id) { ... }

        await db("users").where({ id }).del();

        res.json({
            success: true,
            message: "Usuario eliminado correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ success: false, message: "Error al eliminar usuario" });
    }
});

export default router;
