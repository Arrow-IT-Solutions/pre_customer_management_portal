import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgControlComponent } from './img-control.component';

describe('ImgControlComponent', () => {
  let component: ImgControlComponent;
  let fixture: ComponentFixture<ImgControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImgControlComponent]
    });
    fixture = TestBed.createComponent(ImgControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
