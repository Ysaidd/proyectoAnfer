# app/modules/pedidos/pedido_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.modules.pedidos import pedido_model as models, pedido_schema as schemas
from app.modules.productos import product_model as variante_model

def crear_pedido(db: Session, pedido_data: schemas.PedidoCreate):
    pedido = models.Pedido(
        proveedor_id=pedido_data.proveedor_id,
        fecha=pedido_data.fecha,
    )
    db.add(pedido)
    db.flush()

    for detalle in pedido_data.detalles:
        detalle_db = models.DetallePedido(
            pedido_id=pedido.id,
            variante_id=detalle.variante_id,
            cantidad=detalle.cantidad,
            precio_unitario=detalle.precio_unitario
        )
        db.add(detalle_db)

    db.commit()
    db.refresh(pedido)
    return pedido

def obtener_pedido(db: Session, pedido_id: int):
    pedido = db.query(models.Pedido).filter(models.Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido

def actualizar_pedido(db: Session, pedido_id: int, pedido_data: schemas.PedidoCreate):
    pedido = obtener_pedido(db, pedido_id)
    if pedido.estado != "pendiente":
        raise HTTPException(status_code=400, detail="Solo se puede actualizar un pedido en estado pendiente")

    # Eliminar detalles existentes
    db.query(models.DetallePedido).filter(models.DetallePedido.pedido_id == pedido_id).delete()

    # Actualizar campos
    pedido.proveedor_id = pedido_data.proveedor_id
    pedido.fecha = pedido_data.fecha

    # Añadir nuevos detalles
    for detalle in pedido_data.detalles:
        detalle_db = models.DetallePedido(
            pedido_id=pedido_id,
            variante_id=detalle.variante_id,
            cantidad=detalle.cantidad,
            precio_unitario=detalle.precio_unitario
        )
        db.add(detalle_db)

    db.commit()
    db.refresh(pedido)
    return pedido

def cambiar_estado_pedido(db: Session, pedido_id: int, nuevo_estado: schemas.EstadoPedido):
    pedido = obtener_pedido(db, pedido_id)

    if pedido.estado != "pendiente":
        raise HTTPException(status_code=400, detail="Solo se puede cambiar el estado si el pedido está pendiente")

    if nuevo_estado == "confirmado":
        for detalle in pedido.detalles:
            variante = db.query(variante_model.VarianteProducto).filter(variante_model.VarianteProducto.id == detalle.variante_id).first()
            if not variante:
                raise HTTPException(status_code=404, detail="Variante no encontrada")
            variante.stock += detalle.cantidad

    pedido.estado = nuevo_estado
    db.commit()
    db.refresh(pedido)
    return pedido

def eliminar_pedido(db: Session, pedido_id: int):
    pedido = obtener_pedido(db, pedido_id)

    if pedido.estado != "pendiente":
        raise HTTPException(status_code=400, detail="Solo se pueden eliminar pedidos pendientes")

    db.delete(pedido)
    db.commit()
