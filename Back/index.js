const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const { query } = require('express')


const app = express()

app.use(function (req, res, next) {
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

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en el puerto:${PUERTO}`)
})

conexion.connect(error => {
    if (error) throw error
    console.log('Conexión exitosa a la base de datos');
})

app.get('/', (req, res) => {
    res.send('API')
})

//Obtener contacto
app.get('/Contacto', (req, res) => {
    const query = `SELECT P.id_contacto, P.nombres, N.num_tel, C.dir_correo 
    FROM contacto P 
    LEFT JOIN num_contacto N ON P.id_contacto = N.id_contacto 
    LEFT JOIN correo C ON P.id_contacto = C.id_contacto 
    WHERE P.id_contacto = '1234';`
    conexion.query(query, (error, resultado) => {
        if (error) return console.error(error.message);
        if (resultado.length > 0) {
            res.json(resultado)
        } else {
            res.json('No hay registros')
        }
    })
})

app.get('/Contacto/:id', (req, res) => {
    const { id_contacto } = req.params
    const query = `SELECT * FROM Contacto WHERE  id_contacto=${id_contacto}`
    conexion.query(query, (error, resultado) => {
        if (error) return console.error(error.message);

        if (resultado > 0) {
            res.json(resultado)
        } else {
            res.json('No hay registro con ese id')
        }
    })
})

//Agregar contactos

app.post('/contacto/agregar/:id', (req, res) => {
    const contacto = {
        id_contacto: req.body.id_contacto,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        dir_contacto: req.body.dir_contacto,
        tels: req.body.tels,
        correos: req.body.correos
    }

    const query = `INSERT INTO Contacto SET ?`
    conexion.query(query, contacto, (error, resultado) => {
        if (error) return console.error(error.message);

        res.json(`Se insertó correctamente el contacto`)
    })
})



app.post('/guardarContacto', (req, res) => {
    
    const datos = req.body;
    const query = `INSERT INTO contacto (id_contacto, nombres, apellidos, dir_contacto) VALUES ('${datos.id_contacto}','${datos.nombres}','${datos.apellidos}','${datos.dir_contacto}')`
    
    conexion.query(query,(error,resultado)=>{
        if (error) return console.error(error.message);

        datos.tels.forEach((number)=>{
            const query=`INSERT INTO num_contacto (id_num,num_tel, tipo_num,id_contacto) VALUES (NULL,'${number.num_tels}','${number.tipo_tels}','${datos.id_contacto}')`
            conexion.query(query,(error,resultado)=>{
                if (error) return console.error(error.message);
            });
        })

        datos.correos.forEach((val_correo)=>{
            const query=`INSERT INTO correo (id_correo,dir_correo,id_contacto) VALUES (NULL,'${val_correo}','${datos.id_contacto}')`
            conexion.query(query,(error,resultado)=>{
                if (error) return console.error(error.message);    
            })
        })
            
        
        res.json(`Se agregó correctamente el contacto`)
    })
});

        //Actualizar contacto 
        app.put('/contacto/actualizar/:id', (req, res) => {
            datos_actz=req.body;

            const query = `UPDATE num_contacto SET nombre='${num_tel}', tipo='${tipo} WHERE id_contacto='${id_contacto}'`
            conexion.query(query, (error, resultado) => {
                if (error) return console.error(error.message);

                res.json(`Se actualizó correctamente el número del contacto`)
            })
        })


        //Actualizar correo

        app.put('/correo/actualizar/:id', (req, res) => {
            const { id_contacto } = req.params
            const { dir_correo } = req.body

            const query = `UPDATE num_contacto SET dir_correo='${dir_correo} WHERE id_contacto='${id_contacto}'`
            conexion.query(query, (error, resultado) => {
                if (error) return console.error(error.message);

                res.json(`Se actualizó correctamente el correo del contacto`)
            })
        })

        //Borrar contacto

        app.delete('/contacto/borrar/:id', (req, res) => {
            const { id_contacto } = req.params

            const query = `DELETE FROM Contacto WHERE id_contacto='${id_contacto}`
            conexion.query(query, (error, resultado) => {
                if (error) return console.error(error.message);

                res.json(`Se eliminó correctamente el contacto`)
            })
        })
