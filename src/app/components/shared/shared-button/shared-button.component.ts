import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: ' shared-button',
  templateUrl: './shared-button.component.html',
  styleUrls: ['./shared-button.component.scss']
})
export class SharedButtonComponent implements OnInit {

  /** @description button disabled */
  @Input() disabled: boolean = false;

  /** @description button text */
  @Input() buttonText: string = '';

  @Output() onClickEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onClickEvent(event: any): void {
    this.onClickEmitter.emit(event);
  }
}
