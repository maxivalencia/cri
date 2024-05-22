import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContrePage } from './contre.page';

describe('ContrePage', () => {
  let component: ContrePage;
  let fixture: ComponentFixture<ContrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
