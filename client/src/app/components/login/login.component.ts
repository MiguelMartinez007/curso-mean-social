import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UserService]
})
export class LoginComponent implements OnInit {
  public title:String;
  public user:User;

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
    alert(this.user.email);
    alert(this.user.password);
    console.log(this.user);
  }

}
