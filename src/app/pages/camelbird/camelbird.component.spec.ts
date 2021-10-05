import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamelbirdComponent } from './camelbird.component';

describe('CamelbirdComponent', () => {
  let component: CamelbirdComponent;
  let fixture: ComponentFixture<CamelbirdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamelbirdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamelbirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
