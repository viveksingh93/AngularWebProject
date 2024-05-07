import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PRServicesService } from 'src/app/service/prservices.service';
import { ActivatedRoute, Router } from '@angular/router'
import { NgbDateAdapter, NgbDateParserFormatter, } from '@ng-bootstrap/ng-bootstrap';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
import { CustomDateParserFormatter } from 'src/app/core/CustomDateParserFormatter ';
import { CustomDateAdapter } from 'src/app/core/CustomDateAdapter ';
import { MsalService } from '@azure/msal-angular';
import { PurchaseRequisitionLineItems, PurchaseRequisitionLineItemsRequest } from 'src/app/models/PurchaseRequisition/PurchaseRequisitionLineItems';
import { ToastrService } from 'ngx-toastr';


defineLocale('en-gb', enGbLocale);

@Component({
  selector: 'app-add-purchase-requisition',
  templateUrl: './add-purchase-requisition.component.html',
  styleUrls: ['./add-purchase-requisition.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    { provide: NgbDateAdapter, useClass: CustomDateAdapter },
  ]
})
export class AddPurchaseRequisitionComponent {
 
  isChecked: boolean= false;

  newPRNIDNo: any;
  departmentList: any
  accountList: any
  objPRLineItems: PurchaseRequisitionLineItems = new PurchaseRequisitionLineItems();
  objPRLineItemsRequest: PurchaseRequisitionLineItemsRequest = new PurchaseRequisitionLineItemsRequest();
  prLineItem: PurchaseRequisitionLineItems[] = [];

  objPurchaseRequisition: PurchaseRequisitionLineItemsRequest = new PurchaseRequisitionLineItemsRequest();

  azureDataSource: any = [];
  nID: number = 0;
  nPRNID: number = 0;
  @ViewChild('closeButton') closeButton!: ElementRef<any>;
  public errorMessage: string = '';
  public lblModalHeader: string = 'Create Purchase Requisition Line Items';
  public lblBtn: string = 'Save';
  prLineItemForm!: FormGroup

  // Bind Term Dropdown List
  TermList: any

  // Bind PRN Approver Dropdown List
  PRNApproverList: any


  // Set Min date  Start
  currentDate: any = new Date();

  // Set Default today date
  selectedPRNDate: any = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
  selectedPRNDateOrdered: any = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
  selectedPRNDateRequired: any = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
  selectedPRNFinalApprovalDate: any = this._datePipe.transform(new Date(), 'yyyy-MM-dd');

  // end

  PRdata: any
  showUpdate!: boolean
  showadd!: boolean
  addPRForm: FormGroup
  displayedColumns: string[] = ['sAccountCode', 'sDepartmentCode', 'sPartNo', 'sPartDescription', 'nQuantity', 'nUnitCost', 'nExtendedCost', 'nTaxes', 'nExtendedCostwithTaxes', 'action'];
  prnid: number = 0
  sAccountCode: string = ''
  sDepartmentCode: string = ''
  data: any[] = [];
  isDisableManager: boolean = false;
  isDisablePersident: boolean = false;
  isCheckedPersident: boolean = false;
  isPRNDate: boolean = false;

  constructor(
    private _datePipe: DatePipe,
    private _fb: FormBuilder,
    private _prService: PRServicesService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: MsalService,
    private toaster: ToastrService

  ) {
    this.addPRForm = this._fb.group({ 
      nPRNID: [''],
      dtPRNDate: [Date(),{value: false, disabled: this.isPRNDate}],
      sPRNApprovalStatus: ['Pending'],
      sPRNCreatedBy: [''],
      sPRNProject: ['', Validators.required],
      sPRNRequestInitiatedBy: [''],
      bPRNTaxable: false,
      sPRNPriority: [''],
      sPRNPurchaseOrderNo: [''],
      sTermCode: [''],
      nPRNDueInDays: 0 || '',
      sPRNShipVia: [''],
      sPRNFOB: [''],
      dtPRNDateOrdered: [new Date()],
      dtPRNDateRequired: [new Date(), Validators.required],
      sPRNDeliverTo: ['', Validators.required],
      sPRNVendorName: [''],
      sPRNVendorContact: [''],
      sPRNVendorPhone: [''],
      sPRNVendorFax: [''],
      sPRNVendorAddress: [''],
      sPRNNotes: [''],
      bPRNManagerApprovalNeeded: [{value: true, disabled: false}],
      bPRNPresidentApprovalNeeded: [{value: false, disabled: false}],

      // bPRNManagerApprovalNeeded: [{value: true, disabled: this.isDisableManager}],
      // bPRNPresidentApprovalNeeded: [false],

      dtPRNFinalApprovalDate: [new Date()],
      nExtendedTotal: 0,
      nExtendedTotalWithTaxes: 0,
      nPRNApproverCode: [''],
      sApprovelComment: [''],
      sUpdatedBy: [''],
      dtUpdatedOn: new Date(),
      sPRNApproverUserName: ''
    });
    this.getPrnID();
  }

