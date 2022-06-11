import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { login } from 'src/app/store/auth/auth.actions';
import { selectAuthToken } from 'src/app/store/auth/auth.selectors';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    formGroup = new FormGroup({
        username: new FormControl(''),
        password: new FormControl(''),
    });

    constructor(private router: Router, private store: Store) {}

    ngOnInit(): void {
        this.store.select(selectAuthToken).subscribe((token) => {
            if (token) {
                this.router.navigate(['home']);
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
