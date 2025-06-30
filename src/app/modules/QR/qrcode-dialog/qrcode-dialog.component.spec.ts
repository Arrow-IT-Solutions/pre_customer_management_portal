import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRCodeDialogComponent } from './qrcode-dialog.component';

describe('QRCodeDialogComponent', () => {
  let component: QRCodeDialogComponent;
  let fixture: ComponentFixture<QRCodeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QRCodeDialogComponent]
    });
    fixture = TestBed.createComponent(QRCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
