import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BayFormComponent } from './components/bay-form/bay-form.component';
import { BayListComponent } from './components/bay-list/bay-list.component';
import { CarFormComponent } from './components/car-form/car-form.component';
import { CarHistoryComponent } from './components/car-history/car-history.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarServicesListComponent } from './components/car-services-list/car-services-list.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginErrorComponent } from './components/login-error/login-error.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ReceiveCarComponent } from './components/receive-car/receive-car.component';
import { RepairFormComponent } from './components/repair-form/repair-form.component';
import { RepairOptionListComponent } from './components/repair-option-list/repair-option-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { VisitListComponent } from './components/visit-list/visit-list.component';
import { WorkPageComponent } from './components/work-page/work-page.component';
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
    path: "entry-page",
    component: LoginErrorComponent
  },
  {
    path: "work-page/:id",
    component: WorkPageComponent
  },
  {
    path: "services",
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: CarServicesListComponent

      },
      {
        path: ":id",
        component: ReceiveCarComponent,
      },
      {
        path: "history/:id",
        component: CarHistoryComponent,
      }
    ]
  },
  {
    canActivate: [AuthGuardService],
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
    canActivate: [AuthGuardService],
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
    path: "users",
    canActivate: [AuthGuardService],
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
    canActivate: [AuthGuardService],
    path: "bays",
    children: [
      {
        path: '',
        component: BayListComponent

      },
      {
        path: "edit/:id",
        component: BayFormComponent,
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
