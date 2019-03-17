import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public url:String;

  constructor() {
    this.url = GLOBAL.url;
  }

  // Nos permitira hacer una peticion ajax para subir un archivo
  makeFileRequest(url: string, params: Array<String>, files: Array<File>, token: string, name: String) {
    // Retornamos una promesa para poder a la hora de llamarla tener el control sobre lo que se quiere ejecutar despues
    return new Promise(function (resolve, reject) {
      // Creamos variable para el ormulario, con esto simulamos un formulari clasico
      var formData: any = new FormData();
      // Definimos una varible con un objeto que nos permita hacer peticiones ajax en javascript puro
      var xhr = new XMLHttpRequest();

      for(var i=0; i<files.length; i++) {
        formData.append(name, files[i], files[i].name);
      }

      // Peticion ajax
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
          if(xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          }else {
            reject(xhr.response);
          }
        }
      }

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });
  }
}
