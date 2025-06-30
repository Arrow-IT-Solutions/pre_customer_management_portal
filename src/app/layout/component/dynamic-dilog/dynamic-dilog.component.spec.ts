import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDilogComponent } from './dynamic-dilog.component';

describe('DynamicDilogComponent', () => {
  let component: DynamicDilogComponent;
  let fixture: ComponentFixture<DynamicDilogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicDilogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicDilogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
