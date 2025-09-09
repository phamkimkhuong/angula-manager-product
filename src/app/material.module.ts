import {NgModule} from '@angular/core';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CdkMenuModule} from '@angular/cdk/menu';
const materialModules = [
  MatToolbarModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatTabsModule,
  MatTableModule,
  MatPaginatorModule,
  MatCardModule,
  ScrollingModule,
  CdkMenuModule,
  MatProgressSpinnerModule
];
@NgModule({
  imports:[
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatCardModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    CdkMenuModule,
    ...materialModules
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatCardModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    CdkMenuModule,
    ...materialModules
  ]
})

export class MaterialModule { }
