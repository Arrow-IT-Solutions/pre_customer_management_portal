import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { LocalService } from 'src/app/shared/service/local.service';
import Axios from 'axios';
import { environment } from 'src/environments/environment';
import { AuthRequest, UserResponse } from 'src/app/modules/auth/auth.module';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userResponse: UserResponse;
  constructor(public layoutService: LayoutService, public localService: LocalService,public tokenService : TokenService) {}

  async Auth(auth: AuthRequest) {
    const config = {
      headers: { 'Accept-Language': this.layoutService.config.lang }
    };

    return await Axios.post(`${environment.baseApiUrl}/api/authintication/auth`, auth, config)
      .then((res) => {
        this.tokenService.setToken(res.data.token);
        this.tokenService.setRefreshToken(res.data.token);
        return res.data;
      })
      .catch((error) => {
        return error.response.data;
      });
  }



  public isAuthenticated(): boolean {
    var user = this.localService.getData('currentUser');

    if (user != null) {
      return true;
    } else {
      return false;
    }
  }
}
