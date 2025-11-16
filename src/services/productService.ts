import api from './api'

export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  limit: number
}

export interface ProductListParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const productService = {
  /**
   * Lấy danh sách sản phẩm
   */
  async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
    const response = await api.get<ProductListResponse>('/products', {
      params,
    })
    return response.data
  },

  /**
   * Lấy chi tiết sản phẩm
   */
  async getProductById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  },

  /**
   * Tạo sản phẩm mới (admin)
   */
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await api.post<Product>('/products', product)
    return response.data
  },

  /**
   * Cập nhật sản phẩm (admin)
   */
  async updateProduct(
    id: string,
    product: Partial<Omit<Product, 'id'>>
  ): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, product)
    return response.data
  },

  /**
   * Xóa sản phẩm (admin)
   */
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },
}

