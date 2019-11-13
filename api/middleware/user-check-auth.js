const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        req.userData = jwt.verify(token, process.env.JWT_KEY);
        const userId = req.params.userId;
        if (
            req.userData.userId === userId ||
            req.userData.role === 'Administrator'
        ) {
            next();
        } else {
            throw Error;
        }
    } catch {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};
