import { Injectable } from '@angular/core';
import { customerServiceResponse } from 'src/app/modules/customer-service/customer-service.module';


@Injectable({
  providedIn: 'root'
})
export class customerServiceService {

public SelectedData: customerServiceResponse | null = null;
public Dialog: any | null = null;
}