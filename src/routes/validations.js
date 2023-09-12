import {Router} from 'express';
import Util from '../utils/Util';
import db from'../config.js';

const router = Router();
const dbQueries = new Util();

router.post('/email', (req,res) =>{
    const validationData = req.body;
    dbQueries.emailValidation(validationData,(data) => {
        res.send(data)
    });
});

router.post('/registeredschool', (req,res) =>{
    const validationData = req.body;
    dbQueries.registeredSchool(validationData,(data) => {
        res.send(data)
    });
});


router.post('/validateSchoolCode', (req,res) =>{
    const validationData = req.body;
    dbQueries.validateSchoolCode(validationData,(data) => {
        res.send(data)
    });
});

router.post('/hasTwoFactor', (req,res)=>{
    const validationData = req.body;
    dbQueries.hasTwoFactor(validationData, (data)=>{
        res.send(data)
    });
});

router.post('/validSchool', (req,res)=>{
    const validationData = req.body;
    dbQueries.validSchool(validationData, (data)=>{
        res.send(data)
    });
});

router.post('/getschool', (req,res) => {
    const validationData = req.body;
    let query="";
    switch(validationData.userType){
        case 'A':
            query = "SELECT idescuela FROM administrador WHERE idusuario = $1;"
            break;
        case 'T': 
            query = "SELECT idescuela FROM profesor WHERE idusuario = $1;"
            break;
    }
    db.oneOrNone(query, validationData.userId).then((data)=>{
        if(data != null){
          res.send({"idSchool":data.idescuela})
        }
        else{
          res.send({"idSchool":null})
        }

    })
  });

  router.post('/getschoolcode', (req,res) => {
    const validationData = req.body;
    let query="";

    query = "SELECT codigo as schoolcode FROM escuela WHERE id = $1;"

    db.oneOrNone(query, validationData.schoolId).then((data)=>{
        if(data != null){
            console.log(data)
          res.send({"schoolCode":data.schoolcode})
        }
        else{
          res.send({"schoolCode":null})
        }

    })
  });

  router.post('/findschoolbycode', (req,res)=>{
    const validateData = req.body;
    dbQueries.findSchoolByCode(validateData, (data)=>{
        res.send(data)
    })
})

export default router;