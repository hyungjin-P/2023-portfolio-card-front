import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {SharedInputComponent} from "../shared-input/shared-input.component";
import {MatDialog} from "@angular/material/dialog";
import {Validators} from "@angular/forms";
import {FeedbackService} from "../../../service/feedback.service";

@Component({
  selector: 'shared-block-section',
  templateUrl: './shared-block-section.component.html',
  styleUrls: ['./shared-block-section.component.scss']
})
export class SharedBlockSectionComponent implements OnInit, AfterViewInit {

  @ViewChild('titleInput') titleInput!: SharedInputComponent;

  @Input() title: string = '';
  @Input() blockSectionSubtitle: any[] | undefined = [
    {
      id: '1',
      subtitle: '',
      values: [
        {
          id: '1',
          value: '',
        }
      ]
    }
  ];
  @Input() label: string = '';
  @Input() titlePlaceholder: string = '';
  @Input() subtitlePlaceholder: string = '';
  @Input() valuePlaceholder: string = '';
  @Input() isTitleInput: boolean = true;
  @Input() isSubtitleLabel: boolean = true;

  @Output() clickRemoveBlockSectionButtonEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateTitleInputEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateSubtitleEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateValueEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeSubtitleEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeValueEmitter: EventEmitter<any> = new EventEmitter<any>();

  requiredValidator = [Validators.required];

  @Input() isDividerActive: boolean = false;

  constructor(
    public dialog: MatDialog,
    private feedbackService: FeedbackService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.blockSectionSubtitle?.length === 0){
      this.addSubtitle();
    }

    if (this.isTitleInput){
      if (this.title !== ''){
        this.titleInput.setFormControlValue(this.title);
        this.cdr.detectChanges();
      }else {
        setTimeout(() => {
          this.titleInput?.changeValidator(this.requiredValidator);
        });
      }
    }
  }

  setValue(content: any): void {
    console.log('content', content)
  }

  /** @description BlockSection 삭제 버튼 event emitter */
  clickRemoveBlockSectionButton(event: any): void {
    this.clickRemoveBlockSectionButtonEmitter.emit(event);
  }

  /** @description 연도 추가 */
  addSubtitle(): void {
    this.blockSectionSubtitle = this.blockSectionSubtitle as any[];

    const subtitle = {
      id: `${this.blockSectionSubtitle.length + 1}`,
      subtitle: '',
      values: [
        {
          id: '1',
          value: '',
        }
      ]
    }

    this.blockSectionSubtitle.push(subtitle)
  }

  /** @description 연도 삭제 */
  removeSubtitle(subtitle: any): void {
    this.blockSectionSubtitle = this.blockSectionSubtitle as any[];

    if (this.blockSectionSubtitle.length > 1) {
      const index = this.blockSectionSubtitle.indexOf(subtitle);
      this.blockSectionSubtitle.splice(index, 1);

      this.removeSubtitleEmitter.emit(subtitle);
    }else{
      this.feedbackService.openFeedback('더 이상 삭제할 수 없습니다.')
    }
  }

  /** @description 연도의 내용 추가 업데이트 */
  addValue(content: any, subtitle: any): void {
    subtitle.values = content
  }

  /** @description 연도의 내용 삭제 업데이트 */
  removeValue(content: any, subtitle: any): void {
    this.removeValueEmitter.emit(content);
  }

  /** @description 연도 블록 구분선 유무 식별 */
  activeLine(subtitle: any): boolean {
    this.blockSectionSubtitle = this.blockSectionSubtitle as any[];

    return this.blockSectionSubtitle.indexOf(subtitle) + 1 !== this.blockSectionSubtitle.length
  }

  /** @description 타이틀 업데이트 */
  updateTitleInput(event: any): void {
    this.updateTitleInputEmitter.emit(event);
  }

  /** @description block-section-subtitle 연도 업데이트 */
  updateSubtitle(content: any, subtitle: any): void {
    subtitle.subtitle = content;
    this.updateSubtitleEmitter.emit(this.blockSectionSubtitle)
  }

  /** @description block-section-subtitle 연도 내용 업데이트 */
  updateValue(content: any, subtitle: any): void {
    subtitle.values = content
    this.updateSubtitleEmitter.emit(this.blockSectionSubtitle)
  }


}
