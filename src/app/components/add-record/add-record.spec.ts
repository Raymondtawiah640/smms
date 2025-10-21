import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecord } from './add-record';

describe('AddRecord', () => {
  let component: AddRecord;
  let fixture: ComponentFixture<AddRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
