from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from src.db.base import SessionLocal
from src.schemas.order import OrderCreate, OrderResponse, OrderItemResponse
from src.services.order_services import create_order, get_orders, get_order_by_id
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

router = APIRouter(prefix="/orders", tags=["orders"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=OrderResponse)
def create_new_order(order: OrderCreate, db: Session = Depends(get_db)):
    try:
        return create_order(db, order)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=list[OrderResponse])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_orders(db, skip, limit)

@router.get("/orders/{order_id}/pdf")
async def generate_order_pdf(order_id: int, db: Session = Depends(get_db)):
    order = get_order_by_id(db, order_id)
    if not order:
        print(f"Orden con ID {order_id} no encontrada")
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.setFont("Helvetica", 12)

    # Título
    p.drawString(200, 750, "Factura de Compra")
    p.line(50, 740, 550, 740)

    # Información del cliente
    p.drawString(50, 720, f"Venta #{order.id}")
    p.drawString(50, 700, f"Cliente: {order.customer_phone}")
    formatted_date = order.created_at.strftime("%#d/%#m/%Y %#I:%M:%S %p")
    p.drawString(50, 680, f"Fecha: {formatted_date}")

    # Encabezado de productos
    y = 650
    p.drawString(50, y, "Producto")
    p.drawString(250, y, "Cantidad")
    p.drawString(350, y, "Precio")
    p.drawString(450, y, "Subtotal")
    p.line(50, y - 10, 550, y - 10)

    # Lista de productos
    y -= 30
    for item in order.items:
        product_name = item.variant.product.name  # Se obtiene desde la relación con ProductVariant
        size = item.variant.size if item.variant.size else "N/A"
        color = item.variant.color if item.variant.color else "N/A"

        p.drawString(50, y, f"{product_name} ({size}, {color})")
        p.drawString(250, y, str(item.quantity))
        p.drawString(350, y, f"${item.price}")
        p.drawString(450, y, f"${item.quantity * item.price}")
        y -= 20

    # Total
    p.line(50, y - 10, 550, y - 10)
    p.drawString(400, y - 30, f"Total: ${order.total}")

    p.showPage()
    p.save()

    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=venta_{order_id}.pdf"})