import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarFormComponent } from './components/car-form/car-form.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarServicesListComponent } from './components/car-services-list/car-services-list.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ReceiveCarComponent } from './components/receive-car/receive-car.component';
import { RepairFormComponent } from './components/repair-form/repair-form.component';
import { RepairOptionListComponent } from './components/repair-option-list/repair-option-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
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
    path: "services",
    children: [
      {
        path: '',
        component: CarServicesListComponent

      },
      {
        path: "new",
        component: ReceiveCarComponent,
      }
    ]
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
    children: [
      {
        path: '',
        component: RepairOptionListComponent

      },
      {
        path: "edit/:id",
        component: RepairFormComponent,
      }
    ]
  },
  {
    path: "visits",
    component: VisitListComponent
  },

  {
    path: "users",
    children: [
      {
        path: '',
        component: UserListComponent

      },
      {
        path: "edit/:id",
        component: UserFormComponent,
      }
    ]
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
