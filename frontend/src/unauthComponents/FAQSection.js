import React, { useState } from 'react';

const FAQSection = () => {
    // State to manage visibility of each FAQ answer
    const [isOpen, setIsOpen] = useState(Array(4).fill(false));

    // Function to toggle the visibility of a specific answer
    const toggleAnswer = (index) => {
        const updatedIsOpen = [...isOpen];
        updatedIsOpen[index] = !updatedIsOpen[index];
        setIsOpen(updatedIsOpen);
    };

    return (
        <section id="faq" className="bg-white py-16">
            <div className="container mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">Frequently Asked Questions</h2>
                <div className=" flex flex-col justify-center items-center">
                    {[
                        { question: 'How do I sign up for the IMS?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel odio dolor.' },
                        { question: 'Can I upgrade my plan later?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel odio dolor.' },
                        { question: 'Is there a free trial available?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel odio dolor.' },
                        { question: 'How can I contact customer support?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel odio dolor.' }
                    ].map((faq, index) => (
                        <div key={index} className='border p-4 px-8 rounded m-2 w-2/3'>
                            <h3
                                className="text-2xl font-semibold mb-4 cursor-pointer"
                                onClick={() => toggleAnswer(index)}
                            >
                                {faq.question}
                            </h3>
                            {isOpen[index] && <p className="text-gray-600 mb-4">{faq.answer}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FAQSection;
