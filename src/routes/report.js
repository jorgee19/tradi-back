import {Router} from 'express';
import Util from '../utils/Util';
import {Client} from "@googlemaps/google-maps-services-js";

const router = Router();
const dbQueries = new Util();


  router.post('/getreports', (req,res)=>{
    const requestData = req.body;
    dbQueries.getReports(requestData, (data)=>{
        res.send(data)
    });
  });

  router.post('/post', (req,res) =>{ 
    console.log(req.body)
    dbQueries.addReport(req.body);
    res.sendStatus(200);
  });


  router.post("/outside/list/:userId/:page", async (req, res) => {
    const {userId, page} = req.params;
    dbQueries.fetchManyOutsideReports(userId, page, async(data) => {
      
        const client = new Client({});
        try{
          data = await Promise.all(
            data.map(async (report) =>{
              try{
                await client.geocode({
                  params: {
                    latlng: report.latitude+','+report.longitude,
                    key:'',
                    timeout:1000}
                  })
                  .then((r) =>{
                    report.lugar = r.data.results[0].formatted_address; 
                    return report
                  })
              }catch(e){
                console.log(e);
              }finally{
                return report
              }
              
            })
          ) 
      }catch(e){
        console.log(e);
      }finally{
        console.log(data)
        res.send(data);
      }

        
    }, (e) => {
        console.error(e);
        res.sendStatus(500)
    })
})

  router.post("/inside/list/:userId/:page", (req, res) => {
    const {userId, page} = req.params;
    dbQueries.fetchManyInsideReports(userId, page, (data) => {
        res.send(data);
    }, (e) => {
        console.error(e);
        res.sendStatus(500)
    })
})

export default router;
