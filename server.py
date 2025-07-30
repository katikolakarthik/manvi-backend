from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class SizeGuide(BaseModel):
    size: str
    bust: str
    waist: str

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    original_price: Optional[float] = None
    category: str  # "dresses" or "sarees"
    subcategory: str  # "cotton", "silk", etc.
    material: str
    pattern: str
    color: str
    occasion: str
    sleeve_type: Optional[str] = None
    neck_type: Optional[str] = None
    length: Optional[str] = None
    fabric: str
    wash_care: str
    silhouette: str
    images: List[str]
    sizes: List[str]
    size_guide: List[SizeGuide]
    description: str
    reviews: Optional[List[dict]] = []
    rating: Optional[float] = 4.5
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    price: float
    original_price: Optional[float] = None
    category: str
    subcategory: str
    material: str
    pattern: str
    color: str
    occasion: str
    sleeve_type: Optional[str] = None
    neck_type: Optional[str] = None
    length: Optional[str] = None
    fabric: str
    wash_care: str
    silhouette: str
    images: List[str]
    sizes: List[str]
    size_guide: List[SizeGuide]
    description: str

class CartItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    quantity: int
    size: str
    added_at: datetime = Field(default_factory=datetime.utcnow)

class CartItemCreate(BaseModel):
    product_id: str
    quantity: int
    size: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "MONVI API is running"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Product endpoints
@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None, subcategory: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if subcategory:
        query["subcategory"] = subcategory
    
    products = await db.products.find(query).to_list(1000)
    return [Product(**product) for product in products]

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    product_dict = product.dict()
    product_obj = Product(**product_dict)
    await db.products.insert_one(product_obj.dict())
    return product_obj

@api_router.get("/categories")
async def get_categories():
    return {
        "dresses": ["cotton", "rayon", "organza", "georgette", "satin"],
        "sarees": ["cotton", "fancy", "banarasi", "silk", "georgette", "designer"]
    }

# Cart endpoints
@api_router.get("/cart", response_model=List[CartItem])
async def get_cart():
    cart_items = await db.cart.find().to_list(1000)
    return [CartItem(**item) for item in cart_items]

@api_router.post("/cart", response_model=CartItem)
async def add_to_cart(item: CartItemCreate):
    # Check if item already exists in cart
    existing_item = await db.cart.find_one({"product_id": item.product_id, "size": item.size})
    if existing_item:
        # Update quantity
        new_quantity = existing_item["quantity"] + item.quantity
        await db.cart.update_one(
            {"product_id": item.product_id, "size": item.size},
            {"$set": {"quantity": new_quantity}}
        )
        existing_item["quantity"] = new_quantity
        return CartItem(**existing_item)
    else:
        # Add new item
        item_dict = item.dict()
        cart_item = CartItem(**item_dict)
        await db.cart.insert_one(cart_item.dict())
        return cart_item

@api_router.delete("/cart/{item_id}")
async def remove_from_cart(item_id: str):
    result = await db.cart.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Item removed from cart"}

