import { Pipe, PipeTransform } from '@angular/core';
import { BanksService } from 'src/app/data/localData/banks.service';

@Pipe({
  name: 'bank'
})
export class BankPipe implements PipeTransform {
  constructor(
    private banksS: BanksService
  ) { }

  transform(code: any, o = 'name'): unknown {
    console.log(code);
    return this.banksS.banks.find(each => each.code == code)[o];
  }

}