  getPrnID() {
    this.route.params.subscribe(val => {
      if (val['id']) {
        this.prnid = val['id'];
        this.onGetDataInit(this.prnid);
      }
    });
  }

  ngOnInit(): void {
    this.getDepartmentList();
    this.getAccountList();
    this.getPurchaseRequisitionLineItemList();
    this.GetByPRNIDPurchaseRequisitionList();
    this.getTermList();
    this.getPRNApproverList();
    this.getClaims(this.authService.instance.getActiveAccount()?.idTokenClaims);
    this.addPRForm.patchValue({
      sPRNRequestInitiatedBy: this.azureDataSource.name,
      sPRNCreatedBy: this.azureDataSource.name,
      sUpdatedBy: this.azureDataSource.name
    });

    this.prLineItemForm = this._fb.group({
      nID: [0],
      nPRNID: [''],
      sAccountCode: [''],
      sDepartmentCode: [''],
      sPartNo: [''],
      sPartDescription: ['', Validators.required],
      nQuantity: [''],
      nUnitCost: [''],
      nExtendedCost: [''],
      nTaxes: [''],
      nExtendedCostwithTaxes: [''],
      sUpdatedBy: ['']
    });
    this.prLineItemForm.patchValue({
      sUpdatedBy: this.azureDataSource.name
    })
    this.getPurchaseRequisitionLineItemList();
  }

  // Calculate the amount start
  OnChangeUnitCost() {
    if (this.prLineItemForm.value.nQuantity > 0) {
      console.log('Unit cost val nunit cost=>', this.prLineItemForm.value.nExtendedCost);
      console.log('Unit cost val tax =>', this.prLineItemForm.value.nTaxes);
      this.prLineItemForm.patchValue({
        nExtendedCost: (this.prLineItemForm.value.nQuantity * this.prLineItemForm.value.nUnitCost)
      });
      this.prLineItemForm.patchValue({
        nExtendedCostwithTaxes: (this.prLineItemForm.value.nExtendedCost + this.prLineItemForm.value.nTaxes)
      });
    } else {
      this.prLineItemForm.patchValue({
        nExtendedCost: 0
      });
    }
  }



  onExtendedCost() {
    if (this.prLineItemForm.value.nExtendedCost > 0) {
      console.log('Unit cost val nunit cost=>', this.prLineItemForm.value.nExtendedCost);
      this.prLineItemForm.patchValue({
        nExtendedCostwithTaxes: (this.prLineItemForm.value.nExtendedCost + this.prLineItemForm.value.nTaxes)
      });
    } else {
      this.prLineItemForm.patchValue({
        nExtendedCostwithTaxes: 0
      });
    }
  }

  OnChangeQty() {
    if (this.prLineItemForm.value.nQuantity > 0) {
      this.prLineItemForm.patchValue({
        nExtendedCost: (this.prLineItemForm.value.nQuantity * this.prLineItemForm.value.nUnitCost)
      });
      this.prLineItemForm.patchValue({
        nExtendedCostwithTaxes: (this.prLineItemForm.value.nExtendedCost + this.prLineItemForm.value.nTaxes)
      });
    } else {
      this.prLineItemForm.patchValue({
        nExtendedCost: 0
      });
    }
  }

  onTaxChange() {
    if (this.prLineItemForm.value.nExtendedCost > 0) {
      this.prLineItemForm.patchValue({
        nExtendedCostwithTaxes: (this.prLineItemForm.value.nExtendedCost + this.prLineItemForm.value.nTaxes)
      });

    }
  }
  // end


