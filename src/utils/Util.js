import db from'../config.js';

class Util{
  constructor(){
    
  }
  async addFeedPost(information, callback){
    const {data, image} = information;
    let query, queryEscuelaid;
    
    console.log(data)
    console.log(values);
    queryEscuelaid = 'SELECT idescuela FROM usuario WHERE id=$1';
    query = "INSERT INTO post( titulo, contenido, idusuario, imagen, idescuela) VALUES($1,$2,$3,$4,$5) RETURNING id"
    
    let escuelaId = await db.one(queryEscuelaid, data.userId);
    console.log(escuelaId);

    let values = [data.titulo, data.contenido, data.userId, image, escuelaId.idescuela];
    let postId = await db.one(query, values);
    console.log(postId);
    callback(postId);
  }

  fetchSinglePost(postId, callback, error){
    let query = "SELECT titulo, contenido, fecha, idusuario, imagen FROM post WHERE id = $1";
    db.one(query, [postId]).then( data => {
      callback(data)
    }).catch(e => {
      console.error(e);
      error();
    });
  } 

  async fetchManyPosts(user_id, page, callback, error){
    const POST_PER_PAGE = 7;
    const OFFSET = POST_PER_PAGE * page;
    let query; 

    query = 'SELECT idescuela FROM usuario WHERE id=$1';
    const ROW = await db.one(query, [user_id]);
    const {idescuela: SCHOOL_ID} = ROW; 
    query = 'SELECT id, titulo, contenido, extract(epoch FROM fecha), idusuario, imagen FROM post WHERE idescuela = $1 ORDER BY fecha DESC LIMIT $2 OFFSET $3'; 
    db.manyOrNone(query, [SCHOOL_ID, POST_PER_PAGE, OFFSET]).then(callback).catch(error);
  }

    async fetchManyOutsideReports(user_id, page, callback, error){
    const POST_PER_PAGE = 7;
    const OFFSET = POST_PER_PAGE * page;
    let query;

    query = 'SELECT idescuela FROM usuario WHERE id=$1';
    const ROW = await db.one(query, [user_id]);
    const {idescuela: SCHOOL_ID} = ROW;
    console.log(SCHOOL_ID)
    query = 'SELECT id, asunto, descripcion, latitude, longitude, extract(epoch FROM fecha), lugar FROM emergencia WHERE idescuela = $1 AND dentro = FALSE  ORDER BY fecha DESC LIMIT $2 OFFSET $3'; 
    console.log(SCHOOL_ID, POST_PER_PAGE, OFFSET)
    db.manyOrNone(query, [SCHOOL_ID, POST_PER_PAGE, OFFSET]).then(callback).catch(error);
  }

  async fetchManyInsideReports(user_id, page, callback, error){
    const POST_PER_PAGE = 7;
    const OFFSET = POST_PER_PAGE * page;
    let query;

    query = 'SELECT idescuela FROM usuario WHERE id=$1';
    const ROW = await db.one(query, [user_id]);
    const {idescuela: SCHOOL_ID} = ROW;
    console.log(SCHOOL_ID)
    query = 'SELECT id, asunto, descripcion, lugar, extract(epoch FROM fecha) , latitude, longitude FROM emergencia WHERE idescuela = $1 AND dentro = TRUE  ORDER BY fecha DESC LIMIT $2 OFFSET $3'; 
    console.log(SCHOOL_ID, POST_PER_PAGE, OFFSET)
    db.manyOrNone(query, [SCHOOL_ID, POST_PER_PAGE, OFFSET]).then(callback).catch(error);
  }

    emailValidation(validationData, callback){
        let query;
        query = "SELECT COUNT(*) as  count FROM usuario WHERE email = $1;"
    
        db.one(query, validationData.email).then(
            (data) => {
            
          if(data.count == 1){
            callback({"used":true});
          }
          else{
            callback({"used":false});
          }
        })
    }

    registeredSchool(validationData, callback){

      let query = "SELECT COUNT(*) as count FROM administrador WHERE idusuario = $1 AND escuelaregistrada = true"
      console.log(query) 
      db.one(query, validationData.userCode).then((data) => {
        if(data.count > 0){
          callback({"registered":true});
        }
        else{
          callback({"registered":false});
        }
      })
    
    }


    validateSchoolCode(validationData, callback){

      let query = "SELECT COUNT(*) as count FROM escuela WHERE id = $1 AND codigo = $2"
      db.one(query, [validationData.schoolId, validationData.schoolCode]).then(
        (data) => {
      if(data.count > 0){
        callback({"validated":true});
        query="UPDATE escuela SET validada = TRUE WHERE id = $1"
        db.none(query,validationData.schoolId)
      }
      else{
        callback({"validated":false});
      }
    })
    }




