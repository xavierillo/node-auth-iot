import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';


/**
 * Authorization middleware
 * Checks for Authorization: Bearer <token>
 * Attaches req.userId, req.userRole, req.userEmail on success.
 */
export default function auth(req, res, next) {
    // Por seguridad, por si req o headers vienen undefined por algún mal uso
    if (!req || !req.headers) {
        return res.status(401).json({
            success: false,
            message: 'Missing request headers'
        });
    }

    const header = req.headers.authorization || '';
    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({
            success: false,
            message: 'Missing or invalid Authorization header'
        });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        req.userId = payload.id;        // del tokenUser()
        req.userRole = payload.role;
        req.userEmail = payload.email;

        next();
    } catch (e) {
        console.error('JWT error:', e.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}

export function isAdmin(req, res, next) {
    if (req.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Solo administradores" });
    }
    next();
}
