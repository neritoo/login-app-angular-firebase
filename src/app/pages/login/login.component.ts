import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: Usuario;
  recordarme: boolean = false;

  constructor( private auth: AuthService, private router: Router ) { }

  ngOnInit() {
    this.usuario = new Usuario();

    if ( localStorage.getItem('email') ){
      this.usuario.email = localStorage.getItem('email');
      this.recordarme = true;
    }
  }

  logIn( form: NgForm ){
    if ( form.invalid ){
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere porfavor',
    });
    Swal.showLoading();

    this.auth.logIn(this.usuario)
        .subscribe( resp => {
          Swal.close();
          if( this.recordarme ){
            localStorage.setItem('email', this.usuario.email);
          } else {
            localStorage.removeItem('email');
          }
          this.router.navigateByUrl('/home');
        }, (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: err.error.error.message
          });
        });
  }

}
