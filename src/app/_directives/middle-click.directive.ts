import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({ selector: '[pxMiddleClick]' })
export class MiddleClickDirective  {
  @Output() pxMiddleClick = new EventEmitter() ;

  constructor() {}

  @HostListener('mouseup', ['$event'])
  middleclickEvent(event): void {
    if (event.which === 2) {
      this.pxMiddleClick.emit(event);
    }
  }
}
