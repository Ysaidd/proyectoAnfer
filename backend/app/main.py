from fastapi import FastAPI
from app.modules.users.user_router import router as users_router
from app.modules.auth.auth_router import router as auth_router # ¡Importa el nuevo router de auth!
from app.modules.productos.product_router import router as products_router
from app.modules.categorias.categoria_router import router as categories_router
from app.modules.proveedores.proveedor_router import router as proveedor_router
from app.modules.pedidos.pedido_router import router as pedido_router
from app.modules.ventas.ventas_router import router as sales_router
from app.modules.productos import product_model
from app.modules.categorias import categoria_model
from app.modules.categorias import categoria_model
from app.database import create_db_tables
from app.modules.proveedores import proveedor_model
from app.modules.pedidos import pedido_model
from app.modules.ventas import ventas_model
from fastapi.middleware.cors import CORSMiddleware


create_db_tables()
app = FastAPI(
    title="Sistema de Gestión de Ventas API",
    description="Backend para un sistema de gestión de ventas con FastAPI y PostgreSQL",
    version="0.0.1",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Lista de orígenes permitidos
origins = [
    "http://localhost:5173", # ¡Este es el origen de tu frontend React!
    "http://localhost:8000", # El propio backend puede ser un origen
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
    "http://localhost:5173",
    # Puedes añadir más orígenes si en el futuro tu frontend corre en otro dominio/puerto
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permite estos orígenes
    allow_credentials=True,  # Permite credenciales (cookies, autenticación)
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Permite todos los headers
)

# Incluir los routers de los módulos
app.include_router(auth_router) # Primero el de auth, es común
app.include_router(users_router)
app.include_router(products_router) # Descomentar cuando los crees
app.include_router(categories_router) # Descomentar cuando los crees
app.include_router(pedido_router) # Descomentar cuando los crees
app.include_router(proveedor_router) # Descomentar cuando los crees
app.include_router(sales_router) # Descomentar cuando los crees
# app.include_router(sales_router) # Descomentar cuando los crees
# app.include_router(clients_router) # Descomentar cuando los crees

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sales Management API. Access /docs for API documentation."}