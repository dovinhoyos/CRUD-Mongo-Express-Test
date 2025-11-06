import Producto from "../models/producto.js"

export async function crearProducto(req,res){
   try {
       const nuevoProducto = new Producto(req.body);
       const productoGuardado = await nuevoProducto.save()
       console.log(nuevoProducto)
       res.status(201).json(productoGuardado)      
     } catch (err) {
       res.status(400).json({ error: err.message })
     }
}
export async function obtenerProductos(req,res){
    try {
        const productos = await Producto.find().lean()
        res.json(productos)       
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
 }

export async function obtenerProducto(req,res){
   try {
       const producto = await Producto.findById(req.params.id).lean()
       if (!producto){
        return res.status(404).json({ error: 'Producto no encontrado' })
       }        
       res.json(producto)
    } catch (err) {
       res.status(500).json({ error: err.message })
    }
 }

 export async function  eliminarProducto(req,res){
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id)
        if (!productoEliminado){
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json({ mensaje: 'Producto eliminado' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
 }

 export async function  actualizarProducto(req,res){
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
            )
        if (!productoActualizado){
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json({mensaje: "Producto Actualizado", producto: productoActualizado});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
 }

 