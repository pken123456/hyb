import { ResData } from './ResData';
import { resData1} from './ResModel';

export class ResViewModel {
  // Load data from the rankData1 of the Mock file.
  loadResDataSource1(): ResData[] {
    return resData1;
  }
  
  getRest(target:ResData): string{
    if(target) {return target.res}
  }
}
