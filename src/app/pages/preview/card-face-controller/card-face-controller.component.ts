import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export enum CardFace {
  Front = 'front',
  Back = 'back',
}

@Component({
  selector: 'portfolio-card-face-control',
  templateUrl: './card-face-controller.component.html',
  styleUrls: ['./card-face-controller.component.scss']
})
export class CardFaceControllerComponent implements OnInit {
  CardFace = CardFace;

  @Input() nowCardFace = CardFace.Front;

  @Output() changeCardFace = new EventEmitter<CardFace>();

  constructor() { }

  ngOnInit(): void {
    this.changeCardFace.emit(this.nowCardFace);
  }

  changeCardFaceData(cardFace: CardFace) {
    this.nowCardFace = cardFace;
    this.changeCardFace.emit(this.nowCardFace);
  }

  getFrontControllerStyle(): string {
    let resultStyle: string = '';

    switch (this.nowCardFace) {
      case 'front' :
        resultStyle = resultStyle + ` bright`;
        resultStyle = resultStyle + ` bg-white`;
        break;
      case 'back' :
        resultStyle = resultStyle + ` dark`;
        break;
    }

    return resultStyle;
  }

  getBackControllerStyle(): string {
    let resultStyle: string = '';

    switch (this.nowCardFace) {
      case 'front' :
        resultStyle = resultStyle + ` bright`;
        break;
      case 'back' :
        resultStyle = resultStyle + ` dark`;
        resultStyle = resultStyle + ` bg-black`;
        break;
    }

    return resultStyle;
  }

}
