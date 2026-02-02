import React, { useState, useEffect, useMemo } from 'react';
import { categoriesAPI } from '../services/api';
import CategoryCard from '../components/CategoryCard';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [adding, setAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrado dinámico en tiempo real con useMemo para optimizar rendimiento
    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) return categories;
        const term = searchTerm.toLowerCase();
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(term) ||
            (cat.description && cat.description.toLowerCase().includes(term))
        );
    }, [categories, searchTerm]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoriesAPI.getAll();
            setCategories(response.data);
            setError('');
        } catch (err) {
            setError('Error fetching categories');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            await categoriesAPI.delete(categoryId);
            setCategories(categories.filter(c => c._id !== categoryId));
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting category');
            console.error('Error deleting category:', err);
        }
    };

    const handleAddCategory = async () => {
        if (newCategoryName.trim() === '') return;

        try {
            setAdding(true);
            const response = await categoriesAPI.create({ name: newCategoryName });
            setCategories([...categories, response.data]);
            setNewCategoryName('');
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding category');
            console.error('Error adding category:', err);
        } finally {
            setAdding(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-6 min-h-64">
                <div className="flex items-center space-x-2 text-gray-600">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading categories...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-6">
            {/* Header con título y botón de agregar */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold">Categories</h1>
                <div className="flex items-center">
                    <input
                        type="text"
                        className="border border-gray-300 p-2 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="New Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <button
                        onClick={handleAddCategory}
                        disabled={adding || !newCategoryName.trim()}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-r disabled:bg-green-300 transition-colors duration-200"
                    >
                        {adding ? 'Adding...' : 'Add New Category'}
                    </button>
                </div>
            </div>

            {/* Barra de búsqueda en tiempo real */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Search categories by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Contador de resultados */}
                {categories.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                        Showing <span className="font-semibold text-gray-700">{filteredCategories.length}</span> of <span className="font-semibold text-gray-700">{categories.length}</span> categories
                        {searchTerm && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Filtered by: "{searchTerm}"
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {/* Lista de categorías */}
            {categories.length === 0 ? (
                <div className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <p className="text-lg font-medium">No categories found</p>
                    <p className="mt-1">Add your first category to get started!</p>
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-lg font-medium">No matching categories</p>
                    <p className="mt-1">Try adjusting your search term</p>
                    <button
                        onClick={clearSearch}
                        className="mt-4 text-blue-500 hover:text-blue-700 font-medium transition-colors"
                    >
                        Clear search
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all">
                    {filteredCategories.map(category => (
                        <CategoryCard key={category._id} category={category} onDelete={handleDeleteCategory} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
