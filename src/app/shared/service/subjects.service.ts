import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  addCustomerFormStatus$: Subject<boolean> = new Subject<boolean>();

  addRoleFormStatus$: Subject<boolean> = new Subject<boolean>();
  addUserFormStatus$: Subject<boolean> = new Subject<boolean>();

  menuStatus$: Subject<boolean> = new Subject<boolean>();
}
