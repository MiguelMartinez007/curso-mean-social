import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  public title: String;
  public user: User;
  public identity;
  public token;
  public status: String;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService) {
    this.title = 'Actualizar mis datos';
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();

  }

  ngOnInit() {
    console.log(this.user);
    console.log('user-edit.componet se ha cargado!!')
  }

  onSubmit() {
    console.log(this.user);
    this._userService.updateUser(this.user).subscribe(
      response => {
        // En caso de que no me retorne ningun usuario
        if(!response.user) {
          this.status = 'error';
        }else {
          // Si si retorna el usuario
          this.status = 'success';

          // Actualizo el identity del localStorage
          localStorage.setItem('identity', JSON.stringify(this.user));
          // Y actualizo la identity actual
          this.identity = this.user;

          // Subida de imagen de usuario
          
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

}
