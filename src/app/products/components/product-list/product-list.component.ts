import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  constructor(private productService: ProductService) { }

  // Biến cho tìm kiếm
  searchQuery: string = '';

  // Cấu hình bảng
  displayedColumns: string[] = ['image', 'name', 'unit', 'barcode', 'category', 'brand', 'price'];
  dataSource = new MatTableDataSource<Product>();

  // Khai báo biến giữ dữ liệu gốc
  products: Product[] = [];
  filteredProducts: Product[] = [];

  products$: Promise<Observable<Product[]>>;

  ngOnInit(): void {
    // Thay đổi cách gọi và xử lý dữ liệu
    this.loadProducts();
  }

  loadProducts(): void {
    try {
      const productsObservable = this.productService.getAllProducts();
      productsObservable.subscribe(products => {
        this.products = products; // Lưu data gốc
        this.filteredProducts = [...products]; // Copy để lọc
        this.dataSource.data = this.filteredProducts; // Gán cho dataSource
      });
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }


  // Xử lý tìm kiếm
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Thay đổi đơn vị
  onUnitChange(productId: string, newUnit: string): void {
    console.log(`Product ${productId} unit changed to ${newUnit}`);
    // Logic cập nhật đơn vị
    const product = this.dataSource.data.find(p => p.id === productId);
    if (product) {
      product.unit = newUnit;
      // Refresh data source
      this.dataSource.data = [...this.dataSource.data];
    }
  }

  // Xuất dữ liệu
  exportData(): void {
    console.log('Exporting product data...');
    // Logic xuất dữ liệu
  }

  // Tạo/Import dữ liệu
  importData(): void {
    console.log('Opening import dialog...');
    // Logic import dữ liệu
  }


  // Sắp xếp dữ liệu
  sortData(column: string): void {
    console.log('Sorting by column:', column);
    // Logic sắp xếp
    const data = this.dataSource.data.slice();

    data.sort((a, b) => {
      const aValue = (a as any)[column];
      const bValue = (b as any)[column];

      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue, 'vi');
      } else if (typeof aValue === 'number') {
        return aValue - bValue;
      }
      return 0;
    });

    this.dataSource.data = data;
  }

  // Thay đổi tab
  onTabChange(tab: string): void {
    console.log('Tab changed to:', tab);
    // Logic thay đổi tab
  }

  // Thay đổi danh mục
  onCategoryChange(category: string): void {
    console.log('Category changed to:', category);

    if (category === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Cập nhật dataSource sau khi lọc
    this.dataSource.data = this.filteredProducts;
  }

  // Format giá tiền VND
  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  // Track function cho ngFor performance
  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
