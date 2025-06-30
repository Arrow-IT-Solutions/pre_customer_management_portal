import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private axiosInstance: AxiosInstance;

  constructor(public layoutService: LayoutService) {
    this.axiosInstance = axios.create();
  }

  // Save the token in localStorage
  setToken(token: string): void {
    console.log("Token : ",token);
    localStorage.setItem('accessToken', token);
  }

  // Retrieve the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Save the refresh token in localStorage
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Retrieve the refresh token from localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Refresh the token using refresh token
  async refreshToken(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    console.log("Refresh Token : ",refreshToken);
    if (refreshToken) {
      const response = await this.axiosInstance.post(`${environment.baseApiUrl}/api/authintication/refreshToken`, {
        token:refreshToken
      });
      this.setToken(response.data.token);
      this.setRefreshToken(response.data.refreshToken);
    }
  }

  // Remove tokens (logout)
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
