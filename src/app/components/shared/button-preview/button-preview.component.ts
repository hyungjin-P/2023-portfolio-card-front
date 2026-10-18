import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'shared-button-preview',
  templateUrl: './button-preview.component.html',
  styleUrls: ['./button-preview.component.scss']
})
export class ButtonPreviewComponent implements OnInit {

  @Output() buttonPreviewEmitter = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  emitButtonPreview(event: any): void {
    this.buttonPreviewEmitter.emit({ ...event });
  }
}
