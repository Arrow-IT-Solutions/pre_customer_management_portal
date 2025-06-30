import { Directive, ElementRef, HostListener, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDisableElement]'
})
export class DisableElementDirective implements OnChanges {

  @Input() appDisableElement: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    const nativeElement = this.el.nativeElement;
    if (nativeElement instanceof HTMLElement) {
      if (this.appDisableElement) {
        this.renderer.setAttribute(nativeElement, 'disabled', 'true');
        this.renderer.setAttribute(nativeElement, 'data-disabled', 'true');
        this.renderer.setStyle(nativeElement, 'pointer-events', 'none');
        this.renderer.setStyle(nativeElement, 'opacity', '0.6');
      } else {
        this.renderer.removeAttribute(nativeElement, 'disabled');
        this.renderer.removeAttribute(nativeElement, 'data-disabled');
        this.renderer.setStyle(nativeElement, 'pointer-events', 'auto');
        this.renderer.setStyle(nativeElement, 'opacity', '1');
      }
    } else {
      console.error('The directive can only be used on HTML elements');
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    console.log("gggg");
    console.log("check : ",this.el.nativeElement.getAttribute('data-disabled'));
    var isExist = this.el.nativeElement.getAttribute('data-disabled');
    if (this.el.nativeElement.getAttribute('data-disabled') === 'true' && isExist == null && isExist == undefined ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

}