  //Insert/Update Purchase Requisition LineItem
  onSubmit(): void {
    this.objPRLineItemsRequest.nID = this.prLineItemForm.value.nID;
    this.objPRLineItemsRequest.nPRNID = this.prLineItemForm.value.nPRNID;
    this.objPRLineItemsRequest.sAccountCode = this.prLineItemForm.value.sAccountCode;
    this.objPRLineItemsRequest.sDepartmentCode = this.prLineItemForm.value.sDepartmentCode;
    this.objPRLineItemsRequest.sPartNo = this.prLineItemForm.value.sPartNo;
    this.objPRLineItemsRequest.sPartDescription = this.prLineItemForm.value.sPartDescription;
    this.objPRLineItemsRequest.nQuantity = this.prLineItemForm.value.nQuantity;
    this.objPRLineItemsRequest.nUnitCost = this.prLineItemForm.value.nUnitCost;
    this.objPRLineItemsRequest.nExtendedCost = this.prLineItemForm.value.nQuantity * this.prLineItemForm.value.nUnitCost;
    this.objPRLineItemsRequest.nTaxes = this.prLineItemForm.value.nTaxes;
    this.objPRLineItemsRequest.nExtendedCostwithTaxes = this.prLineItemForm.value.nExtendedCostwithTaxes;
    this.objPRLineItemsRequest.sUpdatedBy = this.prLineItemForm.value.sUpdatedBy;

    if (this.nID > 0) {
      this._prService.updatePurchaseRequisitionLineItem(this.nID, this.objPRLineItemsRequest).subscribe((respData: any) => {
        if (respData != null) {

          this.clearData();
          this.getPurchaseRequisitionLineItemList();
          this.closeButton.nativeElement.click();
          this.toaster.success('PR Line Items has been Updated successfully!')
        } else {
          this.errorMessage = 'Something went wrong!';
        }
      });
    } else {
      this._prService.addPurchaseRequisitionLineItem(this.objPRLineItemsRequest).subscribe((respData: any) => {
        if (respData != null) {

          this.clearData();
          this.getPurchaseRequisitionLineItemList();
          this.closeButton.nativeElement.click();
          this.toaster.success('PR Line Items has been Added successfully!')
           this.router.navigate(['/PurchaseRequisition'])
        } else {
          this.errorMessage = 'Something went wrong!';
        }
      });
    }
  }

  public getByIdPurchaseRequisitionLineItem(nID: number) {
    this._prService.getByIdPurchaseRequisitionLineItem(nID).subscribe((result: any) => {
      if (result) {
        this.prLineItemForm = result;
      }
    });
  }

  public edit(nID: number) {
    this.lblModalHeader = 'Update Purchase Requisition Line Item';
    this.lblBtn = 'Update';
    this._prService.getByIdPurchaseRequisitionLineItem(nID).subscribe((result: any) => {
      this.nID = result?.nID;
      if (result) {
        this.prLineItemForm.patchValue({
          nID: result?.nID,
          nPRNID: result?.nPRNID,
          sAccountCode: result?.sAccountCode,
          sAccountName: result?.sAccountName,
          sDepartmentCode: result?.sDepartmentCode,
          sDepartmentName: result?.sDepartmentName,
          sPartNo: result?.sPartNo,
          sPartDescription: result?.sPartDescription,
          nQuantity: result?.nQuantity,
          nUnitCost: result?.nUnitCost,
          nExtendedCost: result?.nExtendedCost,
          nTaxes: result?.nTaxes,
          nExtendedCostwithTaxes: result?.nExtendedCostwithTaxes,
          sUpdatedBy: result?.sUpdatedBy,
          dtUpdatedOn: result?.dtUpdatedOn
        });
      }
    });
  }

