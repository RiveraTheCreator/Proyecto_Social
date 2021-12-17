let express = require('express');
let path = require('path');
const session = require('express-session');
const publicPath = path.join(__dirname,"./public");
const app = express();
const fs = require('fs');
const projectsFilePath = path.join(__dirname, '/data/projectos.json');
let projects = JSON.parse(fs.readFileSync(projectsFilePath, 'utf-8'));
const categoriesFilePath = path.join(__dirname, '/data/categorias.json');
let categories = JSON.parse(fs.readFileSync(categoriesFilePath, 'utf-8'));
const PORT = 3000;

//Controller
const controllerProjects = {
    listar: (req,res) => {
        let selectedProjects = [];
        let categoria = req.params.id;
        categoria = parseInt(categoria);
        req.session.value = categoria;
        if(categoria > projects.length ){
            return res.redirect('/');
        }
        projects.forEach(proyecto => {
          let proyectOne = proyecto.category == req.session.value ? proyecto : ''
          //console.log(proyectOne);
          if(proyectOne){
            selectedProjects.push(proyectOne);
            }
        });
       return res.render('listCategory',{projects:selectedProjects});
    },
    mostrar: (req,res)=>{
        let proyecto = parseInt(req.params.id);
        req.session.idProject = proyecto;
        if(proyecto > projects.length ){
            return res.redirect('/');
        }
        let data = projects.find(item=> req.session.idProject == item.id);

        return res.render('generic',{project:data});
    }
    
}

app.use(session({
    secret: 'Little secret',
    resave: false,
    saveUninitialized: false
}))

app.use(express.static(publicPath));

//Declaración de uso de EJS
app.set("view engine","ejs");
app.set('views',__dirname + '/public/views');
//Cofiguracion puerto
app.set('port',process.env.PORT || PORT);

//Configuracioon rutas
app.get('/',(req,res)=>{
    //return res.sendFile(`${publicPath}/views/index.html`);
    return res.render('index',{categorias:categories});
});

app.get('/categorias/:id',controllerProjects.listar);
app.get('/detail/:id',controllerProjects.mostrar);
app.listen(app.get('port'));
console.log(`Server on port  ${app.get('port')}`);

//Error 404
app.use((req,res,next)=>{
    res.status(404).send('ERROR 404 Ruta no encontrada');
    next();
})