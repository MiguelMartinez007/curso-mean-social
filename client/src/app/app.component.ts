import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { Router, ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {
  public title: String;
  public identity;

  constructor(private _userService:UserService, private _router: Router, private _route: ActivatedRoute) {
    this.title = 'NGSOIAL';
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    console.log(this.identity);
  }

  // Esta funcion nos permite actualizar siertas partes del código
  ngDoCheck() {
    this.identity = this._userService.getIdentity();
  }

  // Función para cerrar sesión
  logout() {
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/login']);
  }
}