import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Core/services/user.service';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Injectable({
  providedIn: 'root',
})

export class LocalService {
  constructor(
    private userService: UserService,
    private layoutService: LayoutService,
    public router: Router
  ) { }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  public getData(key: string) {
    return localStorage.getItem(key);
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }
  public clearData() {
    localStorage.clear();
  }

  public GetStorge() {
    console.log('getStorage');

    var user = this.getData('currentUser');
    //var config = this.getData()

    if (user != null) {
      // var permission = this.localService.getData("currentPermission");
      this.userService.currentUser = JSON.parse(user);
      // this.userPermission.currentPermissionUser = JSON.parse(permission);
      var url = this.router.url;

      if (url == '/') {
        //this.router.navigateByUrl("admin");
      }
    } else {
      this.router.navigateByUrl('');
    }

    // language
    var lang = this.getData('lang');
    var dir = this.getData('dir');
    console.log('get Storage lang', lang, 'get Storage dir', dir);
    this.layoutService.config =
    {
      dir: dir == null ? 'en' : dir,
      lang: lang == null ? 'en' : lang

    }

  }


}
