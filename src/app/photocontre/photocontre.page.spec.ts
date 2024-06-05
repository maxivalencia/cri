import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotocontrePage } from './photocontre.page';

describe('PhotocontrePage', () => {
  let component: PhotocontrePage;
  let fixture: ComponentFixture<PhotocontrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotocontrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
