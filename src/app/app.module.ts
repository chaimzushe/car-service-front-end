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
import { HttpClientModule } from '@angular/common/http';
import {MatMenuModule} from '@angular/material/menu';
import { ConfirmActionComponent } from './dialogs/confirm-action/confirm-action.component';
import { RepairFormComponent } from './components/repair-form/repair-form.component';
import { ReceiveCarComponent } from './components/receive-car/receive-car.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AgGridModule } from 'ag-grid-angular';
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
    ReceiveCarComponent
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
    AgGridModule.withComponents([]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
