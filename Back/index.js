const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const { query } = require('express')
const res = require('express/lib/response')

const app = express()

app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    next()
    }
)

app.use(bodyParser.json())

const PUERTO = 3000

//DESKTOP-45GMHE5

const conexion = mysql.createConnection({
    host: 'localhost', 
    database: 'agenda_personal',
    user: 'Dakari',
    password: 'BUm.kYNRo1z)xRVH'
    }
)

app.listen(PUERTO, ()=>{
    console.log(`Servidor corriendo en el puerto: $(PUERTO)`)
})

conexion.connect(error=>{
    if(error) throw  error
    console.log('Conexión exitosa a la base de datos');
})

app.get('/',(req,res)=>{
    res.send('API')
})

app.get('/Contacto',(req,res)=>{
    const query = `SELECT * FROM contacto`
    conexion.query(query,(error,resultado)=>{
        if(error) return console.error(error.message);

        if(resultado>0){
            res.json(resultado)
        } else{
            res.json('No hay registros')
        } 
    })
})

app.get('/Contacto/:id',(req,res)=>{
    const {id_contacto} =req.params
    const query = `SELECT * FROM Contacto WHERE  id_contacto=${id_contacto}` 
    conexion.query(query,(error,resultado)=>{
        if(error) return console.error(error.message);

        if(resultado>0){
            res.json(resultado)
        } else{
            res.json('No hay registro con ese id')
        } 
    })
})

app.post('/Contacto/agregar', (req,res)=>{
    const usuario = {
        id_contacto: req.body.id_contacto,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        dir_contacto: req.body.dir_contacto
    }

    const query = `INSERT INTO Contacto SET ?`
    conexion.query(query,contacto, (error, resultado)=>{
        if(error) return console.error(error.message);

        res.json(`Se insertó correctamente el contacto`)
    })
})

app.put('/numero_contacto/actualizar/:id',(req,res)=>{
    const {id_contacto} = req.params
    const {num_tel,tipo} = req.body
    
    const query = `UPDATE num_contacto SET nombre='${num_tel}', tipo='${tipo} WHERE id_contacto='${id_contacto}'`
    conexion.query(query, (error,resultado)=>{
        if(error) return console.error(error.message);

        res.json(`Se actualizó correctamente el número del contacto`)
    })
})

app.put('/correo/actualizar/:id',(req,res)=>{
    const {id_contacto} = req.params
    const {dir_correo} = req.body
    
    const query = `UPDATE num_contacto SET dir_correo='${dir_correo} WHERE id_contacto='${id_contacto}'`
    conexion.query(query, (error,resultado)=>{
        if(error) return console.error(error.message);

        res.json(`Se actualizó correctamente el correo del contacto`)
    })
})

app.delete('/contacto/borrar/:id',(req,res)=>{
    const {id_contacto} = req.params

    const query = `DELETE FROM Contacto WHERE id_contacto='${id_contacto}`
    conexion.query(query,(error,resultado)=>{
        if(error) return console.error(error.message);

        res.json(`Se eliminó correctamente el contacto`)
    })
})
