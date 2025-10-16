import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewsComponent } from './renews.component';

describe('RenewsComponent', () => {
  let component: RenewsComponent;
  let fixture: ComponentFixture<RenewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenewsComponent]
    });
    fixture = TestBed.createComponent(RenewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
