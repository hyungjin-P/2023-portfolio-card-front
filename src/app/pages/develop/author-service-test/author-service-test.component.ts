import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthorService} from "../../../repository/api/author.service";
import {PortfolioMainVisualService} from "../../../repository/api/portfolio-main-visual.service";
import {PortfolioMainVisualThemeService} from "../../../repository/api/portfolio-main-visual-theme.service";
import {PortfolioMainVisualTagService} from "../../../repository/api/portfolio-main-visual-tag.service";

@Component({
  selector: 'app-author-service-test',
  styleUrls: ['./author-service-test.component.scss'],
  template: `
    <h2>Author Service Test</h2>
    <button type="button" (click)="createTempAuthorTest()">createTempAuthorTest</button>
    <button type="button" (click)="authorJoinTest()">authorJoinTest</button>

    <h2>Portfolio Main Visual Service Test</h2>
    <button type="button" (click)="ptCreate()">ptCreateTest</button>
    <button type="button" (click)="getAllPortfolioTest()">getAllPortfolioTest</button>
    <button type="button" (click)="findOneTest()">findOneTest</button>

    <h2>Portfolio Main Visual Theme Service Test</h2>
    <button type="button" (click)="removeTheme()">removeTheme</button>
    <button type="button" (click)="createTheme()">createTheme</button>
    <button type="button" (click)="getOneByRecentlyTest()">getOneByRecentlyTest</button>
    <button type="button" (click)="modifyTheme()">modifyTheme</button>
    <button type="button" (click)="getAllTheme()">getAllTheme</button>

    <h2>Portfolio Main Visual Tag Service Test</h2>
    <button type="button" (click)="createTag()">createTag</button>
    <button type="button" (click)="removeTag()">removeTag</button>

  `
})
export class AuthorServiceTestComponent implements OnInit, AfterViewInit {

  constructor(
    private authorService: AuthorService,
    private portfolioMainVisualService: PortfolioMainVisualService,
    private portfolioMainVisualThemeService: PortfolioMainVisualThemeService,
    private portfolioMainVisualTagService: PortfolioMainVisualTagService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  //Author Service Test
  createTempAuthorTest(): void {
    this.authorService.createTempAuthor({authorLink: 'yuni', provider: 'crackit.com'}).subscribe({
      next: (author) => {
        console.log('createTempAuthor : ', author);
      }
    });
  }

  authorJoinTest(): void {
    this.authorService.joinAuthor({
      id: 'c02b7a5a-901e-4b07-be34-d87c40f92c18',
      authorLink: 'yuni',
      serviceTerm: true,
      email: 'asdasd',
      password: 'REDACTED_TEST_PASSWORD'
    })
      .subscribe({
        next: (author) => {
          console.log('authorJoinTest : ', author);
        },
        error: (e) => {
          console.error('authorJoinTest() : ', e);
        }
      });
  }

  // Portfolio Main Visual Service Test
  ptCreate(): void {
    this.portfolioMainVisualService.create({
      "portfolioId": "6ae6d61e-4462-4412-9ecd-394b24575795",
      "name": "PORTFOLIO",
      "mainVisualUrl": "https://REDACTED_EXAMPLE_IMAGE_URL",
      "nickName": "NICKNAME",
      "subTitle": "sub title sub title"
    }).subscribe({
      next: (pt) => {
        console.log('pt : ', pt);
      },
      error: (ee) => {
        console.error(ee);
      }
    })
  }

  getAllPortfolioTest() {
    this.portfolioMainVisualService.getAll().subscribe({
      next: (pt) => {
        console.log('pt : ', pt);
      },
      error: (ee) => {
        console.error(ee);
      }
    })
  }

  findOneTest() {
    this.portfolioMainVisualService.findOne('6ae6d61e-4462-4412-9ecd-394b24575795').subscribe({
      next: (pt) => {
        console.log('pt : ', pt);
      },
      error: (ee) => {
        console.error(ee);
      }
    })
  }

  // Portfolio Main Visual Theme Service Test
  createTheme(): void {
    this.portfolioMainVisualThemeService.create({
      "portfolioMainVisualId": "afe301c5-288c-4323-90b5-87f7cfd10ad6",
      "controllerClass": "angulate",
      "shareButtonClass": "angulate",
      "titleClass": "angulate",
      "subTitleClass": "angulate",
      "tagClass": "angulate"
    }).subscribe({
      next: (pt) => {
        console.log('pt : ', pt);
      },
      error: (ee) => {
        console.error(ee);
      }
    })
  }

  getAllTheme() {
    this.portfolioMainVisualThemeService.getAll().subscribe({
      next: (pt) => {
        console.log('pt : ', pt);
      },
      error: (ee) => {
        console.error(ee);
      }
    })
  }

  getOneByRecentlyTest() {
    this.portfolioMainVisualThemeService.getOneByRecently('6ae6d61e-4462-4412-9ecd-394b24575795').subscribe({
      next: (pt) => {
        console.log('pt : ', pt);
      },
      error: (ee) => {
        console.error(ee);
      }
    })
  }

  modifyTheme(): void {
    this.portfolioMainVisualThemeService
      .modify({
        "portfolioMainVisualId": "afe301c5-288c-4323-90b5-87f7cfd10ad6",
        "controllerClass": "ㅁㄴㅇㅁㄴㅇ",
        "shareButtonClass": "ㅁㄴㅇㅁㄴㅇ",
        "titleClass": "ㅁㄴㅇㅁㄴㅇe",
        "subTitleClass": "ㅀㅇㅀㅇㅀ",
        "tagClass": "ㅁㄴㅇㅁㄴㅇ"
      }).subscribe({
      next: (pt) => {
        console.log('pt : ', pt);
      },
      error: (ee) => {
        console.error(ee);
      }
    })
  }

  removeTheme(): void {
    this.portfolioMainVisualThemeService
      .remove("3167dbc3-1eba-4cc9-9190-a401ff4ed422").subscribe({
      next: (pt) => {
        console.log('pt : ', pt);
      },
      error: (ee) => {
        console.error(ee);
      }
    })
  }

  // Portfolio Main Visual Tag Service Test
  createTag(): void {
    this.portfolioMainVisualTagService.create({
      "portfolioMainVisualId": "afe301c5-288c-4323-90b5-87f7cfd10ad6",
      "content": "asdlkjalasd"
    }).subscribe({
      next: (pt) => {
        console.log('pt : ', pt);
      },
      error: (ee) => {
        console.error(ee);
      }
    })
  }

  removeTag(): void {
    this.portfolioMainVisualThemeService
      .remove("afe301c5-288c-4323-90b5-87f7cfd10ad6").subscribe({
      next: (pt) => {
        console.log('pt : ', pt);
      },
      error: (ee) => {
        console.error(ee);
      }
    })
  }


}
