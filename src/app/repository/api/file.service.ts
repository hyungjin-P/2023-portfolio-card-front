import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { FileEntity } from '../entities/file.entity';
import { environment } from '../../../environments/environment';
import handleError from '../../service/handle.error';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  httpHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {}

  saveFile(authorId: string, file: File): Observable<FileEntity> {
    const url = `${environment.serverAddress}/file/uploadFileOne`;

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    const formData = new FormData();
    formData.append('authorId', authorId);
    formData.append('file', file);

    return this.httpClient.post<any>(url, formData, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }

  saveFileList(saveFileDto: SaveFileDto, files: FileList): Observable<FileEntity[]> {
    const url = `${environment.serverAddress}/file/uploadFile`;

    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };

    const formData: FormData = new FormData();

    formData.append('authorId', saveFileDto?.authorId);

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    console.log('formData : ', formData);

    return this.httpClient.post<any>(url, formData, options).pipe(
      catchError((error) => {
        return handleError(error);
      }),
    );
  }
}

export class SaveFileDto {
  authorId: string = '';
}
