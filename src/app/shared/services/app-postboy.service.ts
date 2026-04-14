import { Injectable } from '@angular/core';
import {PostboyService} from '@artstesh/postboy';

@Injectable({
  providedIn: 'root',
})
export class AppPostboyService extends PostboyService{
  constructor() {
    super();
  }
}
