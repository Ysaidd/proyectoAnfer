# app/modules/users/user_router.py
from fastapi import APIRouter, Depends, status
from typing import List, Any
from app.core.exceptions import DuplicateEntryException
from fastapi.exceptions import HTTPException
from app.modules.users import user_schema as schemas
from app.modules.users.user_service import UserService
from app.core.dependencies import (
    get_user_service_dependency,
    get_current_active_user,
    get_current_admin_user,
    get_current_manager_or_admin_user
)

router = APIRouter(prefix="/users", tags=["Users"])

@router.post(
    "/",
    response_model=schemas.User,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_admin_user)]
)
def create_user_endpoint(
    user_data: schemas.UserCreate,
    user_service: UserService = Depends(get_user_service_dependency)
):
    """
    Crea un nuevo usuario en el sistema.
    **Requiere rol: Administrador**
    """
    return user_service.create_user(user_data)


@router.post(
    "/register",
    response_model=schemas.User, # Devuelve el esquema completo del usuario creado
    status_code=status.HTTP_201_CREATED,
    summary="Registrar un nuevo usuario como 'cliente'"
)
def register_client_account(
    user_data: schemas.UserCreate, # El frontend envía email, full_name, cedula, password (sin 'role')
    user_service: UserService = Depends(get_user_service_dependency) # Inyectamos el UserService
):
    """
    Registra un nuevo usuario en el sistema con el rol predeterminado de 'client'.
    No requiere autenticación.
    """
    try:
        # El router pasa los datos al UserService, que es quien tiene la lógica de registro.
        new_user = user_service.register_client(user_data)
        return new_user
    except ValueError as e: # Captura el ValueError si el rol no es 'client'
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DuplicateEntryException: # Captura la excepción específica para duplicados
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, # 409 Conflict es apropiado
            detail="Un usuario con este email ya existe."
        )
    except Exception as e:
        # Otros errores inesperados
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno al registrar usuario: {e}"
        )



@router.get(
    "/",
    response_model=List[schemas.User],
    dependencies=[Depends(get_current_manager_or_admin_user)]
)
def read_users_endpoint(
    skip: int = 0,
    limit: int = 100,
    user_service: UserService = Depends(get_user_service_dependency)
):
    """
    Obtiene una lista de usuarios.
    **Requiere rol: Gerente o Administrador**
    """
    return user_service.get_users(skip=skip, limit=limit)

@router.get(
    "/{user_id}",
    response_model=schemas.User,
    dependencies=[Depends(get_current_active_user)]
)
def read_user_endpoint(
    user_id: int,
    user_service: UserService = Depends(get_user_service_dependency),
):
    """
    Obtiene un usuario específico por su ID.
    **Requiere rol: Cualquier usuario activo**
    """
    return user_service.get_user(user_id)

@router.put(
    "/{user_id}",
    response_model=schemas.User,
    dependencies=[Depends(get_current_manager_or_admin_user)]
)
def update_user_endpoint(
    user_id: int,
    user_data: schemas.UserUpdate,
    user_service: UserService = Depends(get_user_service_dependency)
):
    """
    Actualiza los datos de un usuario existente.
    **Requiere rol: Gerente o Administrador**
    """
    return user_service.update_user(user_id, user_data)

@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_admin_user)]
)
def delete_user_endpoint(
    user_id: int,
    user_service: UserService = Depends(get_user_service_dependency)
):
    """
    Elimina un usuario del sistema.
    **Requiere rol: Administrador**
    """
    user_service.delete_user(user_id)
    return

# Nuevo endpoint para que el usuario autenticado actualice SU propio perfil
@router.put(
    "/me/",
    response_model=schemas.User,
    dependencies=[Depends(get_current_active_user)],
    summary="Actualizar perfil propio (usuario autenticado)"
)
def update_my_profile(
    user_data: schemas.UserUpdate,
    current_user: Any = Depends(get_current_active_user),
    user_service: UserService = Depends(get_user_service_dependency),
):
    """
    Permite al usuario autenticado actualizar su propio perfil.
    - No permite cambiar el rol ni campos sensibles desde aquí.
    """
    # extraer el id del current_user (soporta dict o objeto)
    try:
        if isinstance(current_user, dict):
            user_id = current_user.get("id")
        else:
            user_id = getattr(current_user, "id", None)
    except Exception:
        user_id = None

    if not user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo identificar al usuario autenticado.")

    try:
        # Si el servicio implementa update_own_profile, úsalo (más seguro).
        if hasattr(user_service, "update_own_profile"):
            updated = user_service.update_own_profile(user_id, user_data)
        else:
            # Fallback: reusar update_user pero asegurarse de no permitir cambio de rol en el service
            updated = user_service.update_user(user_id, user_data)
        return updated
    except DuplicateEntryException:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Un usuario con ese correo ya existe.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error interno al actualizar perfil: {str(e)}")

