import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'orderByInterest'
})
@Injectable()
export class SortInterestPipe {
  transform(array, args){
    array.sort((a: any, b: any) => {
      if(!a['rank']) return 0;
      else if(a['rank'] < b['rank']){
        return 1;
      } else if(a['rank'] > b['rank']){
        return -1;
      } else return 0;
    });
    return array;
  }
}
