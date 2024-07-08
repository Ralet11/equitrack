const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const User = require('../models/userModel');

const jwtMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ msg: 'Acceso denegado. No hay token.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Acceso denegado. No hay token.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        

        // Verificar la existencia del usuario en la base de datos
        const user = await User.findOne({
            where: {
                id: decoded.id,
            },
        });

        req.user = user;

        if (!user) {
            return res.status(401).json({ msg: 'Acceso denegado. No hay token.' });
        }

        next();
    } catch (error) {
        //console.error('Error al validar el token:', error);
        res.status(401).json({ msg: 'Token no válido.' });
    }
};

module.exports = jwtMiddleware;