import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonialData = [
    {
        text: "Using this IMS has revolutionized our inventory management process. Highly recommended!",
        author: "John Doe, CEO of XYZ Corp"
    },
    {
        text: "Incredible features and outstanding support. We're thrilled with the results.",
        author: "Jane Smith, Operations Manager"
    },
    {
        text: "Efficient and user-friendly interface. It has made inventory tracking a breeze!",
        author: "Michael Johnson, Warehouse Manager"
    },
    {
        text: "The IMS helped us optimize stock levels and reduce wastage. A game-changer for our business!",
        author: "Emily Davis, Supply Chain Analyst"
    },
    {
        text: "Great product with excellent customer service. It's a must-have for any business looking to streamline operations.",
        author: "David Wilson, Small Business Owner"
    }
];

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
};

const Testimonials = () => {
    return (
        <div>
            {/* Testimonials Section */}
            <section className="bg-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">What Our Clients Say</h2>
                    <Slider {...settings}>
                        {testimonialData.map((testimonial, index) => (
                            <div key={index}>
                                <div className="bg-white p-6 rounded-lg shadow-md m-4">
                                    <p className="text-lg mb-4">"{testimonial.text}"</p>
                                    <p className="text-gray-600"> - {testimonial.author}</p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>
        </div>
    );
}

export default Testimonials;
