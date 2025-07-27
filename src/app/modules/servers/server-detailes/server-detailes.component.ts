import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-server-detailes',
  templateUrl: './server-detailes.component.html',
  styleUrls: ['./server-detailes.component.scss']
})
export class ServerDetailesComponent {
loading: boolean = false;
searchFrom!:FormGroup;
pageSize: number = 12;
first: number = 0;
totalRecords: number = 0;
constructor(public formBuilder:FormBuilder){
  this.searchFrom=this.formBuilder.group({
    AppName:[''],
    port:[''],
  })

}
OnChange(){

}
resetSearchForm(){

}
async paginate(event: any) {
    this.pageSize = event.rows;
    this.first = event.first;
    const pageIndex = event.first / event.rows;
    
}
}
