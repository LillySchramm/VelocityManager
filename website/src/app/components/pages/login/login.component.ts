import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

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
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.authService
            .isLoggedIn()
            .pipe(take(1))
            .subscribe((isLoggedIn) => {
                if (isLoggedIn) {
                    this.router.navigate(['home']);
                }
            });
    }

    login(): void {
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
            });
    }
}
