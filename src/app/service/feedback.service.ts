import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

export class SnackBarServiceOptions {
  duration?: number = 3000;
  closeButton?: string = '';
  panelClass?: string = 'snackbar-primary';
  position?: string = 'bottom';
  horizontalPosition?: MatSnackBarHorizontalPosition  = 'center';
  verticalPosition?: MatSnackBarVerticalPosition  = 'top';
}

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  defaultOptions: SnackBarServiceOptions = new SnackBarServiceOptions();

  constructor(private snackBar: MatSnackBar) {}

  openFeedback(message: string, options?: SnackBarServiceOptions): void {
    this.snackBar.open(
      message,
      `${
        options?.closeButton
          ? options.closeButton
          : this.defaultOptions.closeButton
      }`,
      {
        duration: options?.duration
          ? options?.duration
          : this.defaultOptions.duration,
        panelClass: options?.panelClass
          ? options.panelClass
          : this.defaultOptions.panelClass,
        horizontalPosition: options?.horizontalPosition
          ? options?.horizontalPosition
          : this.defaultOptions.horizontalPosition,
        verticalPosition: options?.verticalPosition
          ? options?.verticalPosition
          : this.defaultOptions.verticalPosition,
      },
    );
  }
}
