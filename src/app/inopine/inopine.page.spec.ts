import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InopinePage } from './inopine.page';

describe('InopinePage', () => {
  let component: InopinePage;
  let fixture: ComponentFixture<InopinePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InopinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
