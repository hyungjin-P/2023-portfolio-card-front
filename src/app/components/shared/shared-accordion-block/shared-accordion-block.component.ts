import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'shared-accordion-block',
  templateUrl: './shared-accordion-block.component.html',
  styleUrls: ['./shared-accordion-block.component.scss']
})
export class SharedAccordionBlockComponent implements OnInit {

  /** @description 블록의 타이틀 설정 */
  @Input() blockTitle: string = '블록 타이틀';

  /** @description 블록의 열림과 닫힘 여부 */
  @Input() isBlockOpen: boolean = false;

  /** @description 블록의 공개와 비공개 여부 */
  @Input() isBlockPublic: boolean = true;

  /** @description 블록의 공개와 비공개 버튼의 유무 여부 */
  @Input() isPublicButton: boolean = true;

  /** @description 블록의 하위컴포넌트 설정 */
  @Input() innerComponent: any = '하위 컴포넌트를 설정하세요';

  /** @description 블록 타이틀 클릭 시 발생하는 이벤트 방출 */
  @Output() clickOpenButtonEmitter: EventEmitter<any> = new EventEmitter<any>();

  /** @description 블록 공개 버튼 클릭 시 발생하는 이벤트 방출 */
  @Output() clickPublicButtonEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  clickPublicButton(event: any): void {
    this.clickPublicButtonEmitter.emit(event)
  }

  clickOpenButton(event: any): void {
    this.clickOpenButtonEmitter.emit(event)
  }

}
