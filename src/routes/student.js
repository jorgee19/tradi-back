import bcrypt from 'bcrypt';
import db from'../config.js';
import {Router} from 'express';
import Util from '../utils/Util';

const router = Router();
const dbQueries = new Util();




router.post('/register', (req,res) =>{
  const newStudent = req.body;
  let query;
  bcrypt.hash(newStudent.studentPass, 10, function(err, hash) {
    query = 'INSERT INTO usuario(usuario,pass,email,nombre,apellidopaterno,apellidomaterno,tipo) VALUES($1,$2,$3,$4,$5,$6,$7) ';
    db.none(query,[newStudent.user, hash, newStudent.email,newStudent.firstName,newStudent.firstLastName,newStudent.secondLastName,newStudent.usertType]).then( () =>{
      query = 'SELECT id FROM usuario  WHERE usuario = $1'
      db.one(query,newStudent.user).then( (data) => {
        query = 'INSERT INTO alumno(idusuario) VALUES($1)'
        db.none(query,data.id)
      });
    })
  });
  res.send({"status":"ok"});
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

  router.post('/hasschool', (req,res)=>{
    const validationData = req.body;
    dbQueries.studentHasSchool(validationData, (data)=>{
        res.send(data)
    });
});


router.post('/assignschool', (req,res)=>{
  const validateData = req.body;
  dbQueries.assignSchool(validateData,()=>{
    res.send({"status":200})
  });
})

export default router;
