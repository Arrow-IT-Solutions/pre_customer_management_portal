import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServicesComponent } from './customer-services.component';

describe('CustomerServicesComponent', () => {
  let component: CustomerServicesComponent;
  let fixture: ComponentFixture<CustomerServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerServicesComponent]
    });
    fixture = TestBed.createComponent(CustomerServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
