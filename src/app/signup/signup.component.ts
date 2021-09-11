import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchingValidatior } from '../validators/email.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = true;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder  
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        fullname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required ],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {validators: passwordMatchingValidatior}
    );
  }

  enviar(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.authService.emailSignup({
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    })
  }

  onReset(): void {
    this.submitted = false;
    this.registerForm.reset();
  }
}