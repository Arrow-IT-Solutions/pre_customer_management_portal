import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantsComponent } from './variants.component';

describe('VariantsComponent', () => {
  let component: VariantsComponent;
  let fixture: ComponentFixture<VariantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VariantsComponent]
    });
    fixture = TestBed.createComponent(VariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
