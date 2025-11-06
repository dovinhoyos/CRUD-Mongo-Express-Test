import { Schema, model } from 'mongoose'

const productoSchema = new Schema({
    codigo: { type: Number, required: true,unique: true  },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, 
        enum: ['Ropa', 'Calzado', 'Electrodomestico'],
    required: true }
});

export default model('Producto', productoSchema);
