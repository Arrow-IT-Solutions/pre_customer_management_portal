import { Injectable } from '@angular/core';
import { companyServiceResponse } from 'src/app/modules/company-service/company-service.module';


@Injectable({
  providedIn: 'root'
})
export class CompanyServiceService {

public SelectedData: companyServiceResponse | null = null;
public Dialog: any | null = null;
}
