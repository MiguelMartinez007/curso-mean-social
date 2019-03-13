import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { getToken } from '@angular/router/src/utils/preactivation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UserService]
})
export class LoginComponent implements OnInit {
  public title:String;
  public user:User;
  public status:string;
  // Llevara la identidad del usuario
  public indentity;
  // Cargara el token del usuario
  public token;

  constructor(private _route:ActivatedRoute, private _router: Router, private _userService:UserService) {
    this.title = 'Identificate';
    this.user = new User(
        "",
        "",
        "",
        "",
        "",
        "",
        "ROLE_USER",
        ""
    );
  }

  ngOnInit() {
    console.log('Componente de login cargando...');
  }

  onSubmit() {
    // Loguear al usuario y conseguir sus datos
    this._userService.signup(this.user).subscribe(
      response => {
        // Agregamos el valor a la variable identity
        this.indentity = response.user;

        console.log(this.indentity);

        // En caso de que no llegue algun usuario
        if(!this.indentity || !this.indentity._id) {
          this.status = 'error';
        }else {
          this.status = 'success';

          // Persistir datos del usuario

          // Conseguir el token
          this.gettoken();
        }
      },
      error => {
        // Asigno el error a una variable
        var errorMessage = <any>error;
        // Mando mensaje sobre el error
        console.log(errorMessage);
        // Si el error no es nulo entonces cambio el valor de la variabe status a error
        if(errorMessage != null) {
          this.status = 'error';
        }
      }
    );

    // alert(this.user.email);
    // alert(this.user.password);
    // console.log(this.user);
  }

  gettoken() {
    // Loguear al usuario y conseguir sus datos
    this._userService.signup(this.user, 'true').subscribe(
      response => {
        // Agregamos el valor a la variable identity
        this.token = response.token;

        console.log(this.token);

        // En caso de que no llegue algun usuario
        if(this.token.length <= 0) {
          this.status = 'error';
        }else {
          this.status = 'success';

          // Persistir datos del usuario

          // Conseguir los contadores o estadisticas del usuario
          
        }
      },
      error => {
        // Asigno el error a una variable
        var errorMessage = <any>error;
        // Mando mensaje sobre el error
        console.log(errorMessage);
        // Si el error no es nulo entonces cambio el valor de la variabe status a error
        if(errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }
}
