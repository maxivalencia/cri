import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecapitulationcontrePage } from './recapitulationcontre.page';

describe('RecapitulationcontrePage', () => {
  let component: RecapitulationcontrePage;
  let fixture: ComponentFixture<RecapitulationcontrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecapitulationcontrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
