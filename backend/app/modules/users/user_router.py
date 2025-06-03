# app/modules/users/user_router.py
from fastapi import APIRouter, Depends, status
from typing import List

from app.modules.users import user_schema as schemas
from app.modules.users.user_service import UserService
# ¡Importa las dependencias desde app.core.dependencies!
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