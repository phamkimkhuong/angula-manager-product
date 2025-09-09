import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ProductService } from '../../product.service';

// Interface cho Product Data
export interface ProductData {
    id?: string;
    name: string;
    category: string;
    brand?: string;
    location?: string;
    hasVariants: boolean;
    importPrice: number;
    unit: string;
    wholesalePrice: number;
    barcode?: string;
    retailPrice: number;
    stockAlert: number;
    allowSelling: boolean;
    fastSell: boolean;
    image?: string;
}

// Interface cho Category
export interface CategoryOption {
    value: string;
    label: string;
}

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    productForm!: FormGroup;
    isLoading = false;
    selectedImagePreview: string | null = null;
    selectedFile: File | null = null;

    // Categories data
    categories: CategoryOption[] = [
        { value: 'shoes', label: 'Giày dép cho bé' },
        { value: 'clothing', label: 'Quần áo trẻ em' },
        { value: 'accessories', label: 'Phụ kiện bé' },
        { value: 'toys', label: 'Đồ chơi' },
        { value: 'books', label: 'Sách trẻ em' },
        { value: 'food', label: 'Thực phẩm cho bé' }
    ];

    constructor(
        private fb: FormBuilder,
        private location: Location,
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        this.initializeForm();
        this.generateBarcode();
    }

    // Khởi tạo form với validation
    private initializeForm(): void {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            category: ['', [Validators.required]],
            brand: [''],
            location: [''],
            hasVariants: [false],
            importPrice: ['', [Validators.required, this.numberValidator]],
            unit: ['', [Validators.required]],
            wholesalePrice: ['', [Validators.required, this.numberValidator]],
            barcode: [''],
            retailPrice: ['', [Validators.required, this.numberValidator]],
            stockAlert: ['', [Validators.required, this.numberValidator]],
            allowSelling: [true],
            fastSell: [true],
            lot: [false],
        });
    }

    // Custom validator cho số
    private numberValidator(control: any) {
        const value = control.value;
        if (!value) return null;

        const numValue = parseFloat(value.toString().replace(/[^\d.]/g, ''));
        if (isNaN(numValue) || numValue < 0) {
            return { invalidNumber: true };
        }
        return null;
    }

    // Xử lý input giá tiền
    onPriceInput(event: any, fieldName: string): void {
        const value = event.target.value;
        const cleanValue = this.productService.cleanPriceInput(value);

        if (this.productService.isValidPrice(cleanValue)) {
            this.productForm.get(fieldName)?.setValue(cleanValue);
            this.productForm.get(fieldName)?.setErrors(null);
        } else {
            this.productForm.get(fieldName)?.setErrors({ invalidNumber: true });
        }
    }

    // Xử lý input số
    onNumberInput(event: any, fieldName: string): void {
        const value = event.target.value;
        const cleanValue = this.productService.cleanNumberInput(value);

        if (this.productService.isValidNumber(cleanValue)) {
            this.productForm.get(fieldName)?.setValue(cleanValue);
            this.productForm.get(fieldName)?.setErrors(null);
        } else {
            this.productForm.get(fieldName)?.setErrors({ invalidNumber: true });
        }
    }

    // Kiểm tra field có lỗi không
    isFieldInvalid(fieldName: string): boolean {
        const field = this.productForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    // Lấy error message
    getErrorMessage(fieldName: string): string {
        const field = this.productForm.get(fieldName);
        if (!field || !field.errors) return '';

        const errors = field.errors;

        // Messages cho từng field
        const errorMessages: { [key: string]: { [key: string]: string } } = {
            name: {
                required: 'Tên sản phẩm là bắt buộc',
                minlength: 'Tên sản phẩm phải có ít nhất 3 ký tự'
            },
            category: {
                required: 'Danh mục là bắt buộc'
            },
            importPrice: {
                required: 'Giá nhập là bắt buộc',
                invalidNumber: 'Giá nhập phải là số hợp lệ và lớn hơn 0'
            },
            unit: {
                required: 'Đơn vị là bắt buộc'
            },
            wholesalePrice: {
                required: 'Giá bán buôn/bán sỉ là bắt buộc',
                invalidNumber: 'Giá bán buôn/bán sỉ phải là số hợp lệ và lớn hơn 0'
            },
            retailPrice: {
                required: 'Giá bán lẻ là bắt buộc',
                invalidNumber: 'Giá bán lẻ phải là số hợp lệ và lớn hơn 0'
            },
            stockAlert: {
                required: 'Số lượng cảnh báo hết hàng là bắt buộc',
                invalidNumber: 'Số lượng cảnh báo phải là số hợp lệ và lớn hơn hoặc bằng 0'
            }
        };

        const fieldMessages = errorMessages[fieldName];
        if (fieldMessages) {
            const errorKey = Object.keys(errors)[0];
            return fieldMessages[errorKey] || 'Trường này không hợp lệ';
        }

        return 'Trường này không hợp lệ';
    }

    // Trigger file upload
    triggerFileUpload(): void {
        this.fileInput.nativeElement.click();
    }

    // Xử lý chọn hình ảnh
    onImageSelect(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        // Validate file
        const validation = this.productService.validateImageFile(file);
        if (!validation.isValid) {
            alert(validation.message);
            return;
        }

        this.selectedFile = file;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.selectedImagePreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }

    // Generate barcode
    generateBarcode(): void {
        const barcode = this.productService.generateBarcode();
        this.productForm.patchValue({ barcode });
    }

    // Mở dialog thêm đơn vị
    openAddUnitDialog(): void {
        const newUnit = prompt('Nhập đơn vị mới:');
        if (newUnit && newUnit.trim()) {
            const trimmedUnit = newUnit.trim();
            this.productForm.patchValue({ unit: trimmedUnit });
        }
    }

    // Lưu sản phẩm
    async onSave(): Promise<void> {
        // Mark all fields as touched để hiển thị validation errors
        this.markAllFieldsAsTouched();

        if (this.productForm.invalid) {
            this.scrollToFirstError();
            return;
        }

        this.isLoading = true;

        try {
            const formData = this.prepareFormData();
            await this.productService.createProduct(formData);

            // Thành công - quay về danh sách
            alert('Sản phẩm đã được tạo thành công!');
            this.location.back();
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại.');
        } finally {
            this.isLoading = false;
        }
    }

    // Chuẩn bị dữ liệu form
    private prepareFormData(): ProductData {
        const formValue = this.productForm.value;

        return {
            name: formValue.name,
            category: formValue.category,
            brand: formValue.brand || '',
            location: formValue.location || '',
            hasVariants: formValue.hasVariants,
            importPrice: this.productService.parsePrice(formValue.importPrice),
            unit: formValue.unit,
            wholesalePrice: this.productService.parsePrice(formValue.wholesalePrice),
            barcode: formValue.barcode || '',
            retailPrice: this.productService.parsePrice(formValue.retailPrice),
            stockAlert: parseInt(formValue.stockAlert) || 0,
            allowSelling: formValue.allowSelling,
            fastSell: formValue.fastSell,
            image: this.selectedImagePreview || ''
        };
    }

    // Mark all fields as touched
    private markAllFieldsAsTouched(): void {
        Object.keys(this.productForm.controls).forEach(key => {
            const control = this.productForm.get(key);
            control?.markAsTouched();
        });
    }

    // Scroll to first error
    private scrollToFirstError(): void {
        setTimeout(() => {
            const firstErrorElement = document.querySelector('.mat-form-field-invalid input, .mat-form-field-invalid mat-select');
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                (firstErrorElement as HTMLElement).focus();
            }
        }, 100);
    }

    // Quay lại trang trước
    goBack(): void {
        if (this.productForm.dirty) {
            const confirmLeave = confirm('Bạn có những thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi trang này?');
            if (!confirmLeave) return;
        }

        this.location.back();
    }
}