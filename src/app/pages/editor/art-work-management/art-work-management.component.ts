import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {FeedbackService} from 'src/app/service/feedback.service';
import {LoadingService} from '../../../service/loading.service';
import {
  SharedConfirmDialogComponent,
  SharedConfirmDialogData
} from "../../../components/shared/shared-confirm-dialog/shared-confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {BottomSheetOptions, BottomSheetService} from "../../../service/bottom-sheet.service";
import {BottomSheetControl} from "../../../components/shared/shared-bottom-sheet/shared-bottom-sheet.component";
import {SharedInputComponent} from "../../../components/shared/shared-input/shared-input.component";
import {SharedTextareaComponent} from "../../../components/shared/shared-textarea/shared-textarea.component";
import {
  AddArtworkType
} from "../../../components/page-parts/artwork/add-artwork-item/add-artwork-item-buttons.component";
import {Author} from "../../../repository/entities/author.entity";
import {StorageService} from "../../../service/storage.service";
import {PortfolioArtworkService} from "../../../repository/api/portfolio-artwork.service";
import {PortfolioArtWorkBlock} from "../../../repository/entities/portfolio-artwork-block.entity";
import {PortfolioArtWork} from "../../../repository/entities/portfolio-artwork.entity";
import {Validators} from "@angular/forms";
import {PortfolioArtworkBlockService} from "../../../repository/api/portfolio-artwork-block.service";
import {
  ArtworkImageUploadComponent
} from "../../../components/page-parts/artwork/artwork-image-upload/artwork-image-upload.component";
import {FileService} from "../../../repository/api/file.service";
import {PortfolioArtworkBlockPictureService} from "../../../repository/api/portfolio-artwork-block-picture.service";
import { ConfirmObj } from '../../main/sign-up/sign-up.component';
import { PortfolioArtWorkBlockPicture } from 'src/app/repository/entities/portfolio-artwork-block-picture.entity';

class ArtWorkBlocks extends PortfolioArtWorkBlock{
  isOpened?: boolean;
  options?: BottomSheetOptions;
}

@Component({
  selector: 'app-art-work',
  templateUrl: './art-work-management.component.html',
  styleUrls: ['./art-work-management.component.scss']
})

export class ArtWorkManagementComponent implements OnInit {
  loginAuthor?: Author;
  requiredValidator = [Validators.required];

  /* Input Components */
  @ViewChild('artworkTitleInput') artworkTitleInput!: SharedInputComponent;
  @ViewChild('artworkTextarea') artworkTextarea!: SharedTextareaComponent;
  @ViewChild('imageUploader') imageUploader!: ArtworkImageUploadComponent;

  disableSaveButton: boolean = false;

  artWorkBlocks: ArtWorkBlocks[] = [];
  portfolioArtWork?: PortfolioArtWork;

