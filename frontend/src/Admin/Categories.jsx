import React, { useEffect, useState } from 'react';

const CategoryForm = ({ initialCategory, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: initialCategory?.name || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {initialCategory ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nombre de categoría"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border mb-3 rounded"
            required
          />
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              ❌ Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              {initialCategory ? '✅ Guardar' : '➕ Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/categories/');
      if (!response.ok) throw new Error('Error al cargar categorías');
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      const response = await fetch('http://localhost:8000/categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) throw new Error('Error al crear categoría');
      await fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/categories/${editingCategory.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData),
        }
      );
      if (!response.ok) throw new Error('Error al actualizar categoría');
      await fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/categories/${categoryId}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) throw new Error('Error al eliminar categoría');
      await fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingCategory) {
      await handleUpdateCategory(formData);
    } else {
      await handleCreateCategory(formData);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Categorías</h1>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          ➕ Nueva Categoría
        </button>
      </div>

      {showForm && (
        <CategoryForm
          initialCategory={editingCategory}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="grid gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <span className="text-lg">{category.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditingCategory(category);
                  setShowForm(true);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;