import request from 'supertest';
import { jest } from '@jest/globals';

// URL base de la API (debe estar corriendo en Docker)
const API_URL = 'http://localhost:3000';

// Variable para almacenar el ID de un producto creado durante las pruebas
let productoIdCreado;

describe('API de Productos - Tests de Integración', () => {
  // Test 1: Verificar que la API está disponible
  test('GET /api/productos - debe retornar status 200', async () => {
    const response = await request(API_URL)
      .get('/api/productos')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test 2: Crear un producto nuevo
  test('POST /api/productos - debe crear un producto exitosamente', async () => {
    const nuevoProducto = {
      codigo: 1001,
      nombre: 'Camiseta Deportiva',
      precio: 29.99,
      categoria: 'Ropa',
    };

    const response = await request(API_URL)
      .post('/api/productos')
      .send(nuevoProducto)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.codigo).toBe(nuevoProducto.codigo);
    expect(response.body.nombre).toBe(nuevoProducto.nombre);
    expect(response.body.precio).toBe(nuevoProducto.precio);
    expect(response.body.categoria).toBe(nuevoProducto.categoria);

    // Guardar el ID para pruebas posteriores
    productoIdCreado = response.body._id;
  });

  // Test 3: Validar que el código debe ser único
  test('POST /api/productos - debe rechazar código duplicado', async () => {
    const productoDuplicado = {
      codigo: 1001, // Mismo código del test anterior
      nombre: 'Producto Duplicado',
      precio: 50.0,
      categoria: 'Calzado',
    };

    const response = await request(API_URL)
      .post('/api/productos')
      .send(productoDuplicado)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  // Test 4: Validar campos requeridos
  test('POST /api/productos - debe rechazar producto sin campos requeridos', async () => {
    const productoIncompleto = {
      nombre: 'Producto Incompleto',
      // Faltan: codigo, precio, categoria
    };

    const response = await request(API_URL)
      .post('/api/productos')
      .send(productoIncompleto)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  // Test 5: Validar categoría permitida
  test('POST /api/productos - debe rechazar categoría inválida', async () => {
    const productoInvalido = {
      codigo: 1002,
      nombre: 'Producto con categoría inválida',
      precio: 100.0,
      categoria: 'Juguetes', // Categoría no permitida
    };

    const response = await request(API_URL)
      .post('/api/productos')
      .send(productoInvalido)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  // Test 6: Obtener un producto por ID
  test('GET /api/productos/:id - debe retornar un producto específico', async () => {
    const response = await request(API_URL)
      .get(`/api/productos/${productoIdCreado}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('_id', productoIdCreado);
    expect(response.body).toHaveProperty('nombre');
    expect(response.body).toHaveProperty('precio');
    expect(response.body).toHaveProperty('categoria');
  });

  // Test 7: Manejar ID inexistente
  test('GET /api/productos/:id - debe retornar 404 para ID inexistente', async () => {
    const idInexistente = '507f1f77bcf86cd799439011'; // ID válido pero inexistente

    const response = await request(API_URL)
      .get(`/api/productos/${idInexistente}`)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Producto no encontrado');
  });

  // Test 8: Actualizar un producto
  test('PUT /api/productos/:id - debe actualizar un producto exitosamente', async () => {
    const datosActualizados = {
      nombre: 'Camiseta Deportiva Actualizada',
      precio: 34.99,
    };

    const response = await request(API_URL)
      .put(`/api/productos/${productoIdCreado}`)
      .send(datosActualizados)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('mensaje', 'Producto Actualizado');
    expect(response.body.producto.nombre).toBe(datosActualizados.nombre);
    expect(response.body.producto.precio).toBe(datosActualizados.precio);
  });

  // Test 9: Actualizar producto inexistente
  test('PUT /api/productos/:id - debe retornar 404 al actualizar ID inexistente', async () => {
    const idInexistente = '507f1f77bcf86cd799439011';
    const datosActualizados = {
      nombre: 'Producto Fantasma',
      precio: 99.99,
    };

    const response = await request(API_URL)
      .put(`/api/productos/${idInexistente}`)
      .send(datosActualizados)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Producto no encontrado');
  });

  // Test 10: Eliminar un producto
  test('DELETE /api/productos/:id - debe eliminar un producto exitosamente', async () => {
    const response = await request(API_URL)
      .delete(`/api/productos/${productoIdCreado}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('mensaje', 'Producto eliminado');

    // Verificar que el producto fue eliminado
    await request(API_URL)
      .get(`/api/productos/${productoIdCreado}`)
      .expect(404);
  });
});
