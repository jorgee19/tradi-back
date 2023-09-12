import express from 'express';
import routes from './routes/index.js';
import knn from './knn';
import dotenv from 'dotenv';

const app = new express();

dotenv.config()
const Knn = new knn(process.env.FLASK_URL, process.env.FLASK_PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', (req,res) =>{
  res.send("hola bb");
});

app.use('/login', routes.login);
app.use('/validations', routes.validations);
app.use('/posts', routes.posts);
app.use( Knn.middleware );
app.use('/students', routes.student);
app.use('/parents', routes.parent);
app.use('/admins', routes.admin);
app.use('/teachers', routes.teacher);
app.use('/school', routes.school);
app.use('/chat', routes.chat);
app.use('/group', routes.group)
app.use('/report', routes.report)
app.use('/manual', routes.manual)
app.use('/map', routes.map)





app.listen(5000);
