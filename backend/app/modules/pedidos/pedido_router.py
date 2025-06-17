# app/modules/pedidos/pedido_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.modules.pedidos import pedido_service, pedido_schema as schemas

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

@router.post("/", response_model=schemas.PedidoResponse)
def crear_pedido(pedido: schemas.PedidoCreate, db: Session = Depends(get_db)):
    return pedido_service.crear_pedido(db, pedido)

@router.get("/{pedido_id}", response_model=schemas.PedidoResponse)
def obtener_pedido(pedido_id: int, db: Session = Depends(get_db)):
    return pedido_service.obtener_pedido(db, pedido_id)

@router.put("/{pedido_id}", response_model=schemas.PedidoResponse)
def actualizar_pedido(pedido_id: int, pedido: schemas.PedidoCreate, db: Session = Depends(get_db)):
    return pedido_service.actualizar_pedido(db, pedido_id, pedido)

@router.patch("/{pedido_id}/estado", response_model=schemas.PedidoResponse)
def cambiar_estado_pedido(pedido_id: int, estado: schemas.EstadoPedido, db: Session = Depends(get_db)):
    return pedido_service.cambiar_estado_pedido(db, pedido_id, estado)

@router.delete("/{pedido_id}")
def eliminar_pedido(pedido_id: int, db: Session = Depends(get_db)):
    pedido_service.eliminar_pedido(db, pedido_id)
    return {"msg": "Pedido eliminado correctamente"}
