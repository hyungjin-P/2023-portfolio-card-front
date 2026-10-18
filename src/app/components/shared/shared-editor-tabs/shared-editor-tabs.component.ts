import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shared-editor-tabs',
  templateUrl: './shared-editor-tabs.component.html',
  styleUrls: ['./shared-editor-tabs.component.scss']
})
export class SharedEditorTabsComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

}
