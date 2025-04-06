from sqlalchemy.orm import Session
from ..models import Order, OrderItem, ProductVariant
from ..schemas.order import OrderCreate, OrderItemBase, OrderResponse, OrderItemResponse
from ..schemas.products import ProductVariantBase, ProductVariantResponse
from fastapi import HTTPException
from decimal import Decimal
from sqlalchemy.orm import joinedload

def create_order(db: Session, order_data: OrderCreate):
    # Calcular total y verificar stock
    total = Decimal("0.00")
    order_items = []
    
    for item in order_data.items:
        variant = db.query(ProductVariant).filter(
            ProductVariant.id == item.variant_id
        ).first()
        
        if not variant:
            raise HTTPException(
                status_code=404, 
                detail=f"Variante {item.variant_id} no encontrada"
            )
            
        if variant.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Stock insuficiente para la variante {variant.id}"
            )
        
        # Verificar si el producto padre existe
        if not variant.product:
            raise HTTPException(
                status_code=404,
                detail=f"Producto para la variante {variant.id} no encontrado"
            )
        
        # Obtener precio del producto padre
        product_price = Decimal(str(variant.product.price))
        
        total += product_price * Decimal(item.quantity)  # Ahora ambos son Decimal
        order_items.append({
            "variant": variant,
            "quantity": item.quantity,
            "price": product_price
        })
    
    # Crear la orden
    db_order = Order(
        customer_phone=order_data.customer_phone,
        total=total
    )
    db.add(db_order)
    db.flush()  # Obtener ID de la orden
    
    # Crear items y actualizar stock
    for item in order_items:
        # Actualizar stock
        item["variant"].stock -= item["quantity"]
        
        # Crear OrderItem
        db_item = OrderItem(
            order_id=db_order.id,
            variant_id=item["variant"].id,
            quantity=item["quantity"],
            price=item["price"]
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    
    # Convertir a OrderResponse
    order_response = OrderResponse(
        id=db_order.id,
        customer_phone=db_order.customer_phone,
        total=db_order.total,
        created_at=db_order.created_at,
        items=[
            OrderItemResponse(
                variant_id=item.variant_id,
                quantity=item.quantity,
                price=item.price,
                product_name=item.variant.product.name if item.variant and item.variant.product else "N/A",
                size=item.variant.size if item.variant else "N/A",
                color=item.variant.color if item.variant else "N/A",
                stock=item.variant.stock if item.variant else 0
            )
            for item in db_order.items
        ]
    )

    return order_response


def get_orders(db: Session, skip: int = 0, limit: int = 100):
    orders = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.variant).joinedload(ProductVariant.product)
    ).order_by(Order.id.desc()).all()

    return [
        OrderResponse(
            id=order.id,
            customer_phone=order.customer_phone,
            total=order.total,
            created_at=order.created_at,
            items=[
                OrderItemResponse(
                    variant_id=item.variant_id,
                    quantity=item.quantity,
                    price=item.price,
                    product_name=item.variant.product.name if item.variant and item.variant.product else "N/A",
                    size=item.variant.size if item.variant else "N/A",
                    color=item.variant.color if item.variant else "N/A",
                    stock=item.variant.stock if item.variant else 0
                )
                for item in order.items
            ]
        )
        for order in orders
    ]

def get_order_by_id(db: Session, order_id: int):
    order = db.query(Order).filter(Order.id == order_id).first()
    print("🛠 Buscando orden:", order)  # 👀 Agregar esta línea
    return order
