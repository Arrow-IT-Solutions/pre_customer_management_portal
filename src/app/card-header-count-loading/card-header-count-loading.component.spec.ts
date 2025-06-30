import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHeaderCountLoadingComponent } from './card-header-count-loading.component';

describe('CardHeaderCountLoadingComponent', () => {
  let component: CardHeaderCountLoadingComponent;
  let fixture: ComponentFixture<CardHeaderCountLoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardHeaderCountLoadingComponent]
    });
    fixture = TestBed.createComponent(CardHeaderCountLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
