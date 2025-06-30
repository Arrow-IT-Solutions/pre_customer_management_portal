import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/modules/application/application/application.component.spec.ts
import { FormComponent } from './application.component';
========
import { GateComponent } from './gate.component';
>>>>>>>> a1e246e41003bfaaa41e974bcdf1f715dded9f33:src/app/modules/gate/gate/gate.component.spec.ts

describe('GateComponent', () => {
  let component: GateComponent;
  let fixture: ComponentFixture<GateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GateComponent]
    });
    fixture = TestBed.createComponent(GateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
