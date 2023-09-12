import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

class jwtSigner {
    constructor(){
        this._TOKEN = (process.env.SECRET_JWT || "secret");
    };

    signToken(payload, callback){
        const JWT_TOKEN = jwt.sign(payload, this._TOKEN, {expiresIn: "24h"});
        callback(JWT_TOKEN);
    }

    verify(token, callback){
        try{
            const decoded = jwt.verify(token, this._TOKEN);
            callback(null,decoded);

        } catch(err) {
            callback(err, null);
        }

    }
}

function verifyMiddleware(req, res, next){
    console.log(req.body);
    if(req.method == 'OPTIONS' ){
        return next(); 
    }
    const JWT = new jwtSigner();
    console.log(`METHOD: ${req.method} ROUTE: ${req.url}`);
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log(`token: ${token}`);
    if( token === null){
        console.log("Un token es requerido para la autentificacion")
        return res.status(403).send("Un token es requerido para la autentificacion");
    }
    JWT.verify(token, (err, decoded) => {
        if(err !== null){

            console.log("Hay errores");
            return res.status(403).send("Un token es requerido para la autentificacion");
        } else {
            console.log(decoded);
            console.log('Token Valido');
            return next();
        }
    });
}

export default jwtSigner;

export {verifyMiddleware};