import React from 'react';

const ContactSection = () => {
    return (
        <section id="contact" className="bg-gray-900 text-white p-16">
            <div className="container mx-auto m-8">
                <h2 className="text-4xl text-center font-bold mb-12">Contact Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
                        <p className="text-gray-400 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula, urna ut finibus vehicula.</p>
                        <p>Email: info@example.com</p>
                        <p>Phone: +1234567890</p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Visit Us</h3>
                        <p className="text-gray-400 mb-4">123 Main Street, City, Country</p>
                    </div>
                </div>
            </div>
            <footer className='flex justify-center items-center w-2/3 m-auto mt-16 p-8 border-t border-gray-600'>
                <p className="text-sm">&copy; 2024 StockFlow. All rights reserved.</p>
            </footer>
        </section>
    );
}

export default ContactSection;
