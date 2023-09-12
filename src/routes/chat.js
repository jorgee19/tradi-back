import db from'../config.js';
import {Router} from 'express';
import Util from '../utils/Util';
import {verifyMiddleware} from '../jwt/jwtSigner.js';

const router = Router();
const dbQueries = new Util();

router.use('/contacts', verifyMiddleware);

router.post('/contacts', (req, res) => {
    console.log('Ejecute obtener contactos para chat');
    const {idUser} = req.body;
    const Query = 'SELECT usuario.usuario, nombre, apellidopaterno, apellidomaterno FROM usuario WHERE usuario.usuario<> $1'
    db.any(Query, [idUser]).then( rows => {
        //console.log(rows);
        res.send(rows);
    });
    // console.log(req.body);
    // res.send({status: 'online'});
})


router.post('/getchatconfig', (req,res)=>{
    const requestData = req.body;
    dbQueries.getChatConfig(requestData, (data)=>{
        res.send(data)
    });
  });


router.post('/updatechatconfig', (req,res)=>{
    const requestData = req.body;
    dbQueries.setChatConfig(requestData, (data)=>{
        res.send(data)
    });
  });


export default router;