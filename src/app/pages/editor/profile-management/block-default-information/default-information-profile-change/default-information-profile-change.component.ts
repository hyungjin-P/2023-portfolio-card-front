import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoadingService} from "../../../../../service/loading.service";
import {PortfolioService} from "../../../../../repository/api/portfolio.service";
import {Author} from "../../../../../repository/entities/author.entity";
import {StorageService} from "../../../../../service/storage.service";

@Component({
  selector: 'default-information-profile-change',
  templateUrl: './default-information-profile-change.component.html',
  styleUrls: ['./default-information-profile-change.component.scss']
})
export class DefaultInformationProfileChangeComponent implements OnInit {
  loginAuthor?: Author;

  @Input() generalImageUrl: string = '';

  @Input() isUploaded: boolean = false;

  @Output() fileChange: EventEmitter<any> = new EventEmitter<FileList>();

  constructor(
    private loadingService: LoadingService,
    private portfolioService: PortfolioService,
    private storageService: StorageService,
  ) {
    this.loginAuthor = this.storageService.getAuthor();
  }

  ngOnInit(): void {
  }

  fileChangeEvent(imageFile: any): void {
    const files: FileList = imageFile.files;

    if (!imageFile && imageFile?.length === 0) {
      return;
    }

    this.fileChange.emit(files);
  }

  setGeneralImageUrl(imageSrc: string): void {
    this.generalImageUrl = imageSrc;
  }

  getGeneralImageUrl(): string {
    return this.generalImageUrl;
  }

  getGeneralImageStyle(): string {
    let resultStyle = '';

    if (this.generalImageUrl) {
      resultStyle = `url(${this.generalImageUrl})`;
    }

    return resultStyle;
  }

  /** @description input value 초기화 */
  initValue(): void {
    this.generalImageUrl = '';
  }

}
