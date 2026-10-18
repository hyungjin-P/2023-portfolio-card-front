import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'shared-checkbox',
  templateUrl: './shared-checkbox.component.html',
  styleUrls: ['./shared-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SharedCheckboxComponent implements OnInit {
  @Input() innerText: string = '';

  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  formControl = new FormControl(false, [Validators.required]);

  constructor() {}

  ngOnInit(): void {}

  checkBoxChangeEvent(event: any) {
    this.checkedChange.emit(event);
  }

  getCheckedValue(): any {
    return this.formControl.value;
  }
}
