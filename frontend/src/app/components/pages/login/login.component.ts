import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { login } from 'src/app/store/auth/auth.actions';
import { selectAuthToken, selectTOTP } from 'src/app/store/auth/auth.selectors';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    formGroup = new UntypedFormGroup({
        username: new UntypedFormControl(''),
        password: new UntypedFormControl(''),
    });

    constructor(private router: Router, private store: Store) {}

    ngOnInit(): void {
        this.store.select(selectAuthToken).subscribe((token) => {
            if (token) {
                this.router.navigate(['home']);
            }
        });

        this.store.select(selectTOTP).subscribe((totp) => {
            if (totp) {
                this.router.navigate(['totp']);
            }
        });
    }

    login(): void {
        this.store.dispatch(
            login({
                username: this.formGroup.get('username')?.value,
                password: this.formGroup.get('password')?.value,
            })
        );
    }
}
