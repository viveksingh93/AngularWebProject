import { Directive } from '@angular/core';
import {
  AfterViewInit,
  ElementRef,
  NgZone,
  EventEmitter,
  Output,
} from '@angular/core';
declare var $: any

@Directive({
  selector: '[appDatepicker]',
  exportAs:'datepicker'
})
export class DatepickerDirective {

  mydate: any;
  @Output() dateEventEmitter = new EventEmitter();
  constructor(private el: ElementRef, private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      $(this.el.nativeElement).datepicker({
        onselect: (date: any) => {
          this.ngZone.run(() => {
            this.setDate(date);
          })
          console.log(date)
        }
      });
    });

  }
  setDate(date: any) {
    this.mydate = date;
    this.dateEventEmitter.emit(this.mydate);
  }
}
