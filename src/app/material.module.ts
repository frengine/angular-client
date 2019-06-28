import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatTabsModule, MatExpansionModule, MatSliderModule, MatSnackBarModule
} from '@angular/material';

const importsAndExports = [CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatSliderModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatExpansionModule,
    MatSnackBarModule
]

@NgModule({
  imports: importsAndExports,
  exports: importsAndExports,
})
export class CustomMaterialModule { }
