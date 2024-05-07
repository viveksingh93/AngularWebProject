import { Component, ElementRef, ViewChild } from '@angular/core';
import { PRServicesService } from 'src/app/service/prservices.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PurchaseRequisition } from 'src/app/models/PurchaseRequisition/PurchaseRequisition';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-requisition',
  templateUrl: './purchase-requisition.component.html',
  styleUrls: ['./purchase-requisition.component.css']
})
export class PurchaseRequisitionComponent {
  searchText='';
  sort: any;
  prForm!: FormGroup;
  objPR: PurchaseRequisition = new PurchaseRequisition();
  PurchaseRequisitions: PurchaseRequisition[] = [];
  nPRNID: number = 0;
  @ViewChild('closeButton') closeButton!: ElementRef<any>;
  public errorMessage: string = '';
  public lblModalHeader: string = 'Create Purchase Requisition';
  public lblBtn: string = 'Submit';
  constructor(private fb: FormBuilder, private _prService: PRServicesService, private router: Router) { }

  ngOnInit(): void {
    
    this.getPurchaseRequisitionList();
  }

  //Get all Purchase Requisition
  public getPurchaseRequisitionList(){
    this._prService.getPurchaseRequisitionList().subscribe((resData: any) => {
      if(resData.length>0){
        this.PurchaseRequisitions = resData;
      }
    });
  }
 
  //Get Purchase Requisition by Id
  public getbyIDPurchaseRequisition(nPRNID: number){
    this._prService.getbyIDPurchaseRequisition(nPRNID).subscribe((respData: any) => {
      if(respData){
        this.objPR = respData;
      }
    });
  }

  //Edit Purchase Requisition
  public edit(nPRNID: number){
    this.lblModalHeader = 'Update Purchase Requisition';
    this.lblBtn = 'Update';
    this.router.navigate(['addpurchaserequisition', nPRNID]);
  }

  btnNew(){
    this.lblBtn = 'Save';
    this.lblModalHeader = 'Create Purchase Requisition';
    this.nPRNID = 0;
    this.router.navigate(['addpurchaserequisition']);
  }
  
  //Clear controls after action
  clearData() {
    this.prForm.reset();
  }
}
  