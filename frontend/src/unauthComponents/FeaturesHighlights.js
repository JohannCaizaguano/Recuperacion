import React from 'react';

const FeaturesHighlights = () => {
    return (
        <div>
            {/* Feature Highlights Section */}
            <section className="py-16" id='FeaturesHighlights'>
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature Cards */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <i className="fas fa-box-open text-3xl mb-4"></i>
                            <h3 className="text-xl font-semibold mb-2">Inventory Management</h3>
                            <p>Efficiently track and manage your inventory levels in real-time.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <i className="fas fa-chart-line text-3xl mb-4"></i>
                            <h3 className="text-xl font-semibold mb-2">Analytics & Reporting</h3>
                            <p>Gain valuable insights into sales trends and performance metrics.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <i className="fas fa-sync-alt text-3xl mb-4"></i>
                            <h3 className="text-xl font-semibold mb-2">Integration</h3>
                            <p>Seamlessly integrate with other business systems for enhanced efficiency.</p>
                        </div>
                        {/* Additional Feature Cards */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <i className="fas fa-tachometer-alt text-3xl mb-4"></i>
                            <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
                            <p>Get an overview of key metrics and insights at a glance.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <i className="fas fa-shopping-cart text-3xl mb-4"></i>
                            <h3 className="text-xl font-semibold mb-2">Order Tracking</h3>
                            <p>Track orders from placement to delivery for better customer service.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <i className="fas fa-money-bill-wave text-3xl mb-4"></i>
                            <h3 className="text-xl font-semibold mb-2">Transaction Management</h3>
                            <p>Monitor and manage financial transactions seamlessly within the system.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FeaturesHighlights;
