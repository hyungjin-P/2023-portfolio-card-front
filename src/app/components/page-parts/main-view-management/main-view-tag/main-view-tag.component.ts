import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PortfolioMainVisualTag} from "../../../../repository/entities/portfolio-main-visual-tag.entity";

@Component({
  selector: 'main-view-tag',
  templateUrl: './main-view-tag.component.html',
  styleUrls: ['./main-view-tag.component.scss']
})
export class MainViewTagComponent implements OnInit {

  @Input() portfolioMainVisualTags: PortfolioMainVisualTag[] = [];
  @Output() clickDeleteButton: EventEmitter<any> = new EventEmitter<any>();
  @Output() keyupEnterEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickTagButtonEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  clickTagButton(keywordInput: any): void {
    keywordInput.focus();
    if (keywordInput.value) {
      this.clickTagButtonEmitter.emit({content: keywordInput.value})
      this.resetInput(keywordInput);
    }
  }

  resetInput(keywordInput: any): void {
    keywordInput.value = '';
  }

  clearKeywordInput(keywordInput: any): void {
    this.resetInput(keywordInput);
    keywordInput.focus();
  }

  emitKeyupEnter(event: any): void {
    if (event.key === 'Enter') {
      let keywordInput = event.target
      if (keywordInput.value) {
        this.keyupEnterEmitter.emit({content: keywordInput.value});
        this.resetInput(keywordInput);
      }
    }
  }

  emitClickDeleteButton(tag: any): void {
    this.clickDeleteButton.emit(tag)
  }

  setPortfolioMainVisualTags(portfolioMainVisualTags: PortfolioMainVisualTag[]): void {
    this.portfolioMainVisualTags = portfolioMainVisualTags;
  }

  getPortfolioMainVisualTags(): PortfolioMainVisualTag[] {
    return this.portfolioMainVisualTags;
  }


}
