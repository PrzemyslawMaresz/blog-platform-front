import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registrationForm: FormGroup;
  incorrectUsername = false;
  incorrectEmail = false;
  incorrectPassword = false;
  incorrectConfirmPassword = false;
  passwordMismatch = false;
  usernameOrEmailTaken = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const { username, email, password, confirmPassword } = this.registrationForm.value;

      if (password !== confirmPassword) {
        this.passwordMismatch = true;
        return;
      }

      this.authService.register(username, email, password).subscribe({
        next: data => {
          console.log(data);
          this.router.navigate(['/login']);
        },
        error: error => {
          console.error(error);
          this.usernameOrEmailTaken = true;
          this.errorMessage = error.error.message;
        }
      });


    } else {
      const usernameControl = this.registrationForm.get('username');
      const emailControl = this.registrationForm.get('email');
      const passwordControl = this.registrationForm.get('password');
      const confirmPasswordControl = this.registrationForm.get('confirmPassword');

      this.incorrectUsername = usernameControl ? !usernameControl.valid : false;
      this.incorrectEmail = emailControl ? !emailControl.valid : false;
      this.incorrectPassword = passwordControl ? !passwordControl.valid : false;
      this.incorrectConfirmPassword = confirmPasswordControl ? !confirmPasswordControl.valid : false;
      
      
    }
  }

  resetErrorState() {
    this.incorrectUsername = false;
    this.incorrectEmail = false;
    this.incorrectPassword = false;
    this.incorrectConfirmPassword = false;
    this.usernameOrEmailTaken = false;
    this.errorMessage = '';
  }



}
