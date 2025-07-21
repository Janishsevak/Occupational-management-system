import jwt from 'jsonwebtoken';


const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const origin = req.headers['x-origin'];
        console.log('✅ Received origin in middleware:', origin); // 🔍 LOG HERE

        if (!origin) {
            return res.status(400).json({ message: 'Missing origin in headers' });
        }
        req.user = decoded;
        req.id = decoded.userId;
        req.user.origin = origin; 
        next();
    } catch (error) {
        console.error('Authentication error:', error);
    }
}

export default isAuthenticated;