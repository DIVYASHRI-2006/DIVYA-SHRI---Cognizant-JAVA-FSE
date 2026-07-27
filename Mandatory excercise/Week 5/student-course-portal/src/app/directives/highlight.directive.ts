import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {

  constructor(private element: ElementRef) {}

  @HostListener('mouseenter')
  mouseEnter() {
    this.highlight('lightblue');
  }

  @HostListener('mouseleave')
  mouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.element.nativeElement.style.backgroundColor = color;
  }

}