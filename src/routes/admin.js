import bcrypt from 'bcrypt';
import db from'../config.js';
import {Router} from 'express';
import Util from '../utils/Util';

const router = Router();
const dbQueries = new Util();



router.post('/register', (req,res) =>{
  const newAdmin = req.body;
  let query;
  bcrypt.hash(newAdmin.adminPass, 10, function(err, hash) {
    query = 'INSERT INTO usuario(usuario,pass,email,nombre,apellidopaterno,apellidomaterno,tipo) VALUES($1,$2,$3,$4,$5,$6,$7) ';
    db.none(query,[newAdmin.user, hash, newAdmin.email,newAdmin.firstName,newAdmin.firstLastName,newAdmin.secondLastName,newAdmin.usertType]).then( () =>{
      query = 'SELECT id FROM usuario  WHERE usuario = $1'
      db.one(query,newAdmin.user).then( (data) => {
        query = 'INSERT INTO administrador(idusuario) VALUES($1)'
        db.none(query,[data.id])
        res.send({"status":"ok","adminId":data.id});
      });
    })
  });
});

  router.post('/uservalidation', (req,res) => {
    const validationData = req.body;
    let query;
    query = "SELECT COUNT(*) as  count FROM usuario WHERE usuario = $1;"

    db.one(query, validationData.user).then((data) => {
      if(data.count == 1){
        res.send({"used":true});
      }
      else{
        res.send({"used":false});
      }
    })

  });

  router.post('/getschoolteachers', (req,res)=>{
    const requestData = req.body;
    dbQueries.getSchoolTeachers(requestData, (data)=>{
        res.send(data)
    });
  });

  /*
  router.post('/emailvalidation', (req,res) => {
    const validationData = req.body;
    let query;
    query = "SELECT COUNT(*) as  count FROM usuario WHERE email = $1;"

    db.one(query, validationData.email).then((data) => {
      if(data.count == 1){
        res.send({"used":true});
      }
      else{
        res.send({"used":false});
      }
    })

  });
  */

export default router;
