import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component'
import { ProductFormComponent } from './components/product-form/product-form.component'
import { ProductsComponent } from './products.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent, // /products
    children: [
      {
        path: '', // <-- Route default (/products) 
        component: ProductListComponent
      },
      {
        path: 'add', // <-- Route /products/add
        component: ProductFormComponent
      },
      {
        path: 'edit/:id', // <-- Route /products/edit/:id
        component: ProductDetailComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
