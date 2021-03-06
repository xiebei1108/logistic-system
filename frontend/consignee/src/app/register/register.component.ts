import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const username = this.form.getRawValue().username;
    const password = this.form.getRawValue().password;
    console.log(`register user: ${username}, ${password}`);
    this.authService.register({username: username, password: password}).subscribe(
      r => {
        console.log(`${JSON.stringify(r)}`);
        if (r.code != 200) {
          this.dialog.open(RegisterFailDialog);
        } else {
          this.dialog.open(RegisterSuccessDialog)
        }
      },
      e => {
        console.error(`${e}`);
        this.dialog.open(RegisterFailDialog)
      }
    )
  }
}

@Component({
  selector: 'register-fail-dialog',
  templateUrl: 'register-fail-dialog.html',
})
export class RegisterFailDialog {
  constructor(
    public dialogRef: MatDialogRef<RegisterFailDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'register-success-dialog',
  templateUrl: 'register-success-dialog.html',
  providers: [AuthService]
})
export class RegisterSuccessDialog {
  constructor(
    public dialogRef: MatDialogRef<RegisterSuccessDialog>,
    private authService: AuthService,
    private router: Router,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onBackLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.dialogRef.close();
  }
}
