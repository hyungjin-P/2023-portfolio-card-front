import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/service/global.service';
import {StorageService} from "../../../service/storage.service";

@Component({
  selector: 'app-header-test',
  templateUrl: './header-test.component.html',
  styleUrls: ['./header-test.component.scss']
})
export class HeaderTestComponent implements OnInit {

  logoStatus: boolean = true;
  loginStatus: boolean = true;

  constructor(
    private globalService: GlobalService,
    private storageService: StorageService,

) { }

  ngOnInit(): void {
  }

  logoTest(): void {
    this.globalService.sendIsLogoSubject(this.logoStatus);
    this.logoStatus =!this.logoStatus;
  }
  profileTest(): void {
    this.globalService.sendIsLoginSubject(this.loginStatus);
    // this.loginStatus ? this.storageService.setAuthor({}) : this.storageService.removeAuthor();
    this.loginStatus = !this.loginStatus
  }

}
