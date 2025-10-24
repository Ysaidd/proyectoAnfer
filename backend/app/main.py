# C:\Users\Admin\Desktop\Anfer\backend\app\main.py

from fastapi import FastAPI
from app.modules.users.user_router import router as users_router
from app.modules.auth.auth_router import router as auth_router
from app.modules.productos.product_router import router as products_router
from app.modules.categorias.categoria_router import router as categories_router
from app.modules.proveedores.proveedor_router import router as proveedor_router
from app.modules.pedidos.pedido_router import router as pedido_router
from app.modules.ventas.ventas_router import router as sales_router
from app.modules.productos import product_model
from app.modules.categorias import categoria_model
from app.modules.proveedores import proveedor_model
from app.modules.pedidos import pedido_model
from app.modules.ventas import ventas_model
from app.database import create_db_tables
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

create_db_tables()
app = FastAPI(
    title="Sistema de Gestión de Ventas API",
    description="Backend para un sistema de gestión de ventas con FastAPI y PostgreSQL",
    version="0.0.1",
    docs_url="/docs",
    redoc_url="/redoc"
)

static_dir = Path(__file__).parent / "static"

app.mount(
    "/static",
    StaticFiles(directory=static_dir),
    name="static"
)

# --- FIN CONFIGURACIÓN CRÍTICA ---


# Lista de orígenes permitidos
origins = [
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
    # "https://tu-frontend.vercel.app",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir los routers de los módulos
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(products_router)
app.include_router(categories_router)
app.include_router(pedido_router)
app.include_router(proveedor_router)
app.include_router(sales_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Sales Management API. Access /docs for API documentation."}