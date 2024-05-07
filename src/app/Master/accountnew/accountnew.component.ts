import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { AccountHead } from 'src/app/models/Masters/Account';
import { PRServicesService } from 'src/app/service/prservices.service';
import { CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-accountnew',
  templateUrl: './accountnew.component.html',
  styleUrls: ['./accountnew.component.css']
})
export class AccountnewComponent {

  invoiceno: any;
  searchText = '';
  azureDataSource: any = [];
  AccountHeadForm!: FormGroup;
  objAccountHead: AccountHead = new AccountHead();

  AccountHeads: AccountHead[] = [];
  sAccountCode: number = 0;
  @ViewChild('closeButton') closeButton!: ElementRef<any>;
  public errorMessage: string = '';
  public lblModalHeader: string = 'Create prn Approver';
  public lblBtn: string = 'Save';
  constructor(private fb: FormBuilder, private _prService: PRServicesService, private authService: MsalService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.AccountHeadForm = this.fb.group({
      sAccountCode: ['', Validators.required],
      sAccountName: ['', Validators.required],
      sUpdatedBy: [''],
      bActiveStatus: [false],
      dtUpdatedOn: ['']
    });
    this.getAccountList();
    this.getClaims(this.authService.instance.getActiveAccount()?.idTokenClaims);
    this.AccountHeadForm.patchValue({
      sUpdatedBy: this.azureDataSource.name
    });
  }

  //Get all employees
  public getAccountList() {
    this._prService.getAccountList().subscribe((respData: any) => {
      if (respData.length > 0) {
        this.AccountHeads = respData;
      }
    });
  }

  //Insert/Update Account
  onSubmit(): void {
    this.objAccountHead.sAccountCode = this.AccountHeadForm.value.sAccountCode;
    this.objAccountHead.sAccountName = this.AccountHeadForm.value.sAccountName;
    this.objAccountHead.sUpdatedBy = this.AccountHeadForm.value.sUpdatedBy;
    this.objAccountHead.bActiveStatus = this.AccountHeadForm.value.bActiveStatus;
    if (this.sAccountCode > 0) {
      
      this._prService.updateAccount(this.sAccountCode, this.objAccountHead).subscribe((respData: any) => {
        if (respData != null) {
          this.clearData();
          this.getAccountList();
          this.closeButton.nativeElement.click();
          this.toastr.success('Account updated successfully!');
        } else {
          this.errorMessage = 'Something went wrong!';
        }
      });
    } else {
      this._prService.addAccount(this.objAccountHead).subscribe((respData: any) => {
        if (respData != null) {
          this.clearData();
          this.getAccountList();
          this.closeButton.nativeElement.click();
          this.toastr.success('Account added successfully!');
        } else {
          this.errorMessage = 'Something went wrong!';
        }
      });
    }
  }

  //Get Account by Id
  public getByIDAccount(sAccountCode: string) {
    this._prService.getByIDAccount(sAccountCode).subscribe((respData: any) => {
      if (respData) {
        this.objAccountHead = respData;
      }
    });
  }

  //Edit Account
  public edit(sAccountCode: string) {
    this.lblModalHeader = 'Update Account';
    this.lblBtn = 'Update';
    this._prService.getByIDAccount(sAccountCode).subscribe((respData: any) => {
      console.log('Edit data=>', respData?.dtUpdatedOn);
      this.sAccountCode = respData?.sAccountCode;
      if (respData) {
        this.AccountHeadForm.patchValue({
          sAccountCode: respData?.sAccountCode,
          sAccountName: respData?.sAccountName,
          sUpdatedBy: respData?.sUpdatedBy,
          bActiveStatus: respData?.bActiveStatus
        });
      }
    });
  }

  public deleteAccount(sAccountCode: string) {
    if (confirm('Do You really want to delete this record ?')) {
      this._prService.deleteAccount(sAccountCode).subscribe((respData: any) => {
        if (respData == 'Record deleted successfully.') {
          this.toastr.error(respData);
          this.getAccountList();
        } else {
          this.toastr.error(respData);
        }
      });
    }
  }

  //Clear controls after action
  clearData() {
    this.AccountHeadForm.reset(
      {
        sAccountCode: '',
        sAccountName: '',
        sUpdatedBy: this.azureDataSource.name,
        bActiveStatus: false
      }
    );
  }

  btnNew() {
    this.lblBtn = 'Save';
    this.lblModalHeader = 'Create Account';
    this.sAccountCode = 0;
  }

  getClaims(claims: any): string {
    this.azureDataSource = [
      { id: 1, claim: "Display Name", value: claims ? claims['name'] : null },
      { id: 2, claim: "User Email ID", value: claims ? claims['preferred_username'] : null },
    ];
    return this.azureDataSource = claims;
  }

  get AccountCode() {
    return this.AccountHeadForm.get('sAccountCode') as FormControl
  }
  get AccountName() {
    return this.AccountHeadForm.get('sAccountName') as FormControl
  }

  dragStarted(event: CdkDragStart) {
    console.log('Drag started!', event.source);
  }

  dragEnded(event: CdkDragEnd) {
    console.log('Drag ended!', event.source);
  }

  // Toaster work
  public showSuccess(): void {
    this.toastr.success('Added new Account Successfully!');
  }

  public showDelete(): void {
    this.toastr.error('Deleted Account Successfully!');
  }

  downloadAccount(sAccountCode: any){
    this._prService.getByIDAccount(sAccountCode).subscribe(res => {
      // let blob: Blob = res.body as Blob;
      // let url = window.URL.createObjectURL(blob);

      let a = document.createElement('a');
      a.download = this.invoiceno;
      // a.href = url;
      a.click();

    });
  }
}


