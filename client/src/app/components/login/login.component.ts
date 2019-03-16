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
          // Esto se hace guardando el objeto identity en el localStorage que es una bd en el navegador
          // Esta propiedad soporta solo cadenas de texto por lo que se tiene que convertir el objeto a una cadena
          // De esta forma se puede estar en sesion
          localStorage.setItem('identity', JSON.stringify(this.indentity));

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

          // Persistir token del usuario
          localStorage.setItem('token', this.token);

          // Conseguir los contadores o estadisticas del usuario
          
          
          // Redireccionamos a la pagina de home
          this._router.navigate(['/home']);
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
