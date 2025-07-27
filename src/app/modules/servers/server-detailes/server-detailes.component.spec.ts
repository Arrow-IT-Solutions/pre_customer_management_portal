import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerDetailesComponent } from './server-detailes.component';

describe('ServerDetailesComponent', () => {
  let component: ServerDetailesComponent;
  let fixture: ComponentFixture<ServerDetailesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServerDetailesComponent]
    });
    fixture = TestBed.createComponent(ServerDetailesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
