import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GateRoutingModule } from './gate-routing.module';
import { GateComponent } from './gate/gate.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    GateComponent
  ],
  imports: [
    CommonModule,
    GateRoutingModule,
    SharedModule
  ]
})
export class GateModule { }
