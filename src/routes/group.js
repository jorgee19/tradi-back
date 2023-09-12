import {Router} from 'express';
import Util from '../utils/Util';

const router = Router();
const dbQueries = new Util();


router.post('/getteachergroups', (req,res)=>{
    const requestData = req.body;
    dbQueries.getTeacherGroups(requestData, (data)=>{
        res.send(data)
    });
});

router.post('/getallgroups', (req,res)=>{
    const requestData = req.body;
    dbQueries.getAllGroups(requestData, (data)=>{
        res.send(data)
    });
});

router.post('/getstudentgroups', (req,res)=>{
    const requestData = req.body;
    dbQueries.getStudentGroups(requestData, (data)=>{
        res.send(data)
    });
});

router.post('/addgroup', (req,res)=>{
    const requestData = req.body;
    dbQueries.addGroup(requestData, (data)=>{
        res.send(data)
    });
});

router.post('/addstudentgroup', (req,res)=>{
    const requestData = req.body;
    dbQueries.addStudentGroup(requestData, (data)=>{
        res.send(data)
    });
});

router.post('/getalllists', (req,res)=>{
    const requestData = req.body;
    dbQueries.getAllLists(requestData, (data)=>{
        res.send(data)
    });
});

router.post('/getteacherlists', (req,res)=>{
    const requestData = req.body;
    dbQueries.getTeacherLists(requestData, (data)=>{
        res.send(data)
    });
});

router.post('/deletegroup', (req,res)=>{
    const requestData = req.body;
    dbQueries.deleteGroups(requestData, (data)=>{
        res.send(data)
    });
});

export default router;