import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarFormComponent } from './components/car-form/car-form.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RepairOptionListComponent } from './components/repair-option-list/repair-option-list.component';
import { VisitListComponent } from './components/visit-list/visit-list.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: HomePageComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "login",
    component: LoginPageComponent
  },
  {
    path: "cars",
    children: [
      {
        path: '',
        component: CarListComponent

      },
      {
        path: "edit/:id",
        component: CarFormComponent,
      }
    ]
  },
  {
    path: "repair-options",
    component: RepairOptionListComponent
  },
  {
    path: "visits",
    component: VisitListComponent
  },
  {
    path: "**",
    redirectTo: '/home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
