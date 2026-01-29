import React from 'react';

const HeroSection = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">Streamline Your Inventory Management</h1>
                        <p className="text-lg md:text-xl mb-8">Take control of your inventory with our powerful and intuitive management system. Simplify your operations, optimize stock levels, and boost productivity.</p>
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
                            <ul className="list-disc list-inside text-lg">
                                <li>Efficient inventory tracking</li>
                                <li>Real-time updates and notifications</li>
                                <li>Intuitive user interface</li>
                                <li>Customizable reporting tools</li>
                                <li>Seamless integration with e-commerce platforms</li>
                            </ul>
                        </div>
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold mt-8 py-3 px-6 rounded md:w-1/4">Get Started</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HeroSection;
