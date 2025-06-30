import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCardComponent } from './view-card.component';

describe('ViewCardComponent', () => {
  let component: ViewCardComponent;
  let fixture: ComponentFixture<ViewCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCardComponent]
    });
    fixture = TestBed.createComponent(ViewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
