const express = require("express")
const mysql= require("mysql2")
var bodyParser=require('body-parser')
var app=express()
var con=mysql.createConnection({
    host:'tramway.proxy.rlwy.net:52463',
    user:'root',
    password:'http://tramway.proxy.rlwy.net',
    database:'Pan'
})
con.connect();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(express.static('public'))

app.post('/agregarUsuario',(req,res)=>{
    let nombre = req.body.nombre;

    con.query('INSERT INTO usuario (nombre) VALUES (?)', [nombre], (err, respuesta) => {
        if (err) {
            console.log("Error al insertar", err);
            return res.status(500).send("Error al insertar usuario");
        }
        return res.send(`<h1>Usuario agregado:</h1> ${nombre}`);
    });
})

app.listen(10000,()=>{
    console.log('Servidor escuchando en el puerto 10000')
})

//fun consultar


app.get('/obtenerUsuario',(req,res)=>{
    con.query('select * from usuario', (err,respuesta, fields)=>{
        if(err)return console.log('ERROR: ', err);
        var userHTML=``;
        var i=0;

        respuesta.forEach(user => {
            i++;
            userHTML+= `<tr><td>${i}</td><td>${user.nombre}</td></tr>`;


        });

        return res.send(`<table>
                <tr>
                    <th>id</th>
                    <th>Nombre:</th>
                <tr>
                ${userHTML}
                </table>`
        );


    });
});

app.post('/borrarUsuario', (req, res) => {
    console.log("BODY:", req.body); // Para depuración
    const nombre = req.body.nombre.trim();

    con.query(
        'DELETE FROM usuario WHERE TRIM(LOWER(nombre)) = TRIM(LOWER(?))',
        [nombre],
        (err, resultado) => {
            if (err) {
                console.error('Error al borrar el usuario:', err);
                return res.status(500).send("Error al borrar el usuario");
            }
            if (resultado.affectedRows === 0) {
                return res.status(404).send("Usuario no encontrado");
            }
            return res.send(`Usuario con nombre "${nombre}" borrado correctamente`);
        }
    );
});



app.post('/actualizarUsuario', (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;

    con.query(
        'UPDATE usuario SET nombre = ? WHERE id_usuario = ?',
        [nombre, id],
        (err, resultado) => {
            if (err) {
                console.error('Error al actualizar usuario:', err);
                return res.status(500).send("Error al actualizar usuario");
            }
            if (resultado.affectedRows === 0) {
                return res.status(404).send("Usuario no encontrado");
            }
            return res.send(`Usuario con ID ${id} actualizado correctamente a "${nombre}"`);
        }
    );
});