    validSchool(validationData, callback){
      let query = "SELECT COUNT(*) as count FROM escuela WHERE id = $1 AND validada = TRUE"
      db.one(query, validationData.schoolId).then((data)=>{
        if(data.count>0){
          callback({"validated":true});
        }
        else{
          callback({"validated":false});
        }
      })
    }

    hasTwoFactor(validationData, callback){
      let query = "SELECT two_factor FROM usuario WHERE id = $1"
      db.one(query, validationData.userId).then((data)=>{
        if(data!=null)
        {
          callback(data)
        }
        else{

          callback(data)
        }
      });
    }

    findSchoolByCode(validationData, callback){
      let query = "SELECT COUNT (*) as count FROM escuela WHERE codigo = $1";
      db.one(query,validationData.schoolCode).then((data)=>{
        if(data.count > 0){
          callback({"validated":true})
        }
        else{
          callback({"validated":false})
        }
      });
    }

    addSchoolToTeacher(validationData, callback){
      let query = "UPDATE profesor SET idescuela = $1 WHERE idusuario = $2 "
      db.none(query, [validationData.schoolId, validationData.userId]).then(callback).catch((e)=>{
        console.error(e);
      });

    }
    
    teacherHasSchool(validationData, callback){
      let query = "SELECT COUNT (*) as count FROM profesor WHERE idusuario = $1 AND idescuela <> ''";
      db.one(query,validationData.userId).then((data)=>{
        if(data.count > 0){
          callback({"validated":true})
        }
        else{
          callback({"validated":false})
        }
      });
    }

    getTeacherGroups(requestData, callback){
      let query = "SELECT id,nombre, codigo FROM grupo WHERE profesorid = $1";
      db.manyOrNone(query, requestData.userId).then((data)=>{
        if(data!=null)
        {
          callback(data)
        }
        else{

          callback(data)
        }
      });
    }

    getAllGroups(requestData, callback){
      let query = "SELECT g.id, g.nombre, g.codigo, u.nombre as teacher, u.apellidopaterno, u.apellidomaterno, g.id as idgrupo FROM grupo g INNER JOIN profesor p ON (g.profesorid = p.idusuario) INNER JOIN escuela e ON (e.codigo = p.idescuela ) INNER JOIN administrador a ON (CAST(a.idescuela AS INTEGER) = e.id) INNER JOIN usuario u ON (p.idusuario = u.id)  WHERE a.idusuario = $1";
      db.manyOrNone(query, requestData.userId).then((data)=>{
        if(data!=null)
        {
          callback(data)
        }
        else{

          callback(data)
        }
      });
    }

    getStudentGroups(requestData, callback){
      let query = "SELECT g.id,g.nombre, g.codigo, u.nombre as teacher, u.apellidopaterno, u.apellidomaterno FROM grupo g INNER JOIN listaalumnos l ON (l.grupoid = g.id) INNER JOIN profesor p ON (p.idusuario=g.profesorid) INNER JOIN usuario u ON (p.idusuario = u.id) WHERE l.alumnoid = $1";
      db.manyOrNone(query, requestData.userId).then((data)=>{
        if(data!=null)
        {
          callback(data)
        }
        else{

          callback(data)
        }
      });
    }

    addReport(reportData, callback){
      let query = "INSERT INTO emergencia(asunto,descripcion,lugar,fecha,idescuela,dentro,latitude,longitude) VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
      db.none(query, [reportData.asunto, reportData.description, reportData.place, reportData.date, reportData.schoolId, reportData.inside,reportData.lat,reportData.lng]).then(callback).catch((e)=>{
        console.error(e);
      });

    }

