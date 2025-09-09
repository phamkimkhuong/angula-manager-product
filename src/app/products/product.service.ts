import { Injectable } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs/internal/Observable';

export interface ImageValidationResult {
  isValid: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firebaseService: FirebaseService) { }

  // ===== VALIDATION METHODS =====

  /**
   * Clean price input - loại bỏ ký tự không phải số
   */
  cleanPriceInput(value: string): string {
    if (!value) return '';
    // Loại bỏ tất cả ký tự không phải số và dấu thập phân
    return value.toString().replace(/[^\d.]/g, '');
  }

  /**
   * Clean number input - loại bỏ ký tự không phải số
   */
  cleanNumberInput(value: string): string {
    if (!value) return '';
    // Chỉ giữ lại số
    return value.toString().replace(/[^\d]/g, '');
  }

  /**
   * Kiểm tra giá tiền hợp lệ
   */
  isValidPrice(value: string): boolean {
    if (!value) return false;
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= 0;
  }

  /**
   * Kiểm tra số hợp lệ
   */
  isValidNumber(value: string): boolean {
    if (!value) return false;
    const numValue = parseInt(value, 10);
    return !isNaN(numValue) && numValue >= 0;
  }

  /**
   * Parse price từ string sang number
   */
  parsePrice(value: string | number): number {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    const cleanValue = this.cleanPriceInput(value.toString());
    return parseFloat(cleanValue) || 0;
  }

  /**
   * Format price display
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price) + ' VND';
  }

  // ===== FILE VALIDATION =====

  /**
   * Validate image file
   */
  validateImageFile(file: File): ImageValidationResult {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return {
        isValid: false,
        message: 'Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, GIF, WebP)'
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        message: 'Kích thước file không được vượt quá 5MB'
      };
    }

    // Check image dimensions (optional)
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Check minimum dimensions
        if (img.width < 100 || img.height < 100) {
          resolve({
            isValid: false,
            message: 'Hình ảnh phải có kích thước tối thiểu 100x100 pixels'
          });
        } else {
          resolve({
            isValid: true,
            message: 'File hợp lệ'
          });
        }
      };
      img.onerror = () => {
        resolve({
          isValid: false,
          message: 'File hình ảnh không hợp lệ hoặc bị lỗi'
        });
      };
      img.src = URL.createObjectURL(file);
    }) as any;

    // For synchronous validation, just check type and size
    return {
      isValid: true,
      message: 'File hợp lệ'
    };
  }

  // ===== BARCODE GENERATION =====

  /**
   * Generate random barcode
   */
  generateBarcode(): string {
    // Generate 13-digit barcode
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const barcode = (timestamp + random).slice(-13);
    return barcode;
  }

  /**
   * Validate barcode format
   */
  isValidBarcode(barcode: string): boolean {
    // Check if barcode contains only digits and has appropriate length
    return /^\d{8,13}$/.test(barcode);
  }

  // ===== BUSINESS LOGIC =====

  /**
   * Calculate suggested prices based on import price
   */
  calculateSuggestedPrices(importPrice: number): {
    wholesalePrice: number;
    retailPrice: number;
  } {
    const wholesaleMargin = 0.2; // 20% margin
    const retailMargin = 0.4; // 40% margin

    return {
      wholesalePrice: Math.round(importPrice * (1 + wholesaleMargin)),
      retailPrice: Math.round(importPrice * (1 + retailMargin))
    };
  }

  /**
   * Validate price relationships
   */
  validatePriceRelationships(importPrice: number, wholesalePrice: number, retailPrice: number): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (wholesalePrice < importPrice) {
      errors.push('Giá bán buôn không thể thấp hơn giá nhập');
    }

    if (retailPrice < wholesalePrice) {
      errors.push('Giá bán lẻ không thể thấp hơn giá bán buôn');
    }

    if (retailPrice < importPrice) {
      errors.push('Giá bán lẻ không thể thấp hơn giá nhập');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ===== API SIMULATION =====

  /**
   * Create new product (simulate API call)
   */
  async createProduct(productData: Product): Promise<Product> {
    // Simulate API delay
    await this.delay(1000);

    // Simulate validation
    if (!productData.name) {
      throw new Error('Tên sản phẩm là bắt buộc');
    }

    if (!productData.category) {
      throw new Error('Danh mục là bắt buộc');
    }

    // Validate price relationships
    const priceValidation = this.validatePriceRelationships(
      productData.importPrice,
      productData.wholesalePrice,
      productData.retailPrice
    );

    if (!priceValidation.isValid) {
      throw new Error(priceValidation.errors.join(', '));
    }
    const createdProduct: Product = {
      id: this.generateProductId(),
      name: productData.name,
      category: productData.category,
      brand: productData.brand || '',
      location: productData.location || '',
      hasVariants: productData.hasVariants || false,
      importPrice: productData.importPrice || 0,
      unit: productData.unit || '',
      wholesalePrice: productData.wholesalePrice || 0,
      barcode: productData.barcode || this.generateBarcode(),
      retailPrice: productData.retailPrice || 0,
      stockAlert: productData.stockAlert || 0,
      allowSelling: productData.allowSelling !== undefined ? productData.allowSelling : true,
      fastSell: productData.fastSell !== undefined ? productData.fastSell : true
    };

    // Save to Firebase
    await this.firebaseService.addProduct(createdProduct as any);

    // Log for debugging
    console.log('Product created successfully:', createdProduct);

    return createdProduct;
  }

  /**
   * Update existing product (simulate API call)
   */
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    await this.delay(800);

    // Simulate update
    const updatedProduct: Product = {
      id,
      name: '',
      category: '',
      hasVariants: false,
      importPrice: 0,
      unit: '',
      wholesalePrice: 0,
      retailPrice: 0,
      stockAlert: 0,
      allowSelling: true,
      fastSell: true,
      ...productData
    };

    console.log('Product updated successfully:', updatedProduct);
    return updatedProduct;
  }

  /**
   * Get product by ID (simulate API call)
   */
  async getProductById(id: string): Promise<Product | null> {
    await this.delay(500);

    // Simulate product not found
    if (id === 'not-found') {
      return null;
    }

    // Simulate found product
    return {
      id,
      name: `Sample Product ${id}`,
      category: 'shoes',
      brand: 'Sample Brand',
      location: 'Khu A, kệ số 1',
      hasVariants: false,
      importPrice: 50000,
      unit: 'đôi',
      wholesalePrice: 60000,
      barcode: this.generateBarcode(),
      retailPrice: 75000,
      stockAlert: 10,
      allowSelling: true,
      fastSell: true
    };
  }
  /**
   * Get all products (simulate API call)
   */
  async getAllProducts(): Promise<Observable<Product[]>> {
    return this.firebaseService.getProducts();
  }

  // ===== UTILITY METHODS =====

  /**
   * Generate unique product ID
   */
  private generateProductId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PROD_${timestamp}_${random}`;
  }

  /**
   * Utility method to create delay (for API simulation)
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get available categories
   */
  getCategories(): { value: string; label: string }[] {
    return [
      { value: 'shoes', label: 'Giày dép cho bé' },
      { value: 'clothing', label: 'Quần áo trẻ em' },
      { value: 'accessories', label: 'Phụ kiện bé' },
      { value: 'toys', label: 'Đồ chơi' },
      { value: 'books', label: 'Sách trẻ em' },
      { value: 'food', label: 'Thực phẩm cho bé' },
      { value: 'sports', label: 'Đồ thể thao' },
      { value: 'electronics', label: 'Đồ điện tử' }
    ];
  }

  /**
   * Get available units
   */
  getUnits(): string[] {
    return [
      'cái', 'chiếc', 'đôi', 'bộ', 'hộp', 'chai', 'túi', 'gói',
      'kg', 'gram', 'lít', 'ml', 'mét', 'cm', 'tờ', 'cuốn'
    ];
  }

  /**
   * Format number with thousand separators
   */
  formatNumber(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value);
  }

  /**
   * Clean and validate product name
   */
  validateProductName(name: string): { isValid: boolean; message: string } {
    if (!name || name.trim().length === 0) {
      return { isValid: false, message: 'Tên sản phẩm không được để trống' };
    }

    if (name.trim().length < 3) {
      return { isValid: false, message: 'Tên sản phẩm phải có ít nhất 3 ký tự' };
    }

    if (name.length > 100) {
      return { isValid: false, message: 'Tên sản phẩm không được vượt quá 100 ký tự' };
    }

    return { isValid: true, message: 'Tên sản phẩm hợp lệ' };
  }
}