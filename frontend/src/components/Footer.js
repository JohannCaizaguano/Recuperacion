import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-8 bottom-0">
            <div className="container mx-auto text-center">
                <p className="text-sm">&copy; 2024 StockFlow. All rights reserved.</p>
                <div className="mt-8">
                    <a href="/" className="text-gray-300 hover:text-white mx-4">About Us</a>
                    <a href="/" className="text-gray-300 hover:text-white mx-4">Contact Us</a>
                    <a href="/" className="text-gray-300 hover:text-white mx-4">Terms of Service</a>
                    <a href="/" className="text-gray-300 hover:text-white mx-4">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
