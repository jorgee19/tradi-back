import bcrypt from 'bcrypt';
import db from'../config.js';
import {Router} from 'express';
import Util from '../utils/Util';
import multer from 'multer';
import { restart } from 'nodemon';

const router = Router();
const dbQueries = new Util();



  router.post('/schoolhasmanual', (req,res)=>{
    const requestData = req.body;
    dbQueries.schoolHasManual(requestData, (data)=>{  

        res.send(data)
    });
  });

  router.post('/add', multer().single("file"), (req, res) => {
    let data = req.body;
    let file = req.file;
    dbQueries.addManual({'data': data, 'image': file.buffer}, (r)=>{
        
    })
    res.sendStatus(200);
  });

  router.get('/get/:schoolId', (req, res) => {
    const {schoolId} = req.params
    dbQueries.getManual({'schoolId': schoolId}, (data) =>{ 
      console.log(data.manualpdf)
      res.writeHead(200, [['Content-Type','application/pdf'],['Content-Disposition', 'attachment; filename=manual.pdf;']]);
      res.end(Buffer.from(data.manualpdf,'base64'))
      //res.sendStatus(200);
    }) 
  });


export default router;
