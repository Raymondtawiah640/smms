import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IotPanel } from './iot-panel';

describe('IotPanel', () => {
  let component: IotPanel;
  let fixture: ComponentFixture<IotPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IotPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IotPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
