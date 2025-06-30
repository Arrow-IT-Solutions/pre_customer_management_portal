import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { QRCodeDialogComponent } from './qrcode-dialog/qrcode-dialog.component';
// import { QRCodeComponent } from 'angularx-qrcode';

import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [QRCodeDialogComponent],
  imports: [
    MatDialogModule,
    MatButtonModule,
    SharedModule,
    SharedModule,
  ],
  exports: [
    QRCodeDialogComponent    // ← if other modules need to open it
  ]
})

export class QRModule { }
