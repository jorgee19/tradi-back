import {Router} from 'express';
import db from '../config';

const router = Router();

router.post('/register',async (req,res) =>{
    console.log(req.body)
    const {formData,userId} = req.body
    let sql = 'INSERT INTO escuela(nombre,colonia,calle,numexterior,numiterior,codigopostal,sitioweb,codigo) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id';
    let schoolId = await db.one(sql,[formData.schoolName, formData.neighborhood, formData.street, formData.numExt, formData.numInt, formData.postalCode, formData.webSite, Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10)])
    sql = 'UPDATE administrador SET escuelaregistrada = TRUE WHERE idusuario = $1'
    console.log("adminid: " + userId)
    db.none(sql, userId)
    sql = 'UPDATE administrador SET idescuela = $1 WHERE idusuario = $2'
    db.none(sql, [schoolId.id, userId])
    sql = 'INSERT INTO chatconfig(idescuela) VALUES($1)'
    db.none(sql, schoolId.id)
    sql = 'UPDATE usuario SET idescuela = $1 WHERE id = $2'
    db.none(sql, [schoolId.id,userId])
    res.send({"status":"ok","schoolId":schoolId});
});

export default router;
