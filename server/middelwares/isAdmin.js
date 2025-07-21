import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
        req.user = decoded;
        req.id = decoded.userId;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
    }
}

export default isAdmin;