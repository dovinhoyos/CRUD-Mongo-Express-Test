import { Router } from 'express'
const router = Router()
import * as producto from '../controllers/producto.js'

router.post("/", producto.crearProducto)

router.get("/", producto.obtenerProductos)

router.get("/:id", producto.obtenerProducto)

router.put("/:id", producto.actualizarProducto)

router.delete("/:id", producto.eliminarProducto)


export default router
