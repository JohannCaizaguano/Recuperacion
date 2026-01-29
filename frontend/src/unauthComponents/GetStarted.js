import React from 'react';

const GetStarted = () => {
    return (
        <div>
            {/* Call to Action Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Get Started?</h2>
                    <p className="text-lg md:text-xl mb-8 w-2/3">Sign up now to experience the power of our Inventory Management System. Take control of your inventory, streamline your operations, and boost productivity!</p>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded md:w-1/5">Sign Up</button>
                </div>
            </section>
        </div>
    );
}

export default GetStarted;
