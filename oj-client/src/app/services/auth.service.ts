
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';

import { tokenNotExpired } from 'angular2-jwt';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from 'rxjs/Rx';
import Auth0Lock from 'auth0-lock';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {

  clientID = 'o46BOwVtN9o71DkTiktz9jYyc-iFI6WA';
  domain = 'bittiger503coj.auth0.com';
  auth0Options = {
    auth: {
      redirectUri: 'http://localhost:3000/',
      responseType: 'token id_token',
      audience: 'https://bittiger503coj.auth0.com/userinfo',
      scope: 'openid profile'
    },
    autoclose: true,
  };

  lock = new Auth0Lock(
    this.clientID,
    this.domain,
    this.auth0Options
  );

  private profileSource = new BehaviorSubject<Object>([]);

  constructor(private http: Http) {
    this.lock.on('authenticated', (authResult: any) => {
      console.log('Nice, it worked!');
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if(error) {
          console.log(error);
          return;
        }
        localStorage.setItem('token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));

        this.profileSource.next(JSON.parse(localStorage.getItem('profile')));
      })

    });

    this.lock.on('authorization_error', error => {
      console.log('something went wrong', error);
    });
  }

  public login() {
    this.lock.show();
  }

  public authenticated() {
    return tokenNotExpired();
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
  }

  public getProfile(): Observable<Object> {
    this.profileSource.next(JSON.parse(localStorage.getItem('profile')));
    return this.profileSource.asObservable();
  }

  public resetPassword(): void {
    let profile = JSON.parse(localStorage.getItem('profile'));

    let url: string = `https://${this.domain}/dbconnections/change_password`;
    let headers = new Headers({'content-type': 'application/json' });
    let body = {
      client_id: this.clientID,
      email: profile.email,
      connection: 'Username-Password-Authentication'
    };

    this.http.post(url, body, headers)
             .toPromise()
             .then((res: Response) => {
               console.log(res.json());
             })
             .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occurred', error);
    return Promise.reject(error.message || error);
  }
}
