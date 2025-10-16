import { Component } from '@angular/core';

@Component({
  selector: 'app-alert-model',
  templateUrl: './alert-model.component.html',
  styleUrls: ['./alert-model.component.scss']
})
export class AlertModelComponent {
   isVisible: boolean = false;

  showAlert() {
    this.isVisible = true;
  }

  closeAlert() {
    this.isVisible = false;
  }

}
