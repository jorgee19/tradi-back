import bcrypt from 'bcrypt';
import db from'../config.js';
import {Router} from 'express';
import jwtSigner from '../jwt/jwtSigner.js';
import Util from '../utils/Util.js';

const router = Router();

router.post('/logout', (req, res) => {
  const DBqueries = new Util();
  const {jwt_token, user_id} = req.body;
  DBqueries.deleteJWTSession(user_id, jwt_token, (event) => {
    console.log(event);
    res.send({message: 'Se cerro sesion'});
  })
})

router.post('/jwt-login',(req, res) => {
  const DBqueries = new Util();
  const {jwt_token, id: user_id} = req.body.user;
  const Verifier = new jwtSigner();

  const Response = {
    status: null,
    isValid: null,
    userData: null
  }

  // console.log(`El usuario ${id} quiere ingresar con el token ${jwt_token}`)
  Verifier.verify(jwt_token, (err, decoded) => {
    if(err){
      Response.isValid = false;
      Response.status = err.message;
      switch (err.name){
        case 'TokenExpiredError': // Expiro el token, se debe eliminar de la base de datos
          console.log('Borrar base de datos.');
          DBqueries.deleteExpiredJWTSession(jwt_token, () => {
            console.log("Se ha borrado la sesion expirada");
          });
          break;
        default:
          Response.status = err.message;
          break;
      }
      res.send(Response);
    } else {

      DBqueries.getUserIdByJWTSession(jwt_token, (row) => {
        if( row === null || user_id != row.user_id ){
          Response.isValid = false;
          Response.status = 'jwt-not-table';
          res.send(Response);
        } else {
          Response.isValid = true;
          DBqueries.getUserDataForLoginByUserId(decoded.user_id, (data) => {
            console.log(data);
            Response.userData = {
              "status" : "valido", 
              "userType":data.tipo,
              "schoolId":0, 
              "userId":data.usuario,
              "nombre":data.nombre, 
              "apaterno":data.ap, 
              "amaterno":data.am, 
              "userCode":data.id,
              'token': jwt_token
            }
            res.send(Response);
          })
        }
      })
    }
    
  });

});

router.post('/', (req,res) =>{
  const DBqueries = new Util();
  const {user,pass} = req.body;
  let query = 'SELECT usuario,pass,id,tipo, nombre, apellidopaterno AS ap, apellidomaterno AS am FROM usuario WHERE usuario = $1';
  db.oneOrNone(query,[user]).then( async (data) => {
    if(data===null){
      res.send({"status" : "invalido"});
      return
    }
    else{
      
        let comparisson = await bcrypt.compare(pass,data.pass);
        if(comparisson){
          const Signer = new jwtSigner();
          Signer.signToken( {'user_id': data.id},(token) => {
            // Se envia el token al front
            res.send({
              "status" : "valido", 
              "userType":data.tipo,
              "schoolId":0, 
              "userId":data.usuario,
              "nombre":data.nombre, 
              "apaterno":data.ap, 
              "amaterno":data.am, 
              "userCode":data.id,
              "token": token
            });

            // Se guarda en la base de datos.
            DBqueries.addJWTSession(data.id, token,() => {
              //console.log(`El usuario ${data.id} tiene el token ${token}`);
            })            
          });
          // res.send({"status" : "valido", "userType":data.tipo, "schoolId":0, "userId":data.usuario,"nombre":data.nombre, "apaterno":data.ap, "amaterno":data.am, "userCode":data.id});
        }
        else{
          res.send({"status" : "invalido"});
        }

    }
  });

});

export default router;
