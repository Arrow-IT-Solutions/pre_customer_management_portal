import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationService } from 'src/app/layout/service/applications.service';
import { ServersService } from 'src/app/layout/service/servers.service';
import { ApplicationSearchRequest } from '../../applications/application.module';
import { ServerResponse } from '../servers.module';

@Component({
  selector: 'app-server-detailes',
  templateUrl: './server-detailes.component.html',
  styleUrls: ['./server-detailes.component.scss']
})
export class ServerDetailesComponent {
loading: boolean = false;
searchFrom!:FormGroup;
dataFrom!:FormGroup;
data : ServerResponse
pageSize: number = 12;
first: number = 0;
totalRecords: number = 0;
constructor(
  public formBuilder:FormBuilder,
  public serverService: ServersService,
  public applicationService: ApplicationService
){
  this.dataFrom = this.formBuilder.group({
    PublicIP:[''],
    PrivateIP:[''],
    UserName:[''],
    Password:[''],
    URL: ['']
  })
  this.searchFrom=this.formBuilder.group({
    AppName:[''],
    port:[''],
  })

}
async ngOnInit(){
  await this.FillData();
}
OnChange(){

}
async FillData(){
if(this.serverService.SelectedData)
  this.data = this.serverService.SelectedData

    this.loading = true;
    const filter: ApplicationSearchRequest = {
      serverIDFK: this.serverService.SelectedData?.uuid,
      includeServer:"1"
    };
      

this.dataFrom.patchValue({
  PublicIP: this.serverService.SelectedData?.ipAddress ||'',
  PrivateIP: this.serverService.SelectedData?.ipAddress||'',
  UserName: this.serverService.SelectedData?.hostname || '',
  
});
this.loading = false;
}
resetSearchForm(){

}
async paginate(event: any) {
    this.pageSize = event.rows;
    this.first = event.first;
    const pageIndex = event.first / event.rows;
    
}
}