    addGroup(validationData, callback){
      let query = "INSERT INTO grupo(nombre,profesorid,codigo) VALUES($1,$2,$3)"
      db.none(query, [validationData.className, validationData.userId, Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10)]).then(callback).catch((e)=>{
        console.error(e);
      });

    }

    addStudentGroup(validationData, callback){
      let query = "SELECT g.id as groupid FROM grupo g INNER JOIN profesor p ON (p.idusuario = g.profesorid) INNER JOIN escuela e ON (e.codigo = p.idescuela) INNER JOIN usuario u ON (u.idescuela = e.id) WHERE g.codigo = $1 AND e.id = (SELECT idescuela FROM usuario WHERE id = $2) LIMIT 1"

      db.oneOrNone(query, [validationData.groupId, validationData.userId]).then((data)=>{
        if(data!=null){
          query = "SELECT * FROM listaalumnos WHERE grupoid = $1 AND alumnoid = $2"


          db.oneOrNone(query,[data.groupid,validationData.userId]).then((data1)=>{
            if(data1==null){

              console.log("terminado")
              query = "INSERT INTO listaalumnos(grupoid,alumnoid) VALUES($1,$2)"
              db.none(query, [data.groupid, validationData.userId]).then(callback).catch((e)=>{
                console.error(e);
              });
              callback({"validated":true})
            }
            else{
              callback({"validated":false})
            }

          });

        }
        else{
          callback({"validated":false})
        }
      });

    }

    getAllLists(validationData, callback){
      let query = "SELECT u.nombre as anombre, u.apellidopaterno as aapellidopaterno, u.apellidomaterno as aapellidomaterno, g.id as idgroup FROM usuario u INNER JOIN listaalumnos l ON (l.alumnoid = u.id) INNER JOIN grupo g ON (g.id = l.grupoid) WHERE l.grupoid IN ( "
      let values = ""
      let i = 1 
      validationData.listId.map(() =>{
        values+=" $"+i+","
        i++
      });
      values = values.slice(0, -1)
      query+=values+" ) "
       db.manyOrNone(query, validationData.listId.map((ids)=>{return ids.id})).then ((data)=>{
        if(data!= null){

          callback(data)
        }
        else{
          console.log(false)
          callback({"validated":false})
        }
      })
  }
  getTeacherLists(validationData, callback){
    let query = "SELECT u.nombre as anombre, u.apellidopaterno as aapellidopaterno, u.apellidomaterno as aapellidomaterno, g.id as idgroup FROM usuario u INNER JOIN listaalumnos l ON (l.alumnoid = u.id) INNER JOIN grupo g ON (g.id = l.grupoid) WHERE g.profesorid = $1 "

     db.manyOrNone(query, validationData.teacherId).then ((data)=>{
      if(data!= null){

        callback(data)
      }
      else{
        console.log(false)
        callback({"validated":false})
      }
    })
  }

  deleteGroups(group, callback){
    let query = 'DELETE FROM grupo WHERE id = $1';
    db.none(query, group.groupID).then(callback).catch(e => {
      console.log(e);
    });

    query = 'DELETE FROM listaalumnos WHERE grupoid = $1';
    db.none(query, group.groupID).then(callback).catch(e => {
      console.log(e);
    });
  }

    studentHasSchool(validationData, callback){
      let query = "SELECT COUNT (*) as count FROM alumno WHERE idusuario = $1 AND codigo <> ''";
      db.one(query,validationData.userId).then((data)=>{
        if(data.count > 0){
          callback({"validated":true})
        }
        else{
          callback({"validated":false})
        }
      });
    }

    assignSchool(validationData, callback){
      let query = "UPDATE alumno SET codigo = $1 WHERE idusuario = $2 ";
      db.none(query,[Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10), validationData.userId]).then(callback).catch((e)=>{
        console.error(e);
      });
      console.log(validationData.schoolCode)
      query = "UPDATE usuario SET idescuela = (SELECT id FROM escuela WHERE codigo = $1) WHERE id = $2"
      db.none(query,[validationData.schoolCode, validationData.userId]).then(callback).catch((e)=>{
        console.error(e);
      });

    }


    parentHasStudent(validationData,callback){
      let query = "SELECT COUNT (*) as count FROM tutor WHERE idalumno <> 0 AND idusuario = $1;";

      db.one(query, validationData.userId).then((data)=>{
        if(data.count > 0){
          callback({"validated":true})
        }
        else{
          callback({"validated":false})
        }
      });
    }

    studentExist(validationData, callback){
      let query = "SELECT COUNT (*) as count FROM alumno WHERE codigo = $1"
      db.one(query,validationData.studentCode).then((data)=>{
        if(data.count > 0){
          callback({"validated":true})
        }
        else{
          callback({"validated":false})
        }
      });
    }

    assignStudentToParent(validationData, callback){
      let query = "UPDATE tutor SET idalumno = (SELECT idusuario FROM alumno WHERE codigo=$1) WHERE idusuario = $2 ";
      db.none(query,[validationData.studentCode, validationData.userId]).then(callback).catch((e)=>{
        console.error(e);
      });

    }

    

  addJWTSession(userId, userToken, callback){
    const query = 'INSERT INTO sesiones(user_id,json_web_token) VALUES($1,$2)';
    db.none(query, [userId, userToken]).then(callback).catch((e) => {
      console.error(e);
    });
  }

  deleteJWTSession(userId, userToken, callback){
    const query = 'DELETE FROM sesiones WHERE user_id = $1 AND json_web_token = $2';
    db.none(query, [userId, userToken]).then(callback).catch((e) => {
      console.log(e);
    })
  }

  deleteExpiredJWTSession(userToken, callback){
    const query = 'DELETE FROM sesiones WHERE json_web_token = $1';
    db.none(query, [userToken]).then(callback).catch(e => {
      console.log(e);
    })
  }

  getUserIdByJWTSession(userToken, callback){
    const query = 'SELECT user_id FROM sesiones WHERE json_web_token = $1';
    db.oneOrNone(query, [userToken]).then(callback).catch(e => {
      console.log(e);
    })
  }

  getUserDataForLoginByUserId(userId, callback){
    const query = 'SELECT usuario, pass, id, tipo, nombre, apellidopaterno AS ap, apellidomaterno AS am FROM usuario WHERE id = $1';
    db.oneOrNone(query, [userId]).then(callback).catch(e => {
      console.log(e);
    })
  }


  getSchoolTeachers(requestData, callback){
    const query = "SELECT id, nombre, apellidopaterno, apellidomaterno, email FROM usuario WHERE id IN ((SELECT idusuario FROM profesor WHERE idescuela = (SELECT codigo FROM escuela WHERE id=$1)))";
    db.manyOrNone(query, requestData.schoolId).then((data)=>{
      if(data!=null)
      {
        callback(data)
      }
      else{

        callback(data)
      }
    });
  }

  deleteTeacher(requestData, callback){
    const query = 'DELETE FROM profesor WHERE idusuario = $1';
    db.none(query, requestData.userId).then(callback).catch(e => {
      console.log(e);
    });
  }


  getChatConfig(requestData, callback){
    const query = 'SELECT alumno_alumno, alumno_profesor, profesor_profesor, profesor_tutor, profesor_admin, galumno_profesor FROM chatconfig WHERE idescuela = $1';
    db.oneOrNone(query, requestData.schoolId).then((data)=>{
      if(data!=null)
      {
        callback(data)
      }
      else{

        callback(data)
      }
    });
  }

  setChatConfig(requestData, callback){
    console.log(requestData)
    db.tx(t =>{
      const{settings,schoolId} = requestData
      const qarray = settings.map(element => {
        let query = `UPDATE chatconfig SET ${element.dbName} = $1 WHERE idescuela = $2`;
        return t.none(query, [element.val,schoolId]);
      });
      return t.batch(qarray);})
    .then(data=>{
      console.log(data)
      callback(data)
    })
    .catch(error=>{
      console.error(error)});
    


  }

  getReports(requestData, callback){
    const query = "SELECT rep.mensajeid, rep.mensaje, us.nombre, us.apellidopaterno, us.apellidomaterno FROM reporte rep, usuario us, escuela es WHERE rep.escuelaid = $1 AND es.id = rep.escuelaid AND us.id = rep.userid";
    db.manyOrNone(query, requestData.schoolId).then((data)=>{
      if(data!=null)
      {
        console.log(data)
        callback(data)
      }
      else{

        callback(data)
      }
    });
  }

  schoolHasManual(requestData, callback){
    const query = "SELECT manualpdf FROM escuela WHERE id = $1";
    db.oneOrNone(query, requestData.schoolId).then((data)=>{
      console.log(data)
        if(data.manualpdf == null){
          callback({'hasManual':false})
        }
        else{
          callback({'hasManual':true})
        }
    });
  }

  async addManual(information, callback){

    const {data, image} = information;
 
    let query;
    
    query = "UPDATE escuela SET manualpdf = $1 WHERE id = $2"
 

    let values = [image, data.schoolId];
    await db.none(query, values);
    callback();
  }

  getManual(requestData, callback){
    const query = "SELECT manualpdf FROM escuela WHERE id = $1"
    db.oneOrNone(query, requestData.schoolId).then((data)=>{
      console.log(data)
      callback(data)
    });
  }

  schoolHasMap(requestData, callback){
    const query = "SELECT mapa FROM escuela WHERE id = $1";
    db.oneOrNone(query, requestData.schoolId).then((data)=>{
      console.log(data)

      if(data.mapa == null){
        callback({'hasMap':false})
        console.log('false')

      }
      else{
        callback({'hasMap':true})

        console.log('true')
      }
    });
  }

  async addSchoolMap(information, callback){
    const {data, image} = information;
    let query;
     
    query = "UPDATE escuela SET mapa = $1 WHERE id = $2";
    
    let values = [image, data.schoolId];
    await db.one(query, values);
    callback();
  }

  async getSchoolMap(schoolId, callback, error){
    const query = 'SELECT mapa FROM escuela WHERE id=$1'; 
    db.one(query, [schoolId]).then(callback).catch(error);
  }


}

export default Util;
