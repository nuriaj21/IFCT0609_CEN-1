const express = require('express');
const router = express.Router();
const urlencode = require('urlencode'); // librería para codificar y decodificar URLs

const path = require('path'); // Módulo para crear rutas absolutas a nuestros archivos

// Body parser para leer el body de los requests -> POST, PUT
const bodyParser = require('body-parser');
// To parse URL encoded data
router.use(bodyParser.urlencoded({ extended: false }))
// body -> JSON
router.use(bodyParser.json())

const notas = [
  {id: 1, texto: "Nota 1", name: "Pepe"},
  {id: 2, texto: "Nota 3", name: "Pepe"},
  {id: 1, texto: "Nota 1", name: "María"},
  {id: 2, texto: "Nota 2", name: "María"},
]
const users = [
  {id: 0, name: "Pepe", email: "pepe@gmail.com"},
  {id: 1, name: "María", email: "maria@gmail.com"},
  {id: 2, name: "Juan", email: "juan@gmail.com"},
]
// Middleware - console.log de la hora, la ruta, la ip y el método de cada request
// Middleware #1
router.use(function (req, res, next) {
  let fechaHora = new Date().toLocaleString();
  let url = urlencode.decode(req.originalUrl); // /notas/1/Mar%C3%ADa -> /notas/1/María
  console.log(fechaHora, "- Request en " + url + " desde " + req.ip + " con método " + req.method);
  // Pasamos un usuario mediante el objeto request:
  req.user = {id: "123", name: "Juan"};
  next();
  // TODO: Ejercicio. Guardar en un archivo de texto la hora, la ruta, la ip y el método de cada request -> TXT
});
// Middleware #2
router.use(function (req, res, next) {
  let fechaHora = new Date().toLocaleString();
  console.log(fechaHora, "- Hora en el Middleware #2");
  // Escribimos el usuario (con id y name) que pasamos en el middleware #1
  console.log(`
    Usuario:
    id: ${req.user.id},
    nombre: ${req.user.name}
    `)
    req.user.rol = "usuario" // Añadimos una propiedad al objeto user
  next();
});
router.all('/', function(req, res){
  console.log("Hola desde /"); // Después de ejecutar el middleware #1 y #2
  res.send("Hola mundo desde express. Usuario actual: " + req.user.name + " con id " + req.user.id + " con rol " + req.user.rol);
});
// El ? después del parámetro name indica que es opcional, entonces podemos usar el endpoint en caso de recibirlo o no
router.get('/hola/:name?', function(req, res){
  if(req.params.name){
    res.send("Hola, " + req.params.name + "!");
  }else{
    res.send("Hola!")
  }
});
router.post('/hola', function(req, res){
  // TODO: crear el usuario en la base de datos
  let nuevoUsuario = req.body; // req.body es el objeto que enviamos en el body del request al hacer un POST
  nuevoUsuario.rol = "usuario"
  res.send(nuevoUsuario);
});

// ****************** Usuarios GET y GET por id ******************
// Pattern matched routes
router.get("/usuarios", function(req, res){
  res.send(users)
});
router.get('/usuarios/:id([0-9]{1})', function(req, res){
  let user = users.find(user => user.id == req.params.id);
  res.send(user);
});
// ******* Formulario para crear un usuario *******
router.get('/crear', function(req, res){
  // Formulario para crear un usuario
  let ubicacion = 'forms/form-crear.html';
  // Usamos path para obtener ruta a la carpeta actual y concatenarle la ruta relativa del archivo
  console.log("Ubicación absoluta de la carpeta: " + path.join(__dirname, ""));
  console.log("Ubicación relativa del archivo: " + ubicacion);
  // Devolvemos en el response el archivo html del formulario
  res.sendFile(path.join(__dirname, ubicacion))
});
router.post('/crear', function(req, res){
  // Recibimos el form y lo enviamos de vuelta
  let nuevoUsuario = req.body; // req.body es el objeto que enviamos en el body del request al hacer un POST
  let nuevoId = users.length;
  nuevoUsuario.id = nuevoId; // 3, 4, 5...
  let nuevoUsuarioIdx = users.push(nuevoUsuario); // Actualizamos variable con el dato DESDE el array y lo devolvemos para comprobar que se añadió con todos los campos
  console.log(users[nuevoUsuarioIdx - 1])
  // TODO: crear el usuario en la base de datos
  res.status(201); // 201 Created
  res.send(users[nuevoUsuarioIdx - 1]); // o el user nuevo
});

// TODO: form y endpoint para editar un usuario -> GET y PUT
router.get('/editar/:id', function(req, res){
  let ubicacion = 'forms/form-editar.html';
  res.cookie("__id", req.params.id);
  // Formulario para editar un usuario
  res.sendFile(path.join(__dirname, ubicacion))
});
// Nota: revisar por qué con PUT el form no se envía
router.post('/editar/:id', function(req, res){
  // editar
  res.send("Editar usuario con id " + req.params.id);
});
// TODO: form y endpoint para borrar un usuario -> GET y DELETE
router.delete('/borrar/:id', function(req, res){
  // borrar
  res.send("Borrar usuario con id " + req.params.id);
});
// *********************** Usuarios ***********************

// Notas de cosas por hacer
// Final de formulario para crear un usuario
router.get('/notas', function(req, res){
  res.send(notas);
});
// URL Building con Express
// Route parameters
router.get('/notas/:id', function(req, res){
  let nota = notas.find(nota => nota.id == req.params.id);
  res.send(nota);
});
// TODO: Ejercicio. Crear un solo enpoint que use un parámetro opcional para filtrar por nombre y por id, es decir, "fusionar" los dos endpoints /:id y /:id/:name
router.get('/notas/:id/:name', function(req, res){
  let nota = notas.find(nota => nota.id == req.params.id && nota.name == req.params.name);
  res.send(nota);
});

// Todas las demás rutas y métodos no implementados
router.all('*', function(req, res){
  res.status(404); // HTTP status 404: NotFound
  res.send("404 Not Found. Ruta o método no están implementados");
});

module.exports = router;