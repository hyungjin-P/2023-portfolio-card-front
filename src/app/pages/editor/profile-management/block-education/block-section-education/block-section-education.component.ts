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
import {Validators} from "@angular/forms";
import {SharedInputComponent} from "../../../../../components/shared/shared-input/shared-input.component";
import { PortfolioHistoryEducation } from 'src/app/repository/entities/portfolio-history-education.entity';

@Component({
  selector: 'block-section-education',
  templateUrl: './block-section-education.component.html',
  styleUrls: ['./block-section-education.component.scss']
})
export class BlockSectionEducationComponent implements OnInit, AfterViewInit {
  @ViewChild('yearInput') yearInput!: SharedInputComponent;
  @ViewChild('educationInput') educationInput!: SharedInputComponent;

  @Input() education?: PortfolioHistoryEducation;
  @Input() isDividerActive: boolean = false;

  @Output() clickRemoveBlockSectionButtonEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateEducationInputEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateYearEmitter: EventEmitter<any> = new EventEmitter<any>();

  yearValidator = [
    Validators.required,
    Validators.maxLength(4),
    Validators.pattern('^[0-9-]*$'),
  ];

  requiredValidator = [Validators.required];

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.education){
      if (this.education.subtitles){
        this.yearInput.setFormControlValue(this.education.subtitles[0].subtitle);

        if(this.education.subtitles![0].values){
          this.educationInput.setFormControlValue(this.education.subtitles![0].values[0].value);
        }

        this.cdr.detectChanges();
      }
    }else {
      setTimeout(() => {
        this.yearInput.changeValidator(this.yearValidator);
        this.educationInput.changeValidator(this.requiredValidator);
      });
    }
  }

  clickRemoveBlockSectionButton(event: any): void {
    this.clickRemoveBlockSectionButtonEmitter.emit(event);
  }

  /** @description 타이틀 업데이트 */
  updateEducationInput(content: any): void {
    this.updateEducationInputEmitter.emit(content);
  }

  /** @description block-section-year 연도 업데이트 */
  updateYear(year: any): void {
    let isError: boolean = false;
    if(this.yearInput.formControl.getError('pattern')){
      isError = true;
    }
    this.updateYearEmitter.emit({value: year, isError: isError})
  }

  /** @description input value 초기화 */
  initValue(): void {
    this.yearInput.formControl.setValue('');
    this.educationInput.formControl.setValue('');
  }

}
