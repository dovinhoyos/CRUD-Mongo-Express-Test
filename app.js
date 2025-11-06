import 'dotenv/config'
import express, { json } from 'express'
import cors from 'cors'
import router from './routes/producto.js'
import conectarDB from './config/db.js'

//crear la app con express
const app = express()
//conectar la base de datoss
conectarDB()
//habilitar que pueda trabajar con datos json
app.use(json())
/**
 * habilitar para que se pueda acceder a las rutas desde
 * cualquier sitio
 * */
app.use(cors())
/**
 * configurar el Puero usando el valor que tenga y sino
 * coloca el valor de 3000
 * */
const PORT = process.env.PORT || 3000
//llamar a las rutas que devuelva router
app.use('/api/productos', router)
//poner al servidor a escuchar en el puerto
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`))
