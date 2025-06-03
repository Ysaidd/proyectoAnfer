from fastapi import FastAPI
from app.modules.users.user_router import router as users_router
from app.modules.auth.auth_router import router as auth_router # ¡Importa el nuevo router de auth!
from app.database import create_db_tables


create_db_tables()
app = FastAPI(
    title="Sistema de Gestión de Ventas API",
    description="Backend para un sistema de gestión de ventas con FastAPI y PostgreSQL",
    version="0.0.1",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Incluir los routers de los módulos
app.include_router(auth_router, prefix="/api") # Primero el de auth, es común
app.include_router(users_router, prefix="/api")
# app.include_router(products_router, prefix="/api/v1") # Descomentar cuando los crees
# app.include_router(sales_router, prefix="/api/v1") # Descomentar cuando los crees
# app.include_router(clients_router, prefix="/api/v1") # Descomentar cuando los crees

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sales Management API. Access /docs for API documentation."}