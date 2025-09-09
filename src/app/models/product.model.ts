export class Product {
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
    price?: number;
    stockAlert: number;
    allowSelling: boolean;
    fastSell: boolean;
    image?: string;
}