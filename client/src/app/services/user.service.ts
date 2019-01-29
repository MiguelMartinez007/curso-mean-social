import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { User } from "../models/user";
import { GLOBAL } from "./global";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url:String;

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  register(user_to_register) {
    console.log(user_to_register);
    console.log(this.url);
  }
}
