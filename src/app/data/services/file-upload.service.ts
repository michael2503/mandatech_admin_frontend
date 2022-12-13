import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl;
  constructor(
    private http: HttpClient,
    config: ConfigService
  ) {
    this.baseUrl = config.baseUrl;
  }

  upload(fd, folder, name) {
    return this.http.post<any>(
      `${this.baseUrl}fileupload/${folder}/${name}`,
      fd, { observe: 'events', reportProgress: true }
    )
  }

  cloudUpload(fileData: any, folder: string, name: string,
    resize=0, width=0, height=0, mxWidth=0, mxHeight=0) {
    if (name === '0' || name === null || !name) {
      name = 'file-name';
    }
    fileData.append('upload_preset', 'nlrszekg');
    fileData.append('api_key', '389396244427845');
    // fileData.append('public_id', 'oziconnect');
    let uploadUrl = `${this.baseUrl}fileupload/${folder}/${name}`
    if (fileData.get('file').type.includes('image')) {
      uploadUrl = 'https://api.cloudinary.com/v1_1/mandatech-group/upload'
    }
    return this.http.post<any>(
      uploadUrl,
      fileData,
      {
        reportProgress: true,
        observe: 'events',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      }
    ).pipe();
  }
}
