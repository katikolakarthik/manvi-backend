const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Elegant Cotton Anarkali Dress",
    description: "A beautiful cotton anarkali dress perfect for festive occasions. Features intricate embroidery and comfortable fit.",
    price: 2499,
    originalPrice: 3499,
    category: "clothing",
    brand: "MONVI",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop&crop=right"
    ],
    stock: 50,
    sku: "ANK001",
    weight: 0.5,
    tags: ["anarkali", "cotton", "festive", "embroidery"],
    isActive: true,
    isFeatured: true,
    discount: 28,
    material: "Cotton",
    pattern: "Embroidered",
    color: "Pink",
    occasion: "Festive",
    sleeve_type: "Full Sleeve",
    neck_type: "Round Neck",
    fabric: "Cotton",
    wash_care: "Dry Clean Only",
    silhouette: "A-Line",
    length: "Ankle Length",
    sizes: ["XS", "S", "M", "L", "XL"],
    size_guide: [
      { size: "XS", bust: "32", waist: "26" },
      { size: "S", bust: "34", waist: "28" },
      { size: "M", bust: "36", waist: "30" },
      { size: "L", bust: "38", waist: "32" },
      { size: "XL", bust: "40", waist: "34" }
    ]
  },
  {
    name: "Designer Silk Saree",
    description: "Exquisite silk saree with zari work and traditional motifs. Perfect for weddings and special occasions.",
    price: 8999,
    originalPrice: 12999,
    category: "clothing",
    brand: "MONVI",
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=600&fit=crop&crop=left"
    ],
    stock: 25,
    sku: "SRK001",
    weight: 0.8,
    tags: ["silk", "saree", "wedding", "zari"],
    isActive: true,
    isFeatured: true,
    discount: 31,
    material: "Silk",
    pattern: "Zari Work",
    color: "Red",
    occasion: "Wedding",
    fabric: "Silk",
    wash_care: "Dry Clean Only",
    silhouette: "Traditional",
    sizes: ["Free Size"],
    size_guide: [
      { size: "Free Size", bust: "All", waist: "All" }
    ]
  },
  {
    name: "Casual Cotton Kurti",
    description: "Comfortable and stylish cotton kurti perfect for daily wear. Features a modern cut and breathable fabric.",
    price: 899,
    originalPrice: 1299,
    category: "clothing",
    brand: "MONVI",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop&crop=top"
    ],
    stock: 100,
    sku: "KRT001",
    weight: 0.3,
    tags: ["kurti", "cotton", "casual", "daily"],
    isActive: true,
    isFeatured: false,
    discount: 31,
    material: "Cotton",
    pattern: "Solid",
    color: "Blue",
    occasion: "Casual",
    sleeve_type: "Half Sleeve",
    neck_type: "V-Neck",
    fabric: "Cotton",
    wash_care: "Machine Wash",
    silhouette: "Straight",
    length: "Knee Length",
    sizes: ["XS", "S", "M", "L", "XL"],
    size_guide: [
      { size: "XS", bust: "32", waist: "26" },
      { size: "S", bust: "34", waist: "28" },
      { size: "M", bust: "36", waist: "30" },
      { size: "L", bust: "38", waist: "32" },
      { size: "XL", bust: "40", waist: "34" }
    ]
  },
  {
    name: "Embroidered Georgette Dress",
    description: "Stunning georgette dress with intricate embroidery work. Perfect for parties and celebrations.",
    price: 3999,
    originalPrice: 5999,
    category: "clothing",
    brand: "MONVI",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop&crop=bottom"
    ],
    stock: 35,
    sku: "GEO001",
    weight: 0.6,
    tags: ["georgette", "embroidery", "party", "celebration"],
    isActive: true,
    isFeatured: true,
    discount: 33,
    material: "Georgette",
    pattern: "Embroidered",
    color: "Green",
    occasion: "Party",
    sleeve_type: "Sleeveless",
    neck_type: "Sweetheart",
    fabric: "Georgette",
    wash_care: "Dry Clean Only",
    silhouette: "A-Line",
    length: "Knee Length",
    sizes: ["XS", "S", "M", "L", "XL"],
    size_guide: [
      { size: "XS", bust: "32", waist: "26" },
      { size: "S", bust: "34", waist: "28" },
      { size: "M", bust: "36", waist: "30" },
      { size: "L", bust: "38", waist: "32" },
      { size: "XL", bust: "40", waist: "34" }
    ]
  },
  {
    name: "Traditional Banarasi Saree",
    description: "Authentic Banarasi silk saree with traditional motifs and zari work. A timeless piece for special occasions.",
    price: 15999,
    originalPrice: 22999,
    category: "clothing",
    brand: "MONVI",
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=600&fit=crop&crop=right",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=600&fit=crop&crop=left"
    ],
    stock: 15,
    sku: "BNR001",
    weight: 1.2,
    tags: ["banarasi", "silk", "traditional", "wedding"],
    isActive: true,
    isFeatured: true,
    discount: 30,
    material: "Banarasi Silk",
    pattern: "Traditional Motifs",
    color: "Gold",
    occasion: "Wedding",
    fabric: "Banarasi Silk",
    wash_care: "Dry Clean Only",
    silhouette: "Traditional",
    sizes: ["Free Size"],
    size_guide: [
      { size: "Free Size", bust: "All", waist: "All" }
    ]
  },
  {
    name: "Casual Rayon Kurti",
    description: "Comfortable rayon kurti with modern design. Perfect for office wear and casual outings.",
    price: 699,
    originalPrice: 999,
    category: "clothing",
    brand: "MONVI",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop&crop=top",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop&crop=center"
    ],
    stock: 75,
    sku: "RYK001",
    weight: 0.4,
    tags: ["rayon", "kurti", "casual", "office"],
    isActive: true,
    isFeatured: false,
    discount: 30,
    material: "Rayon",
    pattern: "Printed",
    color: "Purple",
    occasion: "Casual",
    sleeve_type: "Full Sleeve",
    neck_type: "Round Neck",
    fabric: "Rayon",
    wash_care: "Machine Wash",
    silhouette: "Straight",
    length: "Knee Length",
    sizes: ["XS", "S", "M", "L", "XL"],
    size_guide: [
      { size: "XS", bust: "32", waist: "26" },
      { size: "S", bust: "34", waist: "28" },
      { size: "M", bust: "36", waist: "30" },
      { size: "L", bust: "38", waist: "32" },
      { size: "XL", bust: "40", waist: "34" }
    ]
  },
  {
    name: "Designer Organza Dress",
    description: "Elegant organza dress with modern cut and sophisticated design. Perfect for cocktail parties.",
    price: 5999,
    originalPrice: 8999,
    category: "clothing",
    brand: "MONVI",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop&crop=bottom",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop&crop=right"
    ],
    stock: 20,
    sku: "ORG001",
    weight: 0.7,
    tags: ["organza", "designer", "cocktail", "party"],
    isActive: true,
    isFeatured: true,
    discount: 33,
    material: "Organza",
    pattern: "Solid",
    color: "Black",
    occasion: "Cocktail",
    sleeve_type: "Sleeveless",
    neck_type: "V-Neck",
    fabric: "Organza",
    wash_care: "Dry Clean Only",
    silhouette: "A-Line",
    length: "Knee Length",
    sizes: ["XS", "S", "M", "L", "XL"],
    size_guide: [
      { size: "XS", bust: "32", waist: "26" },
      { size: "S", bust: "34", waist: "28" },
      { size: "M", bust: "36", waist: "30" },
      { size: "L", bust: "38", waist: "32" },
      { size: "XL", bust: "40", waist: "34" }
    ]
  },
  {
    name: "Traditional Silk Saree",
    description: "Classic silk saree with traditional design and comfortable drape. Perfect for cultural events.",
    price: 4999,
    originalPrice: 7999,
    category: "clothing",
    brand: "MONVI",
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=600&fit=crop&crop=left"
    ],
    stock: 30,
    sku: "SLK001",
    weight: 0.9,
    tags: ["silk", "traditional", "cultural", "classic"],
    isActive: true,
    isFeatured: false,
    discount: 38,
    material: "Silk",
    pattern: "Traditional",
    color: "Maroon",
    occasion: "Cultural",
    fabric: "Silk",
    wash_care: "Dry Clean Only",
    silhouette: "Traditional",
    sizes: ["Free Size"],
    size_guide: [
      { size: "Free Size", bust: "All", waist: "All" }
    ]
  }
];

const connectDB = require('../config/database');

const addSampleProducts = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Add sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Added ${createdProducts.length} sample products`);
    
    // Display added products
    createdProducts.forEach(product => {
      console.log(`- ${product.name} (₹${product.price})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample products:', error);
    process.exit(1);
  }
};

addSampleProducts(); 