  btnNew() {
    this.lblBtn = 'Save';
    this.lblModalHeader = 'Create Purchase Requisition Line Item';
    this.nID = 0;

  }
  // Reset PurchaseRequisition Line Item
  clearData() {
    this.prLineItemForm.reset(
      {
        nID: 0,
        nPRNID: this.prnid,
        sAccountCode: '',
        sAccountName: '',
        sDepartmentCode: '',
        sDepartmentName: '',
        sPartNo: '',
        sPartDescription: '',
        nQuantity: 0 || '',
        nUnitCost: 0 || '',
        nExtendedCost: 0 || '',
        nTaxes: 0 || '',
        nExtendedCostwithTaxes: 0 || '',
        sUpdatedBy: '',
        dtUpdatedOn: new Date()
      }
    );
  }
  // get Name and Email Id Foe Azure active Directory
  getClaims(claims: any): string {
    this.azureDataSource = [
      { id: 1, claim: "Display Name", value: claims ? claims['name'] : null },
      { id: 2, claim: "User Email ID", value: claims ? claims['preferred_username'] : null },
    ];
    return this.azureDataSource = claims;
  }
  // Convert Data Format
  formatDate(inputDate: string): string {
    const inputDateTime = new Date(inputDate);
    const month = ('0' + (inputDateTime.getMonth() + 1)).slice(-2); // Months are 0-indexed
    const day = ('0' + inputDateTime.getDate()).slice(-2);
    const year = inputDateTime.getFullYear();
    return `${year}-${month}-${day}`
  }
  // Get All data Purchase Requisition
  
  onGetDataInit(prnid: number) {
    
    this._prService.getbyIDPurchaseRequisition(prnid).subscribe((data: any) => {
      console.log('datacheck ===>',data)
      if (data.nPRNID > 0) {
        this.prLineItemForm.patchValue({
          nPRNID: data.nPRNID
        });
      }
      
      if(data.nExtendedTotalWithTaxes > 500) {
        this.addPRForm.reset({
          bPRNPresidentApprovalNeeded: {value: true, disabled: false},
          bPRNManagerApprovalNeeded: {value: true, disabled:false}
        });
      } 
      if(data.nExtendedTotalWithTaxes < 500) {
        this.addPRForm.reset({
          bPRNPresidentApprovalNeeded: {value: '', disabled: true},
          bPRNManagerApprovalNeeded: {value: true, disabled:false}
        });
      }

      // if(data.nExtendedTotalWithTaxes  < 500) {
      //   if(data.bPRNPresidentApprovalNeeded){
      //     this.addPRForm.reset({
      //     bPRNPresidentApprovalNeeded: {value: false, disabled: true},
      //     bPRNManagerApprovalNeeded: {value: true, disabled:false}
      //   });
      //   }
      //this.addPRForm.get('bPRNPresidentApprovalNeeded')?.setValue(data.bPRNPresidentApprovalNeeded);
      //}
      this.addPRForm.get('nPRNID')?.setValue(parseInt(data.nPRNID));
      this.addPRForm.get('dtPRNDate')?.setValue(this.formatDate(data.dtPRNDate));
      this.addPRForm.get('sPRNApprovalStatus')?.setValue(data.sPRNApprovalStatus);
      this.addPRForm.get('sPRNCreatedBy')?.setValue(data.sPRNCreatedBy);
      this.addPRForm.get('sPRNProject')?.setValue(data.sPRNProject);
      //this.addPRForm.get('sPRNRequestInitiatedBy')?.setValue(data.sPRNProjectthis.azureDataSource.preferred_username);
      this.addPRForm.get('sPRNRequestInitiatedBy')?.setValue(data.sPRNRequestInitiatedBy);
      this.addPRForm.get('bPRNTaxable')?.setValue(data.bPRNTaxable);
      this.addPRForm.get('sPRNPriority')?.setValue(data.sPRNPriority);
      this.addPRForm.get('sPRNPurchaseOrderNo')?.setValue(data.sPRNPurchaseOrderNo);
      this.addPRForm.get('sTermCode')?.setValue(data.sTermCode);
      this.addPRForm.get('nPRNDueInDays')?.setValue(data.nPRNDueInDays);
      this.addPRForm.get('sPRNShipVia')?.setValue(data.sPRNShipVia);
      this.addPRForm.get('sPRNFOB')?.setValue(data.sPRNFOB);
      this.addPRForm.get('dtPRNDateOrdered')?.setValue(this.formatDate(data.dtPRNDateOrdered));
      this.addPRForm.get('dtPRNDateRequired')?.setValue(this.formatDate(data.dtPRNDateRequired));
      this.addPRForm.get('sPRNDeliverTo')?.setValue(data.sPRNDeliverTo);
      this.addPRForm.get('sPRNVendorName')?.setValue(data.sPRNVendorName);
      this.addPRForm.get('sPRNVendorContact')?.setValue(data.sPRNVendorContact);
      this.addPRForm.get('sPRNVendorPhone')?.setValue(data.sPRNVendorPhone);
      this.addPRForm.get('sPRNVendorFax')?.setValue(data.sPRNVendorFax);
      this.addPRForm.get('sPRNVendorAddress')?.setValue(data.sPRNVendorAddress);
      this.addPRForm.get('sPRNNotes')?.setValue(data.sPRNNotes);
      this.addPRForm.get('bPRNManagerApprovalNeeded')?.setValue(data.bPRNManagerApprovalNeeded);
      this.addPRForm.get('bPRNPresidentApprovalNeeded')?.setValue(data.bPRNPresidentApprovalNeeded);
      this.addPRForm.get('dtPRNFinalApprovalDate')?.setValue(this.formatDate(data.dtPRNFinalApprovalDate));
      this.addPRForm.get('nExtendedTotal')?.setValue(data.nExtendedTotal);
      this.addPRForm.get('nExtendedTotalWithTaxes')?.setValue(data.nExtendedTotalWithTaxes);
      this.addPRForm.get('nPRNApproverCode')?.setValue(data.nPRNApproverCode);
      this.addPRForm.get('sApprovelComment')?.setValue(data.sApprovelComment);
      this.addPRForm.get('sUpdatedBy')?.setValue(data.sUpdatedBy);
      this.addPRForm.get('dtUpdatedOn')?.setValue(data.dtUpdatedOn);
    });
  }

