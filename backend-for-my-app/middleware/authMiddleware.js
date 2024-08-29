const jwt = require('jsonwebtoken');
const User = require('../model/User');

//sa intreb de sectretKey

const authenticateJWT = (req,res,next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log('Received Token:', token);
    if(token){
        jwt.verify(token, 'secretKey',(err,user) => { // funcție din biblioteca jsonwebtoken
            if(err)
                return res.sendStatus(403); //forbidden
            req.user=user;//datele decodificate din token daca verificare e ok
            next();
        });
    }else{
        res.sendStatus(401);//unauthorized
    }
};

const authorizeRole =(roles) => (req,res,next) => {
    console.log('User Role:', req.user.role);

    if(roles.includes(req.user.role)){
        next();
    }else{
        res.status(403).send('Forbidden');
    }

};

module.exports = { authenticateJWT, authorizeRole };