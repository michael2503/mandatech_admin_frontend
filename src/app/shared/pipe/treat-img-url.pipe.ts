import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from 'src/app/data/services/config.service';

@Pipe({
  name: 'treatImgUrl'
})
export class TreatImgUrlPipe implements PipeTransform {
  private baseUrl;
  constructor(
    private config: ConfigService,
  ) { 
    this.baseUrl = config.baseUrl;
  }

  transform(value: any): any {
    if (!value || typeof value != 'string' || !value.match(/^http/)) return value;
    let imgIp = value.split('//')[1].split('/')[0];
    let baseIp = this.baseUrl.split('//')[1].split('/')[0];
    return imgIp.match(/\d+\.\d+\.\d+\.\d+(:\d+)?/) || imgIp.match(/localhost(:\d+)?/) ? value.replace(imgIp, baseIp) : imgIp;
  }

}
