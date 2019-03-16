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
  public stats;

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
  
  // Consigue la informacion de estadisticas del localStorage
  getStats() {
    let stats = JSON.parse(localStorage.getItem('stats'));

    if(stats != 'undefined') {
      this.stats = stats;
    }else {
      this.stats = null;
    }

    this.stats;
  }

  // Saca estadisticas de un usuario en particulas y de todo los usuarios
  getCounters(userId = null): Observable<any> {
    // Mandamos las cabezeras a el backend
    let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization',this.getToken());

    // Comprbamos si el userId es diferente a null
    if(userId != null) {
      return this._http.get(this.url + 'counters/' + userId, {headers: headers});
    }else {
      return this._http.get(this.url + 'counters/', {headers: headers});
    }
  }
}
