import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';
import { GLOBAL } from 'src/app/services/global';

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
  public url:String;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _uploadService: UploadService) {
    this.title = 'Actualizar mis datos';
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

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
          this._uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image').then((result: any) => {
            console.log(result);
            this.user.image = result.image;
            localStorage.setItem('identity', JSON.stringify(this.user));
          });
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

  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

}
