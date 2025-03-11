import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AggregationService {


  result: any[] = [];

  setData(response: any) {
    this.result = response
  }

  getData() {
    return this.result
  }

  clearData() {
    return this.result = []
  }
}

