import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, ordersAPI, transactionsAPI } from '../services/api';

const Dashboard = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalTurnover, setTotalTurnover] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [partialError, setPartialError] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            setPartialError(false);

            try {
                // Usar Promise.allSettled para manejar errores individuales sin colapsar toda la interfaz
                const results = await Promise.allSettled([
                    productsAPI.getAll(),
                    ordersAPI.getAll(),
                    transactionsAPI.getTotalTurnover(),
                    transactionsAPI.getAll(),
                ]);

                const [productsResult, ordersResult, turnoverResult, transactionsResult] = results;

                let hasPartialError = false;

                // Procesar productos con validación de respuesta vacía
                if (productsResult.status === 'fulfilled') {
                    const productsData = productsResult.value?.data;
                    setTotalProducts(Array.isArray(productsData) ? productsData.length : 0);
                } else {
                    console.error('Error fetching products:', productsResult.reason);
                    setTotalProducts(0);
                    hasPartialError = true;
                }

                // Procesar órdenes con validación de respuesta vacía
                if (ordersResult.status === 'fulfilled') {
                    const ordersData = ordersResult.value?.data;
                    setTotalOrders(Array.isArray(ordersData) ? ordersData.length : 0);
                } else {
                    console.error('Error fetching orders:', ordersResult.reason);
                    setTotalOrders(0);
                    hasPartialError = true;
                }

                // Procesar turnover con validación de respuesta vacía
                if (turnoverResult.status === 'fulfilled') {
                    const turnoverData = turnoverResult.value?.data;
                    setTotalTurnover(turnoverData?.totalTurnover ?? 0);
                } else {
                    console.error('Error fetching turnover:', turnoverResult.reason);
                    setTotalTurnover(0);
                    hasPartialError = true;
                }

                // Procesar transacciones recientes con validación de respuesta vacía
                if (transactionsResult.status === 'fulfilled') {
                    const transactionsData = transactionsResult.value?.data;
                    if (Array.isArray(transactionsData)) {
                        setRecentTransactions(transactionsData.slice(0, 5));
                    } else {
                        setRecentTransactions([]);
                    }
                } else {
                    console.error('Error fetching transactions:', transactionsResult.reason);
                    setRecentTransactions([]);
                    hasPartialError = true;
                }

                // Indicar si hubo errores parciales
                if (hasPartialError) {
                    setPartialError(true);
                }

                // Si todas las llamadas fallaron, mostrar error general
                const allFailed = results.every(r => r.status === 'rejected');
                if (allFailed) {
                    setError('No se pudo cargar la información del dashboard. Por favor, intente de nuevo más tarde.');
                }

            } catch (error) {
                console.error('Error inesperado en fetchDashboardData:', error);
                setError('Ocurrió un error inesperado. Por favor, intente de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="flex flex-col">
            <div className="flex flex-1">
                <main className="flex-1 p-6">

                    <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>

                    {/* Banner de error general */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Banner de error parcial */}
                    {partialError && !error && (
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>Algunos datos no pudieron cargarse. La información mostrada puede estar incompleta.</span>
                            </div>
                        </div>
                    )}

                    {/* Estado de carga global */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-gray-600">Cargando información del dashboard...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                <div className="bg-white p-6 rounded shadow-md">
                                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Total Products</h2>
                                    <p className="text-4xl">{totalProducts}</p>
                                </div>

                                <div className="bg-white p-6 rounded shadow-md">
                                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Total Orders</h2>
                                    <p className="text-4xl">{totalOrders}</p>
                                </div>

                                <div className="bg-white p-6 rounded shadow-md">
                                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Total Turnover</h2>
                                    <p className="text-4xl">₹ {totalTurnover}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                                <div className="bg-white p-6 rounded shadow-md">
                                    <h2 className="text-xl font-semibold mb-2">Data Visualization</h2>
                                    {/* Add your chart component here */}
                                    <p className="text-gray-500">No data available to visualize</p>
                                </div>

                                <div className="bg-white p-6 rounded shadow-md">
                                    <h2 className="text-xl font-semibold mb-2">Recent Transactions</h2>
                                    {recentTransactions.length > 0 ? (
                                        <ul className="text-gray-600 space-y-2">
                                            {recentTransactions.map(transaction => (
                                                <li key={transaction._id} className="flex justify-between">
                                                    <span>#{transaction._id?.slice(-6)}</span>
                                                    <span className="font-semibold">₹{transaction.totalPrice?.toFixed(2) || '0.00'}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No recent transactions</p>
                                    )}
                                    <Link to="/transactions" className="text-blue-500 hover:underline mt-2 inline-block">View all transactions</Link>
                                </div>

                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
