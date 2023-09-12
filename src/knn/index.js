import axios from 'axios';

import Util from '../utils/Util';
const dbQueries = new Util();


class knn {
    constructor(ipToSend = 'http://localhost', port = '8000'){
        this.axios = axios.create({
            baseURL: `${ipToSend}:${port}`
        })

        this.middleware = this.middleware.bind(this);
        this.sendToFlask = this.sendToFlask.bind(this);
    }

    middleware(req, res, next){
        if(req.method == 'OPTIONS' ){
            return next(); 
        }

        const NOW = new Date();
        let jwt_token = req.body.token;
        let timestamp = {
            hour: NOW.getHours(),
            minute: NOW.getMinutes(),
            day: NOW.getDay(),
        }
        console.log(req.body)
        console.info(`Ruta: ${req.originalUrl}`, Date.now());
        dbQueries.getUserIdByJWTSession(jwt_token,(data) => {
            //console.log(data.user_id);
            this.sendToFlask(data.user_id, timestamp)
        })
        return next();
    }

    //minute % 5 != 0
    //day*24 + hour + (minute / 5 + 1)/60 

    sendToFlask(id, timestamp){
        // Enviar a axios o guardar en DB.
        this.axios.post('knn/getData',{'id': id, 'time': timestamp})
        .then( res => {
            //console.info(res.data);
        }).catch( err => {
            switch(err.errno){
                case -111:
                    console.info("El servicio de KNN esta caido...")
                    break;
                default: 
                    console.info("El estado del KNN esta desconocido, revisar");
                    break;
            }
        })
    }
}

export default knn;