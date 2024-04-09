import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  wrongLoginData = false;
  emptyUsername = false;
  emptyPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: data => {
          console.log(data);
          this.storageService.saveUser(data);
          this.router.navigate(['/home']);
        },
        error: error => {
          console.error(error);
          this.wrongLoginData = true;
          this.errorMessage = error.error.message;
        }
      });
    } else {
      
      if (!this.loginForm.value.username) {
        this.emptyUsername = true;
      }

      if (!this.loginForm.value.password) {
        this.emptyPassword = true;
      }

    }
  }

  resetErrorState() {
    this.wrongLoginData = false;
    this.emptyUsername = false;
    this.emptyPassword = false;
    this.errorMessage = '';
  }
}
