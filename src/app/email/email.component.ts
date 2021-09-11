import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit {  
  loginForm: FormGroup = this.fb.group( {
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(40)
      ]
    ]
  }
  );
  submitted: boolean = true;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {}
  
  ngOnInit() {}

  enviar(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.value);
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }
}
