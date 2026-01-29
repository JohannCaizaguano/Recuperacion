import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import loginImg from '../images/warehouse-management-software.png';

const LoginForm = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login(email, password);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setIsAuthenticated(true);
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='fixed w-screen py-4 px-2 bg-gray-900 text-white flex justify-between'>
                <div className='container mx-auto flex items-center'>
                    <Link to="/" className="text-2xl md:text-4xl font-semibold">StockFlow</Link>
                </div>
            </div>

            <div className="flex h-screen">
                <div className="w-1/2 bg-gray-200 flex justify-center items-center">
                    <img src={loginImg} alt="Login" className="max-w-2xl" />
                </div>

                <div className="w-1/2 flex justify-center items-center">
                    <div className="w-1/2 max-w-2xl p-8 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-6">Welcome Back!</h2>
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="flex items-center border rounded-lg">
                                <span className="px-3">
                                    <i className="fa fa-envelope text-gray-500"></i>
                                </span>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full py-3 px-4 outline-none"
                                    required
                                />
                            </div>
                            <div className="flex items-center border rounded-lg">
                                <span className="px-3">
                                    <i className="fa fa-lock text-gray-500"></i>
                                </span>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full py-3 px-4 outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-blue-300"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        <p className="mt-4 text-center text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-500 hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
