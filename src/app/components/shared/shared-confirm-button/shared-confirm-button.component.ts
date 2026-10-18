 import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'shared-confirm-button',
  templateUrl: './shared-confirm-button.component.html',
  styleUrls: ['./shared-confirm-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SharedConfirmButtonComponent implements OnInit {
  @Input() iconPath: string = '';

  @Input() content: string = '';

  @Input() customClass: string = '';

  @Output() buttonClick = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  buttonClickEmit(event: any): void {
    this.buttonClick.emit({ ...event });
  }
}
