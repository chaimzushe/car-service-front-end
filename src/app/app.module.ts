import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { SettingBlockComponent } from './components/setting-block/setting-block.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NoItemsFoundComponent } from './components/no-items-found/no-items-found.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { VisitListComponent } from './components/visit-list/visit-list.component';
import { RepairOptionListComponent } from './components/repair-option-list/repair-option-list.component';
import { SubNavComponent } from './components/sub-nav/sub-nav.component';
import { CarFormComponent } from './components/car-form/car-form.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatMenuModule} from '@angular/material/menu';
import { ConfirmActionComponent } from './dialogs/confirm-action/confirm-action.component';
import { RepairFormComponent } from './components/repair-form/repair-form.component';
import { ReceiveCarComponent } from './components/receive-car/receive-car.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AgGridModule } from 'ag-grid-angular';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import { AllModules, ModuleRegistry } from '@ag-grid-enterprise/all-modules';
import { CarServicesListComponent } from './components/car-services-list/car-services-list.component';
import { DatePipe } from '@angular/common';
import { ServicesFilterComponent } from './dialogs/services-filter/services-filter.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoginErrorComponent } from './components/login-error/login-error.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

ModuleRegistry.registerModules(AllModules);
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    SettingBlockComponent,
    NavBarComponent,
    FooterComponent,
    NoItemsFoundComponent,
    CarListComponent,
    VisitListComponent,
    RepairOptionListComponent,
    SubNavComponent,
    CarFormComponent,
    ConfirmActionComponent,
    RepairFormComponent,
    ReceiveCarComponent,
    UserListComponent,
    UserFormComponent,
    CarServicesListComponent,
    ServicesFilterComponent,
    LoginErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    AgGridModule.withComponents([]),
  ],
  providers: [DatePipe,
    {provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
