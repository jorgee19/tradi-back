import db from'../config.js';
import {Router} from 'express';
import Util from '../utils/Util';
import multer from 'multer';

const router = Router();
const dbQueries = new Util();

router.post("/add", multer().single("file"), (req, res) => {
    let data = req.body;
    let file = req.file;
    dbQueries.addFeedPost({'data': data, 'image': file.buffer}, (r)=>{
        
    })
    res.sendStatus(200);
})

// router.get("/fetch/:postId", (req, res) => {
//     const {postId} = req.params;
//     dbQueries.fetchSinglePost(postId, (data) => {
//         data.postId = postId;
//         //console.log(data); 
//         res.send(data);
//     }, (e) => {
//         res.sendStatus(500);
//     })
// })

router.post("/list/:userId/:page", (req, res) => {
    const {userId, page} = req.params; 

    console.log('page: ' + page)
    console.log('page route : ' + page)
    dbQueries.fetchManyPosts(userId, page, (data) => {
        res.send(data);
    }, (e) => {
        console.error(e);
        res.sendStatus(500)
    })
})

export default router;