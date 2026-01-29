/**
 * Seed script for StockFlow MongoDB database
 * Creates sample users, categories, and products
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/UserModel');
const Category = require('./models/CategoryModel');
const Product = require('./models/ProductModel');

// Seed data
const users = [
    {
        username: 'admin',
        email: 'admin@stockflow.com',
        password: 'admin123',
        role: 'Admin'
    },
    {
        username: 'manager',
        email: 'manager@stockflow.com',
        password: 'manager123',
        role: 'Manager'
    },
    {
        username: 'staff',
        email: 'staff@stockflow.com',
        password: 'staff123',
        role: 'Staff'
    }
];

const categories = [
    { name: 'Electronics', description: 'Electronic devices and accessories' },
    { name: 'Clothing', description: 'Apparel and fashion items' },
    { name: 'Food & Beverages', description: 'Food products and drinks' },
    { name: 'Office Supplies', description: 'Office equipment and supplies' },
    { name: 'Hardware', description: 'Tools and hardware equipment' }
];

const products = [
    // Electronics
    { name: 'Laptop HP ProBook', description: 'Business laptop 15.6"', sku: 'ELEC-001', quantity: 25, price: 899.99, categoryName: 'Electronics' },
    { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', sku: 'ELEC-002', quantity: 150, price: 29.99, categoryName: 'Electronics' },
    { name: 'USB-C Hub', description: '7-in-1 USB-C adapter', sku: 'ELEC-003', quantity: 80, price: 49.99, categoryName: 'Electronics' },
    { name: 'Monitor LED 24"', description: 'Full HD LED Monitor', sku: 'ELEC-004', quantity: 40, price: 199.99, categoryName: 'Electronics' },
    { name: 'Keyboard Mechanical', description: 'RGB Mechanical Keyboard', sku: 'ELEC-005', quantity: 60, price: 79.99, categoryName: 'Electronics' },
    
    // Clothing
    { name: 'Polo Shirt', description: 'Cotton polo shirt', sku: 'CLOTH-001', quantity: 200, price: 24.99, categoryName: 'Clothing' },
    { name: 'Jeans Classic', description: 'Classic fit jeans', sku: 'CLOTH-002', quantity: 150, price: 49.99, categoryName: 'Clothing' },
    { name: 'Winter Jacket', description: 'Waterproof winter jacket', sku: 'CLOTH-003', quantity: 75, price: 129.99, categoryName: 'Clothing' },
    
    // Food & Beverages
    { name: 'Coffee Beans 1kg', description: 'Premium arabica coffee', sku: 'FOOD-001', quantity: 300, price: 15.99, categoryName: 'Food & Beverages' },
    { name: 'Green Tea Box', description: '100 tea bags', sku: 'FOOD-002', quantity: 250, price: 8.99, categoryName: 'Food & Beverages' },
    { name: 'Bottled Water Pack', description: '24 bottles x 500ml', sku: 'FOOD-003', quantity: 500, price: 6.99, categoryName: 'Food & Beverages' },
    
    // Office Supplies
    { name: 'Printer Paper A4', description: '500 sheets pack', sku: 'OFF-001', quantity: 400, price: 5.99, categoryName: 'Office Supplies' },
    { name: 'Stapler Heavy Duty', description: 'Metal stapler', sku: 'OFF-002', quantity: 100, price: 12.99, categoryName: 'Office Supplies' },
    { name: 'Pen Box Blue', description: '50 ballpoint pens', sku: 'OFF-003', quantity: 200, price: 9.99, categoryName: 'Office Supplies' },
    { name: 'Notebook A5', description: 'Spiral notebook 100 pages', sku: 'OFF-004', quantity: 350, price: 3.99, categoryName: 'Office Supplies' },
    
    // Hardware
    { name: 'Hammer Steel', description: 'Professional steel hammer', sku: 'HW-001', quantity: 50, price: 19.99, categoryName: 'Hardware' },
    { name: 'Screwdriver Set', description: '12-piece screwdriver set', sku: 'HW-002', quantity: 80, price: 29.99, categoryName: 'Hardware' },
    { name: 'Drill Electric', description: 'Cordless electric drill', sku: 'HW-003', quantity: 30, price: 89.99, categoryName: 'Hardware' }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seed...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create users
        console.log('👤 Creating users...');
        for (const userData of users) {
            const user = new User(userData);
            await user.save();
            console.log(`   ✅ Created user: ${userData.username} (${userData.role})`);
        }
        console.log('');

        // Create categories
        console.log('📁 Creating categories...');
        const createdCategories = await Category.insertMany(categories);
        const categoryMap = {};
        createdCategories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
            console.log(`   ✅ Created category: ${cat.name}`);
        });
        console.log('');

        // Create products with category references
        console.log('📦 Creating products...');
        for (const productData of products) {
            const { categoryName, ...productInfo } = productData;
            const product = new Product({
                ...productInfo,
                category: categoryMap[categoryName]
            });
            await product.save();
            console.log(`   ✅ Created product: ${product.name} (${product.sku})`);
        }
        console.log('');

        // Summary
        console.log('═══════════════════════════════════════════');
        console.log('🎉 Database seeded successfully!');
        console.log('═══════════════════════════════════════════');
        console.log('');
        console.log('📊 Summary:');
        console.log(`   • Users: ${users.length}`);
        console.log(`   • Categories: ${categories.length}`);
        console.log(`   • Products: ${products.length}`);
        console.log('');
        console.log('🔐 Login Credentials:');
        console.log('   ┌─────────────────────────────────────────────────────────┐');
        console.log('   │ Role     │ Username │ Email                  │ Password │');
        console.log('   ├─────────────────────────────────────────────────────────┤');
        console.log('   │ Admin    │ admin    │ admin@stockflow.com    │ admin123 │');
        console.log('   │ Manager  │ manager  │ manager@stockflow.com  │ manager123│');
        console.log('   │ Staff    │ staff    │ staff@stockflow.com    │ staff123 │');
        console.log('   └─────────────────────────────────────────────────────────┘');
        console.log('');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// Run seed
seedDatabase();