@api_router.put("/cart/{item_id}")
async def update_cart_item(item_id: str, quantity: int):
    result = await db.cart.update_one(
        {"id": item_id},
        {"$set": {"quantity": quantity}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Cart item updated"}

# Initialize sample data
@api_router.post("/initialize-data")
async def initialize_sample_data():
    # Clear existing data
    await db.products.delete_many({})
    
    # Sample size guide for dresses
    dress_size_guide = [
        SizeGuide(size="XS", bust="32", waist="31"),
        SizeGuide(size="S", bust="34", waist="33"),
        SizeGuide(size="M", bust="36", waist="35"),
        SizeGuide(size="L", bust="38", waist="37"),
        SizeGuide(size="XL", bust="40", waist="39"),
        SizeGuide(size="XXL", bust="42", waist="41"),
        SizeGuide(size="XXXL", bust="44", waist="43")
    ]
    
    # Sample size guide for sarees
    saree_size_guide = [
        SizeGuide(size="Free Size", bust="32-44", waist="28-44")
    ]
    
    sample_products = [
        # Dresses
        {
            "name": "Cotton Ethnic Maxi Dress",
            "price": 2499.0,
            "original_price": 3299.0,
            "category": "dresses",
            "subcategory": "cotton",
            "material": "Cotton",
            "pattern": "Embroidered",
            "color": "Red",
            "occasion": "Festive",
            "sleeve_type": "Short",
            "neck_type": "Round",
            "length": "Maxi",
            "fabric": "100% Cotton",
            "wash_care": "Machine wash cold",
            "silhouette": "A-line",
            "images": [
                "https://images.unsplash.com/photo-1668371679302-a8ec781e876e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBldGhuaWMlMjB3ZWFyfGVufDB8fHx8MTc1MzYyODA1M3ww&ixlib=rb-4.1.0&q=85",
                "https://images.unsplash.com/photo-1668371459824-094a960a227d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBldGhuaWMlMjB3ZWFyfGVufDB8fHx8MTc1MzYyODA1M3ww&ixlib=rb-4.1.0&q=85"
            ],
            "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
            "size_guide": [sg.dict() for sg in dress_size_guide],
            "description": "Beautiful cotton ethnic dress perfect for festive occasions. Features intricate embroidery and comfortable fit."
        },
        {
            "name": "Rayon Floral Print Dress",
            "price": 1899.0,
            "original_price": 2499.0,
            "category": "dresses",
            "subcategory": "rayon",
            "material": "Rayon",
            "pattern": "Floral",
            "color": "Golden",
            "occasion": "Casual",
            "sleeve_type": "Long",
            "neck_type": "V-neck",
            "length": "Midi",
            "fabric": "100% Rayon",
            "wash_care": "Hand wash only",
            "silhouette": "Fit & Flare",
            "images": [
                "https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBldGhuaWMlMjB3ZWFyfGVufDB8fHx8MTc1MzYyODA1M3ww&ixlib=rb-4.1.0&q=85",
                "https://images.pexels.com/photos/18633035/pexels-photo-18633035.png"
            ],
            "sizes": ["S", "M", "L", "XL"],
            "size_guide": [sg.dict() for sg in dress_size_guide],
            "description": "Elegant rayon dress with beautiful floral print. Perfect for casual outings and daily wear."
        },
        # Sarees
        {
            "name": "Silk Banarasi Saree",
            "price": 4999.0,
            "original_price": 6999.0,
            "category": "sarees",
            "subcategory": "silk",
            "material": "Silk",
            "pattern": "Zari Work",
            "color": "Purple",
            "occasion": "Wedding",
            "fabric": "Pure Silk",
            "wash_care": "Dry clean only",
            "silhouette": "Traditional",
            "images": [
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxzYXJlZXN8ZW58MHx8fHwxNzUzNjI4MDYxfDA&ixlib=rb-4.1.0&q=85",
                "https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwzfHxzYXJlZXN8ZW58MHx8fHwxNzUzNjI4MDYxfDA&ixlib=rb-4.1.0&q=85"
            ],
            "sizes": ["Free Size"],
            "size_guide": [sg.dict() for sg in saree_size_guide],
            "description": "Luxurious silk Banarasi saree with intricate zari work. Perfect for weddings and special occasions."
        },
        {
            "name": "Cotton Handloom Saree",
            "price": 1599.0,
            "original_price": 2299.0,
            "category": "sarees",
            "subcategory": "cotton",
            "material": "Cotton",
            "pattern": "Handloom",
            "color": "Black",
            "occasion": "Formal",
            "fabric": "Handloom Cotton",
            "wash_care": "Hand wash with mild detergent",
            "silhouette": "Traditional",
            "images": [
                "https://images.unsplash.com/photo-1679006831648-7c9ea12e5807?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxzYXJlZXN8ZW58MHx8fHwxNzUzNjI4MDYxfDA&ixlib=rb-4.1.0&q=85",
                "https://images.pexels.com/photos/8887115/pexels-photo-8887115.jpeg"
            ],
            "sizes": ["Free Size"],
            "size_guide": [sg.dict() for sg in saree_size_guide],
            "description": "Elegant cotton handloom saree perfect for formal occasions. Comfortable and stylish."
        }
    ]
    
    for product_data in sample_products:
        product = Product(**product_data)
        await db.products.insert_one(product.dict())
    
    return {"message": "Sample data initialized successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()