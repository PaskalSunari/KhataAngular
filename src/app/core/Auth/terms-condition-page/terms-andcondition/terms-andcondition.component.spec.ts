import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndconditionComponent } from './terms-andcondition.component';

describe('TermsAndconditionComponent', () => {
  let component: TermsAndconditionComponent;
  let fixture: ComponentFixture<TermsAndconditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermsAndconditionComponent]
    });
    fixture = TestBed.createComponent(TermsAndconditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
