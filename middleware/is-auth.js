const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    console.log("Authentication Header",authHeader);
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    console.log("Authentication Token",token);
    if (!token || token === '' ){
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        // jwt.verify(token, 'somesupersecretkey', (decodedToken) => {
        //     req.isAuth = true;
        //     req.userId = decodedToken.userId;
        //     next();
        // });
        decodedToken = jwt.verify(token, 'somesupersecretkey');
        console.log('Decoded Token', decodedToken);
    } catch (error) {
        console.log(error);
        req.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
 }