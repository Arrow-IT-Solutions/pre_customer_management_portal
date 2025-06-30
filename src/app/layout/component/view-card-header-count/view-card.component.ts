import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-view-card-header-count',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.scss']
})
export class ViewCardComponent {

  @Input() cardName:string="card Name";
  @Input() cardValue:string="0" || undefined;
  @Input() cardIcon:string="material-symbols-outlined";
  @Input() cardloading:boolean = true;


  constructor()
  {

    // this.cardIcon = "card__titleIconRow " + this.cardIcon

  }


}
