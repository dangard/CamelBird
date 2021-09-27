import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevblogCreatorComponent } from './devblog-creator.component';

describe('DevblogCreatorComponent', () => {
  let component: DevblogCreatorComponent;
  let fixture: ComponentFixture<DevblogCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevblogCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevblogCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
