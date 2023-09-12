import bcrypt from 'bcrypt';
import db from'../config.js';
import {Router} from 'express';
import Util from '../utils/Util';
import multer from 'multer'; 

const router = Router();
const dbQueries = new Util();



  router.post('/schoolhasmap', (req,res)=>{
    const requestData = req.body;
    dbQueries.schoolHasMap(requestData, (data)=>{  

        res.send(data)
    });
  });

  router.post("/add", multer().single("file"), (req, res) => {
    let data = req.body;
    let file = req.file;
    dbQueries.addSchoolMap({'data': data, 'image': file.buffer}, (r)=>{
        
    })
    res.sendStatus(200);
})



router.post("/get", (req, res) => {
  console.log(req.body)
  const {schoolId}  = req.body;
  console.log('codigo de escuela')
  console.log(schoolId)
  dbQueries.getSchoolMap(schoolId, (data) => {
      res.send(data);
  }, (e) => {
      console.error(e);
      res.sendStatus(500)
  })
})


export default router;
