import React from 'react';

const Pricing = () => {
    return (
        <section id="pricing" className="bg-gray-100 py-16">
            <div className="container mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-12">Choose Your Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <h3 className="text-3xl font-semibold mb-4">Basic Plan</h3>
                        <ul className="text-gray-600 mb-8">
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Basic feature 1
                            </li>
                            <li>
                                <i className="fas fa-times text-red-500 mr-2"></i>
                                Basic feature 2
                            </li>
                            <li>
                                <i className="fas fa-times text-red-500 mr-2"></i>
                                Basic feature 3
                            </li>
                            <li>
                                <i className="fas fa-times text-red-500 mr-2"></i>
                                Basic feature 4
                            </li>
                            <li>
                                <i className="fas fa-times text-red-500 mr-2"></i>
                                Basic feature 5
                            </li>
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Basic feature 6
                            </li>
                            <li>
                                <i className="fas fa-times text-red-500 mr-2"></i>
                                Basic feature 7
                            </li>
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Basic feature 8
                            </li>
                        </ul>
                        <h4 className="text-2xl font-bold mb-8">$19/month</h4>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full mx-auto block w-3/4">
                            Select Basic Plan
                        </button>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <h3 className="text-3xl font-semibold mb-4">Free Plan</h3>
                        <ul className="text-gray-600 mb-8">
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Basic feature 1
                            </li>
                            <li>
                                <i className="fas fa-times text-red-500 mr-2"></i>
                                Basic feature 2
                            </li>
                            <li>
                                <i className="fas fa-times text-red-500 mr-2"></i>
                                Basic feature 3
                            </li>
                            <li>
                                <i className="fas fa-times text-red-500 mr-2"></i>
                                Basic feature 4
                            </li>
                            <li>
                                <i className="fas fa-times text-red-500 mr-2"></i>
                                Basic feature 5
                            </li>
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Basic feature 6
                            </li>
                            <li>
                                <i className="fas fa-times text-red-500 mr-2"></i>
                                Basic feature 7
                            </li>
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Basic feature 8
                            </li>
                        </ul>
                        <h4 className="text-2xl font-bold mb-8">Free</h4>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full mx-auto block w-3/4">
                            Get Started for Free
                        </button>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <h3 className="text-3xl font-semibold mb-4">Pro Plan</h3>
                        <ul className="text-gray-600 mb-8">
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Pro feature 1
                            </li>
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Pro feature 2
                            </li>
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Pro feature 3
                            </li>
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Pro feature 4
                            </li>
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Pro feature 5
                            </li>
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Pro feature 6
                            </li>
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Pro feature 7
                            </li>
                            <li>
                                <i className="fas fa-check text-green-500 mr-2"></i>
                                Pro feature 8
                            </li>
                        </ul>
                        <h4 className="text-2xl font-bold mb-8">$49/month</h4>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full mx-auto block w-3/4">
                            Select Pro Plan
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Pricing;
