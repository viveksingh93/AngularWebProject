import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[NumberOnly]'
})
export class StrictNumberOnlyDirective {
	
  //private regex: RegExp = new RegExp('^[0-9]*$');
  private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);  //Decimal Number
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private elementRef: ElementRef) { }


  /**
   * Key board action
   * @param event 
   */
  @HostListener('keydown', ['$event'])onKeyDown(event: KeyboardEvent) {
    
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const inputValue: string = this.elementRef.nativeElement.value.concat(event.key);
    console.log(event.key);
    if (inputValue && !String(inputValue).match(this.regex)) {
      event.preventDefault();
    }

    return;
  }

  /**
   * Copy Paste action 
   * @param event 
   */
  @HostListener('paste', ['$event']) onPaste(event: { originalEvent: any; preventDefault: () => void; }) {
      const clipboardData = (event.originalEvent || event).clipboardData.getData('text/plain');
      if (clipboardData) {
          const regEx = new RegExp('^[0-9]*$');
          if(!regEx.test(clipboardData)) {
              event.preventDefault();
          }
      }
      return;
  }
}