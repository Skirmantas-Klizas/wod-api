const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        if (req.userData.role === 'Administrator') {
            next();
        } else {
            throw Error;
        }
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};
