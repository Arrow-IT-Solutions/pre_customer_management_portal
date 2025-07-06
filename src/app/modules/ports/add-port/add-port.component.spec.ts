import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPortComponent } from './add-port.component';

describe('AddPortComponent', () => {
  let component: AddPortComponent;
  let fixture: ComponentFixture<AddPortComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPortComponent]
    });
    fixture = TestBed.createComponent(AddPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
