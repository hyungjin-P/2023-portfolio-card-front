import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackService } from './feedback.service';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogServiceService {
  constructor(
    public dialog: MatDialog,
    private feedbackService: FeedbackService,
  ) {}

  openConfirmDialog(): void {}
}
