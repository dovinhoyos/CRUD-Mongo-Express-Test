# Copilot Instructions - CRUD MongoDB Express API

## Project Overview

Node.js REST API for managing products (Productos) with MongoDB backend. Uses ES modules (`type: "module"` in package.json), Express 5.x, and Mongoose 8.x. Deployed via Docker Compose with MongoDB and mongo-express admin interface.

## Architecture Pattern: MVC Structure

```
routes/producto.js → controllers/producto.js → models/producto.js → MongoDB
```

- **Routes**: Define HTTP endpoints, delegate to controller functions
- **Controllers**: Handle business logic, interact with models, return JSON responses
- **Models**: Mongoose schemas with validation rules
- **Config**: Database connection setup in `config/db.js`

## Critical Conventions

### ES Modules (NOT CommonJS)

- Always use `import/export`, never `require()`
- File imports MUST include `.js` extension: `import router from './routes/producto.js'`
- Controller exports use named exports: `export async function crearProducto(req,res) {}`

### MongoDB Connection

- Uses `mongoose.connect()` with deprecated options still present (`useNewUrlParser`, `useUnifiedTopology`)
- Connection string via environment variable: `process.env.MONGODB_URI`
- Database initialized on app startup in `app.js` via `conectarDB()`

### API Response Patterns

Follow existing controller patterns:

- **Success**: `res.status(201).json(productoGuardado)` or `res.json(productos)`
- **Not Found**: `res.status(404).json({ error: 'Producto no encontrado' })`
- **Validation Error**: `res.status(400).json({ error: err.message })`
- **Server Error**: `res.status(500).json({ error: err.message })`

### Mongoose Query Pattern

Controllers use `.lean()` for read operations to return plain JS objects instead of Mongoose documents:

```javascript
const productos = await Producto.find().lean();
```

## Data Model: Producto Schema

```javascript
{
  codigo: Number (unique, required),
  nombre: String (required),
  precio: Number (required),
  categoria: String (enum: ['Ropa', 'Calzado', 'Electrodomestico'], required)
}
```

## Development Workflow

### Local Development (Docker Compose)

```powershell
docker compose up --build  # Start all services
```

- **API**: http://localhost:3000/api/productos
- **Mongo Express**: http://localhost:8081 (admin/dovinr06)
- **MongoDB**: localhost:27017 (dovin/dovinr06)

### Environment Variables Required

Create `.env` file with:

```
MONGODB_URI=mongodb://dovin:dovinr06@mongo:27017
PORT=3000
```

### Hot Reload in Docker

The `compose.yml` includes `develop.watch` for automatic container rebuilds on code changes.

## API Endpoints (Base: `/api/productos`)

- `POST /` - Create product (body: JSON with codigo, nombre, precio, categoria)
- `GET /` - List all products
- `GET /:id` - Get product by MongoDB \_id
- `PUT /:id` - Update product (body: partial or full JSON)
- `DELETE /:id` - Delete product

## Testing Setup

### Configuration

- **Test Runner**: Jest 30.x with `npm test`
- **API Testing**: supertest 7.x for integration tests
- **Test Location**: `__tests__/` directory (currently empty)
- **Postman Collection**: `pruebas-automatizadas-postman.json` contains API test suite

### Running Tests

```powershell
npm test  # Run Jest tests
```

### Writing New Tests

Follow supertest pattern for API integration tests:

```javascript
import request from 'supertest';
import { jest } from '@jest/globals';

// Test example structure
describe('GET /api/productos', () => {
  it('should return all products', async () => {
    const res = await request('http://localhost:3000')
      .get('/api/productos')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
```

## Adding New Resources

To add a new entity (e.g., "Cliente"):

1. Create `models/cliente.js` with Mongoose schema
2. Create `controllers/cliente.js` with CRUD functions (follow `controllers/producto.js` pattern)
3. Create `routes/cliente.js` mapping HTTP methods to controller functions
4. Register route in `app.js`: `app.use('/api/clientes', routerCliente)`

## Dependencies & Versions

- Express 5.x (uses `express.json()` not `bodyParser`)
- Mongoose 8.x (connection options are deprecated but still work)
- Node 20 Alpine in Docker
- Spanish comments throughout codebase

## Security Notes

- Dockerfile creates non-root user `nodejs:nodejs`
- MongoDB credentials hardcoded in `compose.yml` (not production-ready)
- CORS enabled for all origins via `app.use(cors())`
