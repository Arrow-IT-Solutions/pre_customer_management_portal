import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSettingComponent } from './add-setting.component';

describe('AddSettingComponent', () => {
  let component: AddSettingComponent;
  let fixture: ComponentFixture<AddSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSettingComponent]
    });
    fixture = TestBed.createComponent(AddSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
