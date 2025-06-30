import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {

  private _hasPermission = false;

  @Input()
  set appHasPermission(val: boolean) {
    this._hasPermission = val;
    this.updateView();
  }

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  private updateView() {
    this.viewContainer.clear();
    if (this._hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

}
