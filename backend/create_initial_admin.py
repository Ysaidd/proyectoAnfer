# backend/create_initial_admin.py
from app.database import SessionLocal # Importamos SessionLocal del database.py
from app.modules.users.user_service import UserService
from app.modules.users.user_schema import UserCreate, UserRole
from app.core.exceptions import DuplicateEntryException # Asegúrate de que esta excepción esté definida

def create_first_admin():
    db = None # Inicializamos db a None
    try:
        db = SessionLocal() # Obtenemos una sesión de base de datos
        user_service = UserService(db) # Creamos una instancia del servicio de usuario

        # Datos del usuario administrador inicial
        admin_email = "admin@gmail.com"
        admin_password = "12345678" # ¡¡IMPORTANTE: CAMBIA ESTA CONTRASEÑA EN UN ENTORNO REAL!!
        cedula = "1234" # Puedes cambiar esto a un valor válido según tu lógica

        # Verificamos si el administrador ya existe
        existing_admin = user_service.get_user_by_email(admin_email)
        if existing_admin:
            print(f"El usuario administrador '{admin_email}' ya existe. Saltando creación.")
            return

        # Creamos el objeto UserCreate
        admin_user_data = UserCreate(
            email=admin_email,
            cedula=cedula,
            password=admin_password,
            full_name="Super Administrador",
            role=UserRole.ADMIN # Asignamos el rol de administrador
        )

        # Intentamos crear el usuario
        user_service.create_user(admin_user_data)
        print(f"Usuario administrador '{admin_email}' creado exitosamente con contraseña '{admin_password}'.")
        print("¡Recuerda cambiar esta contraseña si lo usas en producción!")

    except DuplicateEntryException as e:
        print(f"Error al crear administrador: {e.detail}")
    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")
    finally:
        if db:
            db.close() # Aseguramos que la sesión de la base de datos se cierre

if __name__ == "__main__":
    print("Creando usuario administrador inicial...")
    create_first_admin()
    print("Proceso de creación de administrador finalizado.")