import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineAddAgentComponent } from './inline-add-agent.component';

describe('InlineAddAgentComponent', () => {
  let component: InlineAddAgentComponent;
  let fixture: ComponentFixture<InlineAddAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InlineAddAgentComponent]
    });
    fixture = TestBed.createComponent(InlineAddAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
