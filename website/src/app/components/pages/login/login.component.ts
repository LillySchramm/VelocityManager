import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { login } from 'src/app/store/auth/auth.actions';
import { selectAuthToken } from 'src/app/store/auth/auth.selectors';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [MessageService],
})
export class LoginComponent implements OnInit {
    formGroup = new FormGroup({
        username: new FormControl(''),
        password: new FormControl(''),
    });

    constructor(
        private router: Router,
        private messageService: MessageService,
        private store: Store
    ) {}

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
        /*
        this.authService
            .login(
                this.formGroup.get('username')?.value,
                this.formGroup.get('password')?.value
            )
            .pipe(take(1))
            .subscribe((result) => {
                if (result) {
                    this.router.navigate(['home']);
                    return;
                }
                this.messageService.add({
                    severity: 'error',
                    summary: 'Login failed!',
                    detail: 'Please check username and password',
                });
            }); */
    }
}
