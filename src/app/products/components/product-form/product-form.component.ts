import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {

    constructor(private location: Location) { }

    goBack(): void {
        this.location.back();
    }
}
