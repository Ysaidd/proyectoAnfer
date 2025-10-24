#!/usr/bin/env python3
"""
Script de migración para convertir productos de categoría única a múltiples categorías.

Este script:
1. Crea la nueva tabla de asociación producto_categoria
2. Migra los datos existentes de categoria_id a la nueva tabla
3. Elimina la columna categoria_id de la tabla productos

IMPORTANTE: Hacer backup de la base de datos antes de ejecutar este script.
"""

import sys
import os
from sqlalchemy import create_engine, text, MetaData, Table, Column, Integer, ForeignKey
from sqlalchemy.orm import sessionmaker

# Agregar el directorio del proyecto al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configuración de la base de datos
DATABASE_URL = "sqlite:///./anfer.db"  # Ajustar según tu configuración

def create_migration_engine():
    """Crear engine para la migración"""
    return create_engine(DATABASE_URL)

def backup_existing_data(engine):
    """Crear backup de los datos existentes"""
    print("🔄 Creando backup de datos existentes...")
    
    with engine.connect() as conn:
        # Crear tabla de backup
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS productos_backup AS 
            SELECT * FROM productos
        """))
        
        # Crear tabla de backup para categorías
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS categorias_backup AS 
            SELECT * FROM categorias
        """))
        
        conn.commit()
    
    print("✅ Backup creado exitosamente")

def create_association_table(engine):
    """Crear la tabla de asociación producto_categoria"""
    print("🔄 Creando tabla de asociación producto_categoria...")
    
    with engine.connect() as conn:
        # Crear la tabla de asociación
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS producto_categoria (
                producto_id INTEGER NOT NULL,
                categoria_id INTEGER NOT NULL,
                PRIMARY KEY (producto_id, categoria_id),
                FOREIGN KEY (producto_id) REFERENCES productos (id),
                FOREIGN KEY (categoria_id) REFERENCES categorias (id)
            )
        """))
        
        conn.commit()
    
    print("✅ Tabla de asociación creada exitosamente")

def migrate_existing_data(engine):
    """Migrar datos existentes de categoria_id a la nueva tabla"""
    print("🔄 Migrando datos existentes...")
    
    with engine.connect() as conn:
        # Insertar datos en la nueva tabla de asociación
        conn.execute(text("""
            INSERT INTO producto_categoria (producto_id, categoria_id)
            SELECT id, categoria_id 
            FROM productos 
            WHERE categoria_id IS NOT NULL
        """))
        
        # Verificar cuántos registros se migraron
        result = conn.execute(text("SELECT COUNT(*) FROM producto_categoria"))
        count = result.scalar()
        
        conn.commit()
    
    print(f"✅ {count} productos migrados exitosamente")

def remove_old_column(engine):
    """Eliminar la columna categoria_id de la tabla productos"""
    print("🔄 Eliminando columna categoria_id...")
    
    with engine.connect() as conn:
        # En SQLite, necesitamos recrear la tabla sin la columna categoria_id
        conn.execute(text("""
            CREATE TABLE productos_new (
                id INTEGER PRIMARY KEY,
                nombre VARCHAR NOT NULL,
                descripcion VARCHAR NOT NULL,
                precio DECIMAL(10, 2) NOT NULL,
                proveedor_id INTEGER NOT NULL,
                image_url VARCHAR,
                FOREIGN KEY (proveedor_id) REFERENCES proveedor (id)
            )
        """))
        
        # Copiar datos sin la columna categoria_id
        conn.execute(text("""
            INSERT INTO productos_new (id, nombre, descripcion, precio, proveedor_id, image_url)
            SELECT id, nombre, descripcion, precio, proveedor_id, image_url
            FROM productos
        """))
        
        # Eliminar tabla antigua y renombrar la nueva
        conn.execute(text("DROP TABLE productos"))
        conn.execute(text("ALTER TABLE productos_new RENAME TO productos"))
        
        conn.commit()
    
    print("✅ Columna categoria_id eliminada exitosamente")

def verify_migration(engine):
    """Verificar que la migración fue exitosa"""
    print("🔄 Verificando migración...")
    
    with engine.connect() as conn:
        # Verificar que la tabla de asociación existe y tiene datos
        result = conn.execute(text("SELECT COUNT(*) FROM producto_categoria"))
        association_count = result.scalar()
        
        # Verificar que la tabla productos no tiene categoria_id
        try:
            conn.execute(text("SELECT categoria_id FROM productos LIMIT 1"))
            print("❌ ERROR: La columna categoria_id aún existe")
            return False
        except Exception:
            print("✅ Columna categoria_id eliminada correctamente")
        
        # Verificar que los productos tienen sus categorías asociadas
        result = conn.execute(text("""
            SELECT COUNT(DISTINCT p.id) 
            FROM productos p 
            JOIN producto_categoria pc ON p.id = pc.producto_id
        """))
        products_with_categories = result.scalar()
        
        result = conn.execute(text("SELECT COUNT(*) FROM productos"))
        total_products = result.scalar()
        
        print(f"✅ {association_count} asociaciones producto-categoría creadas")
        print(f"✅ {products_with_categories} de {total_products} productos tienen categorías")
        
        return True

def main():
    """Función principal de migración"""
    print("🚀 Iniciando migración a múltiples categorías...")
    print("⚠️  IMPORTANTE: Asegúrate de haber hecho backup de tu base de datos")
    
    try:
        engine = create_migration_engine()
        
        # Paso 1: Backup
        backup_existing_data(engine)
        
        # Paso 2: Crear tabla de asociación
        create_association_table(engine)
        
        # Paso 3: Migrar datos
        migrate_existing_data(engine)
        
        # Paso 4: Eliminar columna antigua
        remove_old_column(engine)
        
        # Paso 5: Verificar migración
        if verify_migration(engine):
            print("\n🎉 ¡Migración completada exitosamente!")
            print("📋 Resumen:")
            print("   - Tabla producto_categoria creada")
            print("   - Datos migrados de categoria_id a la nueva tabla")
            print("   - Columna categoria_id eliminada")
            print("   - Backup creado en productos_backup y categorias_backup")
            print("\n🔄 Reinicia tu aplicación para que los cambios surtan efecto")
        else:
            print("\n❌ La migración falló. Revisa los logs.")
            
    except Exception as e:
        print(f"\n❌ Error durante la migración: {e}")
        print("🔄 Restaura tu base de datos desde el backup si es necesario")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
