import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import { Observable } from "rxjs/Observable";
import { Observable } from "rxjs";
import { User } from "../models/user";
import { GLOBAL } from "./global";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url:String;
  public identity;
  public token;

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  register(user: User): Observable<any> {
    // console.log(user_to_register);
    // console.log(this.url);

    // Se convierte un json a string
    let params = JSON.stringify(user);

    // Se configuran las cabezeras
    let headers =  new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + 'register', params, {headers: headers});
  }

  signup(user, gettoken = null): Observable<any> {
    if(gettoken != null) {
      user.gettoken = gettoken;
    }

    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + 'login', params, {headers: headers});
  }

  // Funcion que permite extraer el objeto de usuario del localStorage
  getIdentity() {
    // Convertira un json string a un objeto de javascript
    let identity = JSON.parse(localStorage.getItem('identity'));

    if(identity != 'undefined') {
      this.identity = identity;
    }else {
      this.identity = null;
    }

    return this.identity;
  }

  getToken() {
    // Convertira un json string a un objeto de javascript
    let token = localStorage.getItem('token');

    if(token != 'undefined') {
      this.token = token;
    }else {
      this.token = null;
    }

    return this.token;
  }
}
