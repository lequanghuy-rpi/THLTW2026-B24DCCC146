import { Product, ProductFormData, ProductStatus } from '@/models/quanlyban';

const PRODUCT_STORAGE_KEY = 'qlb_products';
const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

// Helper function to calculate product status
const getProductStatus = (quantity: number): ProductStatus => {
  if (quantity === 0) return 'Hết hàng';
  if (quantity > 10) return 'Còn hàng';
  return 'Sắp hết';
};

// Get all products from localStorage or initialize with default data
const getProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading products from localStorage:', error);
  }
  
  // Initialize with default data
  const productsWithStatus = INITIAL_PRODUCTS.map(p => ({
    ...p,
    status: getProductStatus(p.quantity),
  }));
  
  try {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(productsWithStatus));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
  
  return productsWithStatus;
};

// Save products to localStorage
const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
};

// Get all products
export const queryProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getProducts());
    }, 100);
  });
};

// Get product by ID
export const queryProductById = async (id: number): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getProducts();
      resolve(products.find(p => p.id === id) || null);
    }, 100);
  });
};

// Create new product
export const createProduct = async (data: ProductFormData): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getProducts();
      const maxId = Math.max(...products.map(p => p.id), 0);
      const newProduct: Product = {
        id: maxId + 1,
        ...data,
        status: getProductStatus(data.quantity),
      };
      products.push(newProduct);
      saveProducts(products);
      resolve(newProduct);
    }, 100);
  });
};

// Update product
export const updateProduct = async (id: number, data: ProductFormData): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = getProducts();
      const index = products.findIndex(p => p.id === id);
      
      if (index === -1) {
        reject(new Error('Product not found'));
        return;
      }
      
      const updatedProduct: Product = {
        id,
        ...data,
        status: getProductStatus(data.quantity),
      };
      
      products[index] = updatedProduct;
      saveProducts(products);
      resolve(updatedProduct);
    }, 100);
  });
};

// Delete product
export const removeProduct = async (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getProducts().filter(p => p.id !== id);
      saveProducts(products);
      resolve();
    }, 100);
  });
};

// Update product quantity
export const updateProductQuantity = async (
  id: number,
  quantityChange: number
): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = getProducts();
      const product = products.find(p => p.id === id);
      
      if (!product) {
        reject(new Error('Product not found'));
        return;
      }
      
      const newQuantity = product.quantity + quantityChange;
      if (newQuantity < 0) {
        reject(new Error('Invalid quantity'));
        return;
      }
      
      product.quantity = newQuantity;
      product.status = getProductStatus(newQuantity);
      
      saveProducts(products);
      resolve(product);
    }, 100);
  });
};

// Get distinct categories
export const queryCategories = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getProducts();
      const categories = [...new Set(products.map(p => p.category))].sort();
      resolve(categories);
    }, 100);
  });
};

// Get product statistics
export const queryProductStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getProducts();
      const stats = {
        totalProducts: products.length,
        totalInventoryValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
        outOfStock: products.filter(p => p.quantity === 0).length,
        lowStock: products.filter(p => p.quantity > 0 && p.quantity <= 10).length,
      };
      resolve(stats);
    }, 100);
  });
};
