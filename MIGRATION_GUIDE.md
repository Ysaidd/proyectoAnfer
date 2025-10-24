# Migración a Múltiples Categorías por Producto

## 📋 Resumen de Cambios

Se ha implementado la funcionalidad para que un producto pueda tener **múltiples categorías** en lugar de una sola. Esto incluye cambios tanto en el backend como en el frontend.

## 🔧 Cambios en Backend

### 1. Modelos de Base de Datos
- **Nueva tabla**: `producto_categoria` (tabla de asociación many-to-many)
- **Modificado**: `Producto` - eliminada columna `categoria_id`, agregada relación `categorias`
- **Modificado**: `Categoria` - actualizada relación `productos` para many-to-many

### 2. Schemas (Pydantic)
- **ProductCreate**: `categoria_id` → `categoria_ids: List[int]`
- **ProductUpdate**: `categoria_id` → `categoria_ids: Optional[List[int]]`
- **ProductResponse**: `categoria` → `categorias: List[CategoriaResponse]`

### 3. Servicios
- **ProductService**: Actualizado para manejar múltiples categorías
- **Nuevo método**: `get_products_by_categories()` para filtrado por múltiples categorías

### 4. Controladores
- **Endpoint GET /products**: Soporte para filtrado por múltiples categorías con query parameter `categoria_ids`

## 🎨 Cambios en Frontend

### 1. Creación de Productos (Admin)
- **ProductForm**: Interfaz para seleccionar múltiples categorías
- **Visualización**: Tags de categorías seleccionadas con opción de eliminar
- **Validación**: Al menos una categoría requerida

### 2. Listado de Productos
- **ProductCard**: Muestra todas las categorías del producto como tags
- **Admin Products**: Tabla actualizada para mostrar múltiples categorías

### 3. Página de Productos (Store)
- **ShopCategories**: Filtrado múltiple por categorías
- **Interfaz**: Checkboxes para seleccionar múltiples categorías
- **Indicadores**: Muestra categorías seleccionadas como badges

### 4. Detalle de Producto
- **ProductPageComponent**: Muestra todas las categorías del producto

## 🚀 Instrucciones de Migración

### Paso 1: Backup de Base de Datos
```bash
# Hacer backup de tu base de datos antes de proceder
cp anfer.db anfer_backup_$(date +%Y%m%d_%H%M%S).db
```

### Paso 2: Ejecutar Script de Migración
```bash
cd proyectoAnfer/backend
python migrate_to_multiple_categories.py
```

### Paso 3: Verificar Migración
El script verificará automáticamente que:
- ✅ La tabla `producto_categoria` fue creada
- ✅ Los datos fueron migrados correctamente
- ✅ La columna `categoria_id` fue eliminada
- ✅ Los productos mantienen sus categorías asociadas

### Paso 4: Reiniciar Aplicación
```bash
# Backend
cd proyectoAnfer/backend
python -m uvicorn app.main:app --reload

# Frontend
cd proyectoAnfer/frontend
npm run dev
```

## 🔍 Verificación Post-Migración

### Backend
1. **Crear producto con múltiples categorías**:
   ```json
   POST /products
   {
     "nombre": "Producto Test",
     "descripcion": "Descripción",
     "precio": 100.00,
     "categoria_ids": [1, 2, 3],
     "proveedor_id": 1,
     "variantes": [...]
   }
   ```

2. **Filtrar productos por múltiples categorías**:
   ```
   GET /products?categoria_ids=1&categoria_ids=2
   ```

### Frontend
1. **Admin**: Crear/editar producto con múltiples categorías
2. **Store**: Filtrar productos por múltiples categorías
3. **Product Detail**: Verificar que se muestran todas las categorías

## 🛠️ Estructura de Datos

### Antes (Una categoría por producto)
```json
{
  "id": 1,
  "nombre": "Producto",
  "categoria": {
    "id": 1,
    "name": "Ropa"
  }
}
```

### Después (Múltiples categorías por producto)
```json
{
  "id": 1,
  "nombre": "Producto",
  "categorias": [
    {"id": 1, "name": "Ropa"},
    {"id": 2, "name": "Verano"},
    {"id": 3, "name": "Casual"}
  ]
}
```

## 🔄 Rollback (Si es necesario)

Si necesitas revertir los cambios:

1. **Restaurar backup**:
   ```bash
   cp anfer_backup_YYYYMMDD_HHMMSS.db anfer.db
   ```

2. **Revertir código**:
   ```bash
   git checkout HEAD~1  # O el commit anterior a los cambios
   ```

## 📝 Notas Importantes

- ⚠️ **Backup obligatorio**: Siempre hacer backup antes de migrar
- 🔄 **Compatibilidad**: El código mantiene compatibilidad con estructura antigua durante la transición
- 📊 **Performance**: La nueva estructura es más eficiente para consultas complejas
- 🎯 **UX mejorada**: Los usuarios pueden filtrar por múltiples categorías simultáneamente

## 🐛 Troubleshooting

### Error: "Tabla producto_categoria ya existe"
- La migración ya fue ejecutada
- Verificar que los datos están correctos

### Error: "Columna categoria_id no existe"
- La migración fue exitosa
- El código ya está actualizado para la nueva estructura

### Error: "No se encuentran categorías"
- Verificar que la tabla `categorias` tiene datos
- Ejecutar el script de creación de categorías iniciales

## 📞 Soporte

Si encuentras problemas durante la migración:
1. Verificar logs del script de migración
2. Revisar que el backup se creó correctamente
3. Restaurar desde backup si es necesario
4. Contactar al equipo de desarrollo
