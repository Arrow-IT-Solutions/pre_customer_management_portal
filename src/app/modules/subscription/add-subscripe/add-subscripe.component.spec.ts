import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubscripeComponent } from './add-subscripe.component';

describe('AddSubscripeComponent', () => {
  let component: AddSubscripeComponent;
  let fixture: ComponentFixture<AddSubscripeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSubscripeComponent]
    });
    fixture = TestBed.createComponent(AddSubscripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
