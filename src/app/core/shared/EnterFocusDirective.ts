import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appEnterFocus]'
})
export class EnterFocusDirective {
  @Input('appEnterFocus') nextElement: HTMLElement | undefined;

  @HostListener('keydown', ['$event'])
  handleEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.nextElement) {
        this.nextElement.focus();
        
      }
    }
  }
}
