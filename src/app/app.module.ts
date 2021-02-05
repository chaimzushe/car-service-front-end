import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingBlockComponent } from './components/setting-block/setting-block.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NoItemsFoundComponent } from './components/no-items-found/no-items-found.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { VisitListComponent } from './components/visit-list/visit-list.component';
import { RepairOptionListComponent } from './components/repair-option-list/repair-option-list.component';
import { SubNavComponent } from './components/sub-nav/sub-nav.component';
import { CarFormComponent } from './components/car-form/car-form.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfirmActionComponent } from './dialogs/confirm-action/confirm-action.component';
import { RepairFormComponent } from './components/repair-form/repair-form.component';
import { ReceiveCarComponent } from './components/receive-car/receive-car.component';
import { AgGridModule } from 'ag-grid-angular';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { AllModules, ModuleRegistry } from '@ag-grid-enterprise/all-modules';
import { CarServicesListComponent } from './components/car-services-list/car-services-list.component';
import { DatePipe } from '@angular/common';
import { ServicesFilterComponent } from './dialogs/services-filter/services-filter.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoginErrorComponent } from './components/login-error/login-error.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CarHistoryComponent } from './components/car-history/car-history.component';
import { EditRendererComponent } from './components/edit-renderer/edit-renderer.component';
import { MaterialModule } from './material/material.module';
import { GoogleSpreadsheetWarnComponent } from './dialogs/google-spreadsheet-warn/google-spreadsheet-warn.component';
import { ItemCardComponent } from './components/item-card/item-card.component';
import { AssignToBayComponent } from './dialogs/assign-to-bay/assign-to-bay.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { AddToWaitingComponent } from './dialogs/add-to-waiting/add-to-waiting.component';

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
    LoginErrorComponent,
    CarHistoryComponent,
    EditRendererComponent,
    GoogleSpreadsheetWarnComponent,
    ItemCardComponent,
    AssignToBayComponent,
    AddToWaitingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    MaterialModule,
    DragDropModule,
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
