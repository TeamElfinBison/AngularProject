import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { AuthGuardService } from './../core/auth-guard/auth-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'profile', pathMatch: 'full' },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
    { path: 'cart', component: ShoppingCartComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }
