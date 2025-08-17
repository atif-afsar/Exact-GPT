const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


async function authUser(req, res, next) {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.id);
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = { authUser };
