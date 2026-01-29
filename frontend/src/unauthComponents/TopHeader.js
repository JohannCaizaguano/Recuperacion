import React from 'react';

const TopHeader = () => {
    const scrollToSection = (id) => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header className="bg-gray-900 text-white py-4 px-2">
            <div className="container mx-auto flex justify-between items-center">

                <h1 className="text-2xl md:text-4xl font-semibold">StockFlow</h1>

                <ul className='flex'>
                    <li>
                        <button className="bg-transparent rounded p-1.5 md:px-4 md:py-2 mr-4 text-sm md:text-lg"
                            onClick={() => scrollToSection('FeaturesHighlights')}>
                            Features
                        </button>
                    </li>

                    <li>
                        <button className="bg-transparent rounded p-1.5 md:px-4 md:py-2 mr-4 text-sm md:text-lg"
                            onClick={() => scrollToSection('pricing')}>
                            Pricing
                        </button>
                    </li>

                    <li>
                        <button className="bg-transparent rounded p-1.5 md:px-4 md:py-2 mr-4 text-sm md:text-lg"
                            onClick={() => scrollToSection('contact')}>
                            Contact
                        </button>
                    </li>

                    <li>
                        <a href="/login">
                            <button className="bg-green-500 rounded p-1.5 md:px-8 md:py-2 text-sm md:text-lg">
                                LogIn
                            </button>
                        </a>
                    </li>
                </ul>

            </div>
        </header>
    );
}

export default TopHeader;