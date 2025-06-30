import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private axiosInstance: AxiosInstance;


  constructor(private tokenService: TokenService, private layoutService: LayoutService) {
    this.axiosInstance = axios.create({
      baseURL: environment.baseApiUrl,
    });

    // Request interceptor to add the token to the header
    this.axiosInstance.interceptors.request.use(
      async config => {
        const token = this.tokenService.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
          config.headers['Accept-Language'] = this.layoutService.config.lang;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor to handle token expiration
    this.axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        if (error.response.status === 401) {
          // Token might be expired, try refreshing it
          console.log("Call Refresh Token");
          try {
            await this.tokenService.refreshToken();
            error.config.headers['Authorization'] = `Bearer ${this.tokenService.getToken()}`;
            error.config.headers['Accept-Language'] = `en`;
            return this.axiosInstance(error.config);
          } catch (refreshError) {
            this.tokenService.clearTokens();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url: string, config = {}) {
    return await this.axiosInstance.get(url, config)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error.response.data;
      });
  }

  async post(url: string, data = {}, config = {}) {
    return await this.axiosInstance.post(url, data, config)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error.response.data;
      });
  }

  async put(url: string, data = {}, config = {}) {
    return await this.axiosInstance.put(url, data, config)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error.response.data;
      });
  }

  async delete(url: string, data = {}, config = {}) {
    return await this.axiosInstance.delete(url, config)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error.response.data;
      });
  }




}