  constructor(
    public dialog: MatDialog,
    private feedbackService: FeedbackService,
    private loadingService: LoadingService,
    private bottomSheetService: BottomSheetService,
    private storageService: StorageService,
    private fileService: FileService,
    private artworkService: PortfolioArtworkService,
    private artworkBlockService: PortfolioArtworkBlockService,
    private artworkBlockPictureService: PortfolioArtworkBlockPictureService,
  ) {
    this.loginAuthor = this.storageService.getAuthor();

    this.bottomSheetService.bottomSheetObservable().subscribe({
      next: (result: any) => {
        const block = result.bottomSheetOptions.data
        if (result.bottomSheetControl === 'delete') {
          this.deleteBlock(block);
        }
        this.toggleBottomSheetOptions(result);
      }
    });
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void{
    this.initPortfolioArtWork();
  }

  initPortfolioArtWork(){
    if(this.loginAuthor){
      this.loadingService.loadingStart();
      this.artworkService.initArtWork(this.loginAuthor?.id).subscribe({
        next: (portfolioArtWork) => {
          this.loadingService.loadingEnd();
          
          this.portfolioArtWork = portfolioArtWork;

          if(this.portfolioArtWork?.portfolioArtWorkBlocks){
            this.portfolioArtWork.portfolioArtWorkBlocks.map((block)=>{
              let artworkBlock: ArtWorkBlocks = {
                id: block.id,
                portfolioArtWorkId: block.portfolioArtWorkId,
                blockType: block.blockType,
                sortNumber: block.sortNumber,
                title: block.title,
                description: block.description,
                visibility: block.visibility,
                portfolioArtWorkPictures: block.portfolioArtWorkPictures,
                isOpened: true,
                options: {
                  activeSaveButton: false,
                  activeVisibleButton: true,
                  activeDeleteButton: true,
                  saveType: BottomSheetControl.SAVE,
                  visibleType: BottomSheetControl.VISIBLE,
                }
              }

              if (!block.visibility) artworkBlock.options!.visibleType = BottomSheetControl.NON_VISIBLE;
              
              this.artWorkBlocks.push(artworkBlock);
            })
          }
        },
        error: (err) => {
          console.log(err);
          this.feedbackService.openFeedback('포트폴리오 생성에 실패했습니다.');
          this.loadingService.loadingEnd();
        }
      })

    }
  }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.artWorkBlocks, event.previousIndex, event.currentIndex);
  }

  toggle(target: any): void {
    console.log('target : ', target)
    target.isOpened = !target.isOpened;
  }

  openBottomSheet(block: any): void {
    const bottomSheetOptions: BottomSheetOptions = {
      data: block,
      ...block.options,
    };

    this.bottomSheetService.open(bottomSheetOptions);
  }

  toggleBottomSheetOptions(option: any): void {
    this.artWorkBlocks.forEach((block) => {
      if (block === option.bottomSheetOptions.data) {
        if (block.options) {
          if (option.bottomSheetControl === BottomSheetControl.VISIBLE) {
            block.options.visibleType = BottomSheetControl.NON_VISIBLE
            this.feedbackService.openFeedback('블록이 비공개 되었습니다.');
          }

          if (option.bottomSheetControl === BottomSheetControl.NON_VISIBLE) {
            block.options.visibleType = BottomSheetControl.VISIBLE
            this.feedbackService.openFeedback('블록이 공개 되었습니다.');
          }
        }
      }
    })
  }

  /** @description block 작성 내용 취소시  dialog */
  openCancelConfirm(): void {
    const cancelDialogContent: SharedConfirmDialogData = {
      title: '삭제한 블록은 복구할 수 없어요\n' + '해당 블록을 삭제하시겠어요?',
      confirmButtonText: '삭제',
      closeButtonText: '취소',
    };

    const dialogRef = this.dialog.open(SharedConfirmDialogComponent, {
      data: cancelDialogContent,
      panelClass: 'shared-confirm-dialog',
    });

    dialogRef.afterClosed().subscribe({
      next: (action: any) => {
        if (action?.action === 'confirm') {
          this.initValue();
        }
      }
    });
  }

  /** @description block 작성 내용 초기화 */
  initValue(): void {
    this.artworkTitleInput.formControl.setValue('');
    this.artworkTextarea.formControl.setValue('');
  }

  /** @description block 작성 내용 저장 */
  save(block: any): void {
    this.loadingService.loadingStart();

    this.artworkBlockService.save(block).subscribe({
      next: (savedBlockData) => {
        this.loadingService.loadingEnd();
        this.feedbackService.openFeedback('저장되었습니다.');
      },
      error: (error) => {
        this.loadingService.loadingEnd();
        this.feedbackService.openFeedback('작품 저장에 실패하였습니다.')
      },
    });
  }

  updateTitleInput(event: any, block: any): void {
    block.title = event.value;
  }

  updateDescription(event: any, block: any): void {
    block.description = event.value;
  }

  clickAddButton(selection: AddArtworkType): void {
    if (this.artWorkBlocks.length < 11) {
      this.addBlock(selection);
    } else {
      this.feedbackService.openFeedback('등록가능한 블록 개수를 초과하였습니다.')
    }
  }

  addBlock(selection: AddArtworkType): void {
    this.loadingService.loadingStart();

    let sortNumber = 0;
    if (this.portfolioArtWork?.portfolioArtWorkBlocks){
      sortNumber = this.portfolioArtWork.portfolioArtWorkBlocks.length;
    }

    let createBlock: any = {
      portfolioArtWorkId: this.portfolioArtWork?.id,
      blockType: 'image',
      sortNumber: sortNumber,
    }

    if (selection === AddArtworkType.TEXT) {
      createBlock.blockType = 'text'
    }

    this.artworkBlockService.create(createBlock).subscribe({
      next:(block)=>{
        this.loadingService.loadingEnd();
        let newBlock: ArtWorkBlocks = {
          id: block.id,
          portfolioArtWorkId: block.portfolioArtWorkId,
          blockType: block.blockType,
          sortNumber: block.sortNumber,
          title: block.title,
          description: block.description,
          visibility: block.visibility,
          portfolioArtWorkPictures: block.portfolioArtWorkPictures,
          isOpened: true,
          options: {
            activeSaveButton: false,
            activeVisibleButton: true,
            activeDeleteButton: true,
            saveType: BottomSheetControl.SAVE,
            visibleType: BottomSheetControl.VISIBLE,
          }
        }
        this.artWorkBlocks.push(newBlock);
      },
      error:(error)=>{
        this.loadingService.loadingEnd();
        this.feedbackService.openFeedback('추가에 실패하였습니다. 다시 시도해주세요.')
      },
   });
  }



  deleteBlock(selectedBlock: any): void {
    if (this.artWorkBlocks.length > 1) {
      this.loadingService.loadingStart();
      const blockIndex = this.artWorkBlocks.indexOf(selectedBlock);
      this.artWorkBlocks.splice(blockIndex, 1);
      this.artworkBlockService.delete(selectedBlock.id).subscribe({
        next:()=>{
          this.loadingService.loadingEnd();
          this.feedbackService.openFeedback('삭제되었습니다.')
        },
        error:()=>{
          this.loadingService.loadingEnd();
          this.feedbackService.openFeedback('블록 삭제에 실패하였습니다.')
        }
      });
    } else {
      this.feedbackService.openFeedback('더이상 삭제할 수 없습니다.')
    }
  }

  async artworkImageUpload(images: FileList, block: any, artworkImageUploadComponent: ArtworkImageUploadComponent ): Promise<void> {
    this.loadingService.loadingStart();

    if (images.length === 0) return;
    if (!this.loginAuthor?.id) return;
    
    this.fileService.saveFileList({authorId: this.loginAuthor?.id}, images).subscribe({
      next: (files)=>{
        if(files.length > 0){
          files.map((file)=> {
            let setSortNum = 1;
            if (block.portfolioArtWorkPictures && block.portfolioArtWorkPictures.length >= 1){
              setSortNum = block.portfolioArtWorkPictures.length + 1;
            }

            const pictureInfo = {
              portfolioArtWorkBlockId: block.id,
              url: file.url,
              sortNumber: setSortNum,
            };
            
            this.artworkBlockPictureService.createPictures(pictureInfo).subscribe({
              next: (picture) => {
                this.loadingService.loadingEnd();
                if (setSortNum === 1){
                  block.portfolioArtWorkPictures = [];
                }
                block.portfolioArtWorkPictures.push(picture);
                artworkImageUploadComponent.setFilesItemOnPicture(block.portfolioArtWorkPictures);

                this.feedbackService.openFeedback('저장되었습니다.');
              },
              error: (error) => {
                this.loadingService.loadingEnd();
                this.feedbackService.openFeedback('이미지 저장에 실패했습니다.');
              },
            })
          });
        }
      },
      error: (error)=>{
        console.log('file save error : ', error)
        this.loadingService.loadingEnd();
      },
    });

  }

  artworkImageDeleteItem(id: string, block:any, artworkImageUploadComponent: ArtworkImageUploadComponent){
    console.log('delete id', id);
    if(block.portfolioArtWorkPictures){
      this.artworkBlockPictureService.deletePicture(id).subscribe();
      
      let pictures: PortfolioArtWorkBlockPicture[] = block.portfolioArtWorkPictures;
      pictures = pictures.filter((picture)=> picture.id !== id);
      
      artworkImageUploadComponent.setFilesItemOnPicture(pictures);
    }
  }
}
