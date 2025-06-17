'use client';

import { useCallback, useEffect, useState } from 'react';
import CategoryTable from './_components/CategoryTable';
import AddCategoryModal from './_components/AddCategoryModal';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Assuming Heroicons
import NoCategories from './_components/NoCategories';
interface Category {
    id: number;
    name: string;
    description?: string;
    createdDate: string;
}
export default function CategoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const categoriesPerPage = 5;

    const [error, setError] = useState<string | null>(null);
    const loadCategories = useCallback(async () => {
        // Simulated API call
        setLoading(true);
        try {
            // Replace with actual API call
            const mockData = [
                {
                    id: 1,
                    name: 'Plumbing',
                    description: 'Plumbing services',
                    createdDate: '2025-05-15',
                },
                {
                    id: 2,
                    name: 'Electrical Maintenance',
                    description: "repairing & installing electrical systems",
                    createdDate: '2023-05-10',
                },
                {
                    id: 3,
                    name: 'Carpenting',
                    description: 'Carpenting services',
                    createdDate: '2025-05-05',
                },
                {
                    id: 4,
                    name: 'Construction',
                    description: 'Construction services',
                    createdDate: '2025-05-28',
                },
                {
                    id: 5,
                    name: 'Painting',
                    description: 'Painting Services',
                    createdDate: '2025-05-20',
                },
                {
                    id: 6,
                    name: 'Beauty & Personal Care',
                    description: 'Products for personal hygiene and beauty',
                    createdDate: '2025-05-15',
                },
                {
                    id: 7,
                    name: 'Toys & Games',
                    description: 'Toys and games for all ages',
                    createdDate: '2023-05-10',
                },
            ];
            const startIndex = (currentPage - 1) * categoriesPerPage;
            const endIndex = startIndex + categoriesPerPage;
            const paginatedCategories = mockData.slice(startIndex, endIndex);

            setCategories(paginatedCategories);
            setTotalResults(mockData.length);
        } catch (err) {
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    }, [currentPage]);
    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    const handleAddCategory = (newCategory: Omit<Category, 'id' | 'createdDate'>) => {
        setCategories((prevCategories) => [
            ...prevCategories,
            {
                ...newCategory,
                id: prevCategories.length > 0 ? Math.max(...prevCategories.map(c => c.id)) + 1 : 1,
                createdDate: new Date().toISOString().split('T')[0],
            },
        ]);
        setIsModalOpen(false);
    };

    const handleDeleteCategory = (id: number) => {
        setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
    };
    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Categories</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search categories..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <select className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Newest first</option>
                            <option>Oldest first</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add New Category
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <p className="text-lg text-gray-600">Loading categories...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                ) : categories.length === 0 ? (
                    <NoCategories message="No categories found" />
                ) : (
                    <CategoryTable
                        categories={categories}
                        onDelete={handleDeleteCategory}
                        currentPage={currentPage}
                        totalResults={totalResults}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            <AddCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddCategory}
            />
        </div>
    );
}