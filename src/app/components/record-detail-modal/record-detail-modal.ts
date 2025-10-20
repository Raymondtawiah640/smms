import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-record-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-detail-modal.html',
  styleUrls: ['./record-detail-modal.css']
})
export class RecordDetailModal {
  @Input() record: any;
  @Input() visible = false;

  closeModal() {
    this.visible = false;
  }
}
