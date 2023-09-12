import bcrypt from 'bcrypt';
import db from'../config.js';
import {Router} from 'express';
import Util from '../utils/Util';

const router = Router();
const dbQueries = new Util();



router.post('/register', (req,res) =>{
  const newParent = req.body;
  let query;
  bcrypt.hash(newParent.parentPass, 10, function(err, hash) {
    query = 'INSERT INTO usuario(usuario,pass,email,nombre,apellidopaterno,apellidomaterno,tipo) VALUES($1,$2,$3,$4,$5,$6,$7) ';
    db.none(query,[newParent.user, hash, newParent.email,newParent.firstName,newParent.firstLastName,newParent.secondLastName,newParent.usertType]).then( () =>{
      query = 'SELECT id FROM usuario  WHERE usuario = $1'
      db.one(query,newParent.user).then( (data) => {
        query = 'INSERT INTO tutor(idusuario) VALUES($1)'
        db.none(query,[data.id])
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


  router.post('/hasstudent', (req,res)=>{
    const validationData = req.body;
    dbQueries.parentHasStudent(validationData, (data)=>{
        res.send(data)
    });
  });

  router.post('/studentexist', (req,res) =>{
    const validationData = req.body;
    dbQueries.studentExist(validationData,(data) => {
        res.send(data)
    });
  });

  router.post('/assignstudent', (req,res)=>{
    const validateData = req.body;
    dbQueries.assignSchool(validateData,()=>{
      res.send({"status":200})
    });
  })

  router.post('/assignstudenttoparent', (req,res)=>{
    const validateData = req.body;
    dbQueries.assignStudentToParent(validateData,()=>{
      res.send({"status":200})
    });
  })

  
export default router;
