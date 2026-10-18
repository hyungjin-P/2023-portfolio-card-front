import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';

export enum AddArtworkType {
  ARTWORK = 'artwork',
  TEXT = 'text'
}

@Component({
  selector: 'add-artwork-item-buttons',
  templateUrl: './add-artwork-item-buttons.component.html',
  styleUrls: ['./add-artwork-item-buttons.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddArtworkItemButtonsComponent implements OnInit {

  AddArtworkType = AddArtworkType;

  @Output() selectedAddButtonType: EventEmitter<AddArtworkType> = new EventEmitter<AddArtworkType>();

  constructor() { }

  ngOnInit(): void {
  }

  selectedAddButtonTypeEmit(addButtonType: AddArtworkType): void {
    console.log('작품 추가 : ', addButtonType);
    this.selectedAddButtonType.emit(addButtonType);
  }

}
