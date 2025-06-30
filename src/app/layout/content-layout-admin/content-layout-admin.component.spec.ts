import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentLayoutAdminComponent } from './content-layout-admin.component';

describe('ContentLayoutAdminComponent', () => {
  let component: ContentLayoutAdminComponent;
  let fixture: ComponentFixture<ContentLayoutAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentLayoutAdminComponent]
    });
    fixture = TestBed.createComponent(ContentLayoutAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
