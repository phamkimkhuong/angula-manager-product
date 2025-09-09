import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productData: Product | null = null; // Dùng model Product để có kiểu dữ liệu rõ ràng
  isLoading = true; // Thêm biến cờ để quản lý trạng thái loading
  isEditMode = false; // Biến để quản lý chế độ chỉnh sửa

  constructor(
    private route: ActivatedRoute, // Inject ActivatedRoute để lấy tham số từ URL
    private productService: ProductService, // Inject ProductService để gọi API
    private router: Router // Inject Router để điều hướng
  ) { }

  /**
   * Khởi tạo component và tải dữ liệu sản phẩm
   * @return void
   */
  ngOnInit(): void {
    this.loadProductData();
  }
  /**
   * Tải dữ liệu sản phẩm từ API dựa trên ID lấy từ URL
   * @returns void
   */
  async loadProductData(): Promise<void> {
    // 1. Lấy 'id' từ URL snapshot
    const productId = this.route.snapshot.paramMap.get('id');

    if (!productId) {
      console.error('Product ID not found in URL!');
      this.isLoading = false;
      // Nếu không có ID, quay về trang danh sách
      this.router.navigate(['/products']);
      return;
    }

    // 2. Gọi service để lấy dữ liệu sản phẩm bằng ID
    try {
      this.productData = await this.productService.getProductById(productId);
      console.log('Fetched product data:', this.productData);
    } catch (error) {
      console.error('Error fetching product details:', error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo)
    } finally {
      this.isLoading = false; // Dừng trạng thái loading dù thành công hay thất bại
    }
  }
  /**
   * Xóa sản phẩm hiện tại
   * @return void
   */
  async deleteProduct(): Promise<void> {
    // Kiểm tra để chắc chắn có dữ liệu sản phẩm và ID
    if (!this.productData || !this.productData.id) {
      alert('Không tìm thấy thông tin sản phẩm để xóa.');
      return;
    }

    const confirmed = confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${this.productData.name}"? Hành động này không thể hoàn tác.`);

    if (confirmed) {
      this.isLoading = true;
      try {
        await this.productService.deleteProduct(this.productData.id);
        alert('Xóa sản phẩm thành công!');
        this.router.navigate(['/products']); // Quay về trang danh sách sau khi xóa
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm.');
        this.isLoading = false;
      }
    }
  }
  /**
   * Bật/tắt chế độ chỉnh sửa
   * @return void
   */
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }
  /**
   * Lưu các thay đổi sau khi chỉnh sửa
   * @return void
   */
  async saveChanges(): Promise<void> {
    // Logic 
    console.log('Saving changes...');
    // Sau khi lưu thành công, quay về chế độ xem
    this.toggleEditMode();
  }
  /**
   * Hủy chỉnh sửa và quay lại trạng thái ban đầu
   * @return void
   */
  cancelEdit(): void {
    if (this.productData) {
      // Logic để reset form
    }
    this.toggleEditMode();
  }
}