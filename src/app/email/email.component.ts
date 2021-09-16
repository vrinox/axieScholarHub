import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { userCloudData } from '../models/interfaces';
import { ApiTrackerService } from '../services/api-tracker.service';
import { AuthService } from '../services/auth.service';
import { lunacianApiService } from '../services/lunacian-api.service';

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
    private fb: FormBuilder,
    private trackerService: ApiTrackerService
  ) {}
  
  ngOnInit() {}

  enviar(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.authService
      .login(this.loginForm.value)
      .then(async (uid:string)=>{        
        this.authService.loginComplete(uid);
      });
    this.onReset();
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }
}
