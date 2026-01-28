// Models cho Sản phẩm

export type ProductStatus = 'Còn hàng' | 'Sắp hết' | 'Hết hàng';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status?: ProductStatus;
}

export interface ProductFormData {
  id?: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface ProductFilter {
  searchText?: string;
  category?: string;
  priceRange?: [number, number];
  status?: ProductStatus;
  sortBy?: 'name' | 'price-asc' | 'price-desc' | 'quantity';
  pageNum?: number;
  pageSize?: number;
}
