import bcrypt from 'bcrypt';
import db from'../config.js';
import {Router} from 'express';
import Util from '../utils/Util';

const router = Router();
const dbQueries = new Util();

router.post('/register', (req,res) => {
    const newTeacher = req.body;
    let query;
    bcrypt.hash(newTeacher.teacherPass, 10, function(err, hash){
        query = 'INSERT INTO usuario(usuario, pass, email, nombre, apellidopaterno, apellidomaterno,tipo) VALUES($1,$2,$3,$4,$5,$6,$7) ';
        db.none(query,[newTeacher.user, hash, newTeacher.email, newTeacher.firstName, newTeacher.firstLastName, newTeacher.secondLastName,newTeacher.usertType]).then( () =>{
            query = 'SELECT id FROM usuario WHERE usuario = $1'
            db.one(query, newTeacher.user).then( (data) =>{
                query = 'INSERT INTO profesor(idusuario) VALUES($1)'
                db.none(query,[data.id])
            });
        });
    });
    res.send({"status": "ok"});
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


  router.post('/addschool', (req,res)=>{
    const validateData = req.body;
    dbQueries.addSchoolToTeacher(validateData,()=>{
      res.send({"status":200})
    });
})



router.post('/hasschool', (req,res)=>{
  const validationData = req.body;
  dbQueries.teacherHasSchool(validationData, (data)=>{
      res.send(data)
  });
});


router.post('/deleteteacher',(req,res)=>{
  const validationData = req.body;
  dbQueries.deleteTeacher(validationData, (data)=>{
      res.send(data)
  });
});

export default router;