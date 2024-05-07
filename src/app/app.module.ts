import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
// 26/12/2023
import{ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgToastModule } from 'ng-angular-popup';
import { AddPurchaseRequisitionComponent } from './PurchaseRequisition/add-purchase-requisition/add-purchase-requisition.component';
import { PurchaseRequisitionComponent } from './PurchaseRequisition/purchase-requisition/purchase-requisition.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StrictNumberOnlyDirective } from './utils/StrictNumberOnlyDirective';
import { DatepickerDirective } from './directives/datepicker.directive';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';

//  import { GuardedComponent } from './guarded/guarded.component';

import { IPublicClientApplication, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MsalGuard, MsalBroadcastService, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalGuardConfiguration, MsalRedirectComponent } from '@azure/msal-angular';
import { msalConfig } from './auth-config';
import { CustomDateParserFormatter } from './core/CustomDateParserFormatter ';
import { TermnewComponent } from './Master/termnew/termnew.component';
import { PrnApprovernewComponent } from './Master/prn-approvernew/prn-approvernew.component';
import { AccountnewComponent } from './Master/accountnew/accountnew.component';
import { DepartmentnewComponent } from './Master/departmentnew/departmentnew.component';
import { SearchPipe } from './search.pipe';

import { ToastrService } from 'ngx-toastr';






export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return { 
    interactionType: InteractionType.Redirect,
  };
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HomeComponent,
    FooterComponent,
    AddPurchaseRequisitionComponent,
    PurchaseRequisitionComponent,
    DatepickerDirective,
    StrictNumberOnlyDirective,
    TermnewComponent,
    PrnApprovernewComponent,
    AccountnewComponent,
    DepartmentnewComponent,
    SearchPipe,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,    
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    NgbHighlight,
    NgbPaginationModule,
    
    NgToastModule,
    MsalModule,
    BsDatepickerModule.forRoot(),
    MatDialogModule,
    ToastrModule.forRoot(),
    
    
  ],
  providers: [
   
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    //{provide: NgbDateAdapter, useClass: CustomDateAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
    ,DatePipe
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
