import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewComponent } from './renew.component';

describe('RenewComponent', () => {
  let component: RenewComponent;
  let fixture: ComponentFixture<RenewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenewComponent]
    });
    fixture = TestBed.createComponent(RenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
