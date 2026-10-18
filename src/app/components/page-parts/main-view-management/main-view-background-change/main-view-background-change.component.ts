import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'main-view-background-change',
  templateUrl: './main-view-background-change.component.html',
  styleUrls: ['./main-view-background-change.component.scss']
})
export class MainViewBackgroundChangeComponent implements OnInit {

  @Input() backgroundSrc: string = '';

  @Input() isUploaded: boolean = false;

  @Output() fileChange: EventEmitter<any> = new EventEmitter<FileList>();

  constructor() {
  }

  ngOnInit(): void {
    this.toggleIsUpload();
  }

  fileChangeEvent(imageFile: any): void {
    const files: FileList = imageFile.files;

    if (!imageFile && imageFile?.length === 0) {
      return;
    }

    this.fileChange.emit(files);
  }

  setBackgroundSrc(imageSrc: string): void {
    this.backgroundSrc = imageSrc;
    this.toggleIsUpload();
  }

  getBackgroundSrc(): string {
    return this.backgroundSrc;
  }

  initBackgroundSrc(): void {
    this.backgroundSrc = '';
  }


  toggleIsUpload(): void {
    this.isUploaded = this.backgroundSrc !== '';
  }

  getBackgroundStyle(): string {
    let resultStyle = '';

    if (this.backgroundSrc) {
      resultStyle = `url(${this.backgroundSrc})`;
    }

    return resultStyle;
  }
}
