import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationService {

  url = environment.wpdApiUrl;

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.url}/users/sign-in`, { username: username, password: password })
      .map(res => {
        // login successful if there's a jwt token in the response
        if (res && res.authentication.login.responseResult.succeeded) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(res.authentication.login.jwt));
        }

        return res.authentication.login.jwt;
      });
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
  }

  update(param: {userId: string, name: string, email:string, password: string}): Observable<any> {
    console.log('>>> AuthenticationService >>> updateUser ', param)
    const userJwt = localStorage.getItem('currentUser')
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(userJwt) 
      })
    }
    return this.http.post(`${this.url}/users/update`, param, httpOptions)

  }

  signUp( param: {email: string, name: string, password: string}): Observable<any> {
    console.log('>>> AuthenticationService >>> signUp ', param)
    return this.http.post(`${this.url}/users/sign-up`, param)
  }

  checkEmail(param: {email: string}): Observable<any> {
    console.log('>>> AuthenticationService >>> checkEmail ', param)
    return this.http.post(`${this.url}/users/emails`, param)
  }

}