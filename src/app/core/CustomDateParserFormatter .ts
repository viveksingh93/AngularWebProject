import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  override parse(value: string): NgbDateStruct | null {
    return value ? {
      // day : parseInt(value.substring(3, 5), 10),
      // month : parseInt(value.substring(0, 2), 10),
      // year : parseInt(value.substring(6, 10), 10)


      day : parseInt(value.substring(6, 10), 10),
      month : parseInt(value.substring(3, 5), 10),
      year : parseInt(value.substring(0, 2), 10)
    } : null;
  }

  override format(date: NgbDateStruct | null): string {
      // return date ?('0' + date.month).slice(-2)
      // + "-" + ('0' + date.day).slice(-2) + "-" +  date.year  : '';


      return date ?('0' + date.year).slice(-2)
      + "-" + ('0' + date.month).slice(-2) 
      + "-" +  date.day  : '';
    //return date ? `${date.day}-${date.month}-${date.year}` : '';
  }
}