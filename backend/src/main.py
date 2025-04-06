from fastapi import FastAPI
from src.db.base import Base, engine
from src.controllers import product_controller, category_controllers, order_controllers
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Crear tablas en la base de datos (esto es temporal, luego usaremos Alembic)
Base.metadata.create_all(bind=engine)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

    
app = FastAPI()

app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todos los orígenes (en desarrollo)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)


app.include_router(order_controllers.router)
app.include_router(product_controller.router)
app.include_router(category_controllers.router)

@app.get("/")
def home():
    return {"message": "¡Bienvenido a la API de la tienda de ropa!"}