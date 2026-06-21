import React, { useState } from 'react';
import { useCatalogStore } from '../../store/catalogStore';
import { generateId } from '../../utils/id';
import { Trash2, Edit2, Check, X, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, toggleCategory, moveCategoryUp, moveCategoryDown } = useCatalogStore();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const sortedCategories = [...categories].sort((a, b) => a.orden - b.orden);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    addCategory({
      id: generateId(),
      nombre: newCategoryName.trim(),
      activa: true,
      orden: categories.length > 0 ? Math.max(...categories.map(c => c.orden)) + 1 : 1
    });
    setNewCategoryName('');
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const saveEdit = () => {
    if (editingId && editingName.trim()) {
      updateCategory(editingId, { nombre: editingName.trim() });
    }
    setEditingId(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Gestión de Categorías</h2>

      <div className="mb-8 bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-medium mb-4">Nueva Categoría</h3>
        <form onSubmit={handleAdd} className="flex gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nombre de la categoría"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newCategoryName.trim()}
            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
          >
            Agregar
          </button>
        </form>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {sortedCategories.length === 0 ? (
            <li className="px-6 py-8 text-center text-gray-500">
              No hay categorías creadas.
            </li>
          ) : (
            sortedCategories.map((cat) => (
              <li key={cat.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="px-2 py-1 border rounded"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                      />
                      <button onClick={saveEdit} className="p-1 text-green-600 hover:text-green-800"><Check size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1 text-gray-500 hover:text-gray-700"><X size={18} /></button>
                    </div>
                  ) : (
                    <span className={`text-lg ${!cat.activa ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {cat.nombre}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex flex-col mr-4">
                    <button onClick={() => moveCategoryUp(cat.id)} className="text-gray-400 hover:text-blue-600 p-0.5">
                      <ArrowUp size={16} />
                    </button>
                    <button onClick={() => moveCategoryDown(cat.id)} className="text-gray-400 hover:text-blue-600 p-0.5">
                      <ArrowDown size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-2 rounded-md ${cat.activa ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
                    title={cat.activa ? 'Ocultar categoría' : 'Mostrar categoría'}
                  >
                    {cat.activa ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  
                  <button
                    onClick={() => startEditing(cat.id, cat.nombre)}
                    className="p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded-md"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('¿Seguro que deseas eliminar esta categoría? Los cuadros de esta categoría quedarán sin clasificar.')) {
                        deleteCategory(cat.id);
                      }
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManager;
