import React from 'react';

const Header = () => {
    return (
        <header className="bg-gray-200 px-4 py-2 flex justify-between items-center">
            <div className="logo">
                <h1 className="text-2xl font-bold text-black">Hey!</h1>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Toggle Theme
            </button>
        </header>
    );
}

export default Header;
