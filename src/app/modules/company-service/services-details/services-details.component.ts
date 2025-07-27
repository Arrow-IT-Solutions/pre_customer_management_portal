import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-services-details',
  templateUrl: './services-details.component.html',
  styleUrls: ['./services-details.component.scss']
})
export class ServicesDetailsComponent {
loading: boolean = false;
searchFrom!:FormGroup;
pageSize: number = 12;
first: number = 0;
totalRecords: number = 0;
constructor(public formBuilder:FormBuilder){
  this.searchFrom=this.formBuilder.group({
    EnvName:[''],
    server:[''],
    dbName:['']
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