  // data save Purchase Requisition
  onFormSubmit() {
    let approver = this.PRNApproverList.find((x: any) => x.nPRNApproverCode == this.addPRForm.value.nPRNApproverCode);

    if (this.addPRForm.valid) {



      if (this.addPRForm.value.nPRNID != '') {
        if (approver.bActiveStatus == true) {
          this._prService.updatePurchaseRequisition(this.addPRForm.value.nPRNID, this.addPRForm.value).subscribe({
            next: (val: any) => {
              this.toaster.success('PR Update Successfully!')
              this.router.navigate(['/PurchaseRequisition']);
            },
            error: (err: any) => {
              console.error(err);
            }
          });
        }
        else {
          this.toaster.warning('This user is not active.');
        }
      } else {

        let addpurchasereq = {
          nPRNID: 0,
          dtPRNDate: this.addPRForm.value.dtPRNDate,
          sPRNApprovalStatus: 'Pending',
          sPRNCreatedBy: this.addPRForm.value.sPRNCreatedBy,
          sPRNProject: this.addPRForm.value.sPRNProject,
          sPRNRequestInitiatedBy: this.addPRForm.value.sPRNRequestInitiatedBy,
          bPRNTaxable: this.addPRForm.value.bPRNTaxable,
          sPRNPriority: this.addPRForm.value.sPRNPriority,
          sPRNPurchaseOrderNo: this.addPRForm.value.sPRNPurchaseOrderNo,
          sTermCode: this.addPRForm.value.sTermCode,
          nPRNDueInDays: 0,
          sPRNShipVia: this.addPRForm.value.sPRNShipVia,
          sPRNFOB: this.addPRForm.value.sPRNFOB,
          dtPRNDateOrdered: new Date(),
          dtPRNDateRequired: new Date(),
          sPRNDeliverTo: this.addPRForm.value.sPRNDeliverTo,
          sPRNVendorName: this.addPRForm.value.sPRNVendorName,
          sPRNVendorContact: this.addPRForm.value.sPRNVendorContact,
          sPRNVendorPhone: this.addPRForm.value.sPRNVendorPhone,
          sPRNVendorFax: this.addPRForm.value.sPRNVendorFax,
          sPRNVendorAddress: this.addPRForm.value.sPRNVendorAddress,
          sPRNNotes: this.addPRForm.value.sPRNNotes,
          bPRNManagerApprovalNeeded: false,
          bPRNPresidentApprovalNeeded: false,
          dtPRNFinalApprovalDate: new Date(),
          nExtendedTotal: this.addPRForm.value.nExtendedTotal,
          nExtendedTotalWithTaxes: this.addPRForm.value.nExtendedTotalWithTaxes,
          nPRNApproverCode: this.addPRForm.value.nPRNApproverCode,
          sApprovelComment: this.addPRForm.value.sApprovelComment,
          sUpdatedBy: this.addPRForm.value.sUpdatedBy,
          dtUpdatedOn: new Date(),
          sPRNApproverUserName: this.addPRForm.value.sPRNApproverUserName
        }
        if (approver.bActiveStatus == true) {
          this._prService.addPurchaseRequisition(addpurchasereq).subscribe({
            next: (val: any) => {
              this.toaster.success('New PR Added Successfully!')
              this.router.navigate(['/PurchaseRequisition']);
            },
            error: (err: any) => {
              console.error(err);
            }
          });
        } else {
          this.toaster.warning('This user is not active.');
        }
      }
    }
  }
  // Get All Data Purchase Requisition
  getPurchaseRequisitionList() {
    this._prService.getPurchaseRequisitionList().subscribe({
      next: (result) => {
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // Delete Purchase Requisition Line Item
  deletePurchaseRequisitionLineItem(nID: any) {
    if (confirm('Do You really want to delete this record ?')) {
      this._prService.deletePurchaseRequisitionLineItem(nID).subscribe({
        next: (res) => {
          this.toaster.error('Purchase Requisition Line Item deleted has been Successfully!')
          this.getPurchaseRequisitionLineItemList();
        },
        error: console.log,
      });
    }
  }

  // Get  PurchaseRequisition Line Item List
  getPurchaseRequisitionLineItemList() {
    this._prService.getPurchaseRequisitionLineItemList(this.prnid || 0).subscribe({
      next: (result) => {
        let ExtendedCostTotal = 0.00
        let TotalExtendedCostwithTaxes = 0.00
        this.prLineItem = result;
        result.forEach((element: any) => {
          ExtendedCostTotal += element.nExtendedCost;
          TotalExtendedCostwithTaxes += element.nExtendedCostwithTaxes
        });
        this.addPRForm.get('nExtendedTotal')?.setValue(ExtendedCostTotal);
        this.addPRForm.get('nExtendedTotalWithTaxes')?.setValue(TotalExtendedCostwithTaxes);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  //  Purchase Requisition Line Item 
  openAddForm() {
    let data = {
      nPRNID: this.prnid,
      nID: 0,
      sAccountCode: this.sAccountCode,
      sDepartmentCode: this.sDepartmentCode,
      sPartNo: '',
      sPartDescription: '',
      nUnitCost: '',
      nQuantity: '',
      nExtendedCost: '',
      nTaxes: '',
      nExtendedCostwithTaxes: '',
      sUpdatedBy: '',
      dtUpdatedOn: new Date()
    }
  }

  // Only Number Input box  start
  OnlyNumberAllowed(event: { which: any; keyCode: any; }): boolean {
    const charcode = (event.which) ? event.which : event.keyCode;
    if (charcode > 31 && (charcode < 48 || charcode > 57)) {
      return false;
    }
    return true;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  // end


  // Term List Purpose for Bind Dropdown
  getTermList() {
    this._prService.getTermList().subscribe((data: any) => {
      this.TermList = data;
    })
  }

  // PRN Approval List Purpose for Bind Dropdown
  getPRNApproverList() {
    this._prService.getPRNApproverList().subscribe((data: any) => {
      this.PRNApproverList = data;
    })
  }

  // department List Purpose for Bind Dropdown
  getDepartmentList() {
    this._prService.getDepartmentList().subscribe((data: any) => {
      this.departmentList = data;
    })
  }

  // Account List Purpose for Bind Dropdown
  getAccountList() {
    this._prService.getAccountList().subscribe((data: any) => {
      this.accountList = data;
    })
  }

  // PRNID Purchase Requisition List By Id
  GetByPRNIDPurchaseRequisitionList() {
    this._prService.GetByPRNIDPurchaseRequisitionList().subscribe((res: any) => {
      this.newPRNIDNo = res.nPRNID;
    })
  }
  //  validation work
  get PRNDeliverTo() {
    return this.addPRForm.get('sPRNDeliverTo') as FormControl
  }

  get PRNProject() {
    return this.addPRForm.get('sPRNProject') as FormControl
  }
  get PRNDateRequired() {
    return this.addPRForm.get('dtPRNDateRequired') as FormControl
  }

  get PartDescription() {
    return this.prLineItemForm.get('sPartDescription') as FormControl
  }

  get Quantity() {
    return this.prLineItemForm.get('nQuantity') as FormControl
  }

  get nUnitCost() {
    return this.prLineItemForm.get('nUnitCost') as FormControl
  }

  
}
