import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataBasesComponent } from './data-bases.component';

describe('DataBasesComponent', () => {
  let component: DataBasesComponent;
  let fixture: ComponentFixture<DataBasesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataBasesComponent]
    });
    fixture = TestBed.createComponent(DataBasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
