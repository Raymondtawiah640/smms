import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDetailModal } from './record-detail-modal';

describe('RecordDetailModal', () => {
  let component: RecordDetailModal;
  let fixture: ComponentFixture<RecordDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordDetailModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordDetailModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
