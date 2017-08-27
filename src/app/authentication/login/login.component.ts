import { NotificatorService } from './../../core/notificator/notificator.service';
import { UserAuthService } from './../services/user-auth/user-auth.service';
import { User } from './../../models/User';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '../../core/cookie/cookie.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public user: User;

    constructor(
        private readonly requester: UserAuthService,
        private readonly notificator: NotificatorService,
        private readonly cookieService: CookieService,
        private readonly router: Router) { }

    ngOnInit() {
        this.user = new User();
    }

    loginUser() {
        this.requester.loginUser(this.user).subscribe(
            (response) => {
                this.cookieService.setCookie('token', response.data[0].token);
                this.notificator.showSuccess(response.message);
            },
            (err) => this.notificator.showError(JSON.parse(err._body).message),
            () => this.router.navigateByUrl('/'));
    }
}