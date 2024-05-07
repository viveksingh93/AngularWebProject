import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PurchaseRequisitionComponent } from './PurchaseRequisition/purchase-requisition/purchase-requisition.component';
import { AddPurchaseRequisitionComponent } from './PurchaseRequisition/add-purchase-requisition/add-purchase-requisition.component';
import { MsalGuard } from '@azure/msal-angular';
//import { PrnapproverComponent } from './Master/prnapprover/prnapprover.component';
import { TermnewComponent } from './Master/termnew/termnew.component';
import { PrnApprovernewComponent } from './Master/prn-approvernew/prn-approvernew.component';
import { AccountnewComponent } from './Master/accountnew/accountnew.component';
import { DepartmentnewComponent } from './Master/departmentnew/departmentnew.component';

const routes: Routes = [
  {path:'',component:HomeComponent,
  
  canActivate: [
    MsalGuard
  ]
  },
 
  {path:'accounts-new',component:AccountnewComponent,
  canActivate: [
    MsalGuard
  ]},

  {path:'department-new',component:DepartmentnewComponent,
  canActivate: [
    MsalGuard
  ]},
  
  {path:'PrnApprover-new',component:PrnApprovernewComponent,
  canActivate: [
    MsalGuard
  ]},
  
  {path:'term-new',component:TermnewComponent,
  canActivate: [
    MsalGuard
  ]},

  {path:'PurchaseRequisition',component:PurchaseRequisitionComponent,
  canActivate: [
    MsalGuard
  ]},

  {path:'addpurchaserequisition',component:AddPurchaseRequisitionComponent,
  canActivate: [
    MsalGuard
  ]},

  {path:'addpurchaserequisition/:id',component:AddPurchaseRequisitionComponent,
  canActivate: [
    MsalGuard
  ]},
  
];
  
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
