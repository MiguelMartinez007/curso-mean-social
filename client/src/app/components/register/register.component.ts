import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public title:String;
  public user: User;
  public status:String;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService) {
    this.title = 'Registrate';
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
    console.log('Componente de register cargando...');
  }

  onSubmit(form) {
    // Con el petodo subscribe se recuperan los datos debueltos por parte de la funcion
    this._userService.register(this.user).subscribe(
      response => {
        if(response.user && response.user._id) {
          // console.log(response.user);
          this.status = 'success';
          // Formatea los datos del formulario
          form.reset();
        }else{
          this.status = 'error';
        }
      },
      error => {
        console.log(<any>error);
        this.status = 'error';
      }
    );
  }
}
