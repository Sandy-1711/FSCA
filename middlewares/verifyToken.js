const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {

    const authHeader = req.headers.token;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {        
        if (err) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        req.user = user;
        if (user._id !== req.params.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        next();
    })
}

module.exports = { verifyToken }