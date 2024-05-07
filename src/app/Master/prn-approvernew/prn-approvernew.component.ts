import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { ToastrService } from 'ngx-toastr';
import { prnApprover } from 'src/app/models/Masters/prnapprover';
import { PRServicesService } from 'src/app/service/prservices.service';

@Component({
  selector: 'app-prn-approvernew',
  templateUrl: './prn-approvernew.component.html',
  styleUrls: ['./prn-approvernew.component.css']
})
export class PrnApprovernewComponent {

  submitted = false;
  azureDataSource: any = [];
  searchText = '';
  prnApproverForm!: FormGroup;
  objprnApprover: prnApprover = new prnApprover();
  prnApprovers: prnApprover[] = [];
  nPRNApproverCode: number = 0;
  @ViewChild('closeButton') closeButton!: ElementRef<any>;
  public errorMessage: string = '';
  public lblModalHeader: string = 'Create prn Approver';
  public lblBtn: string = 'save';
  constructor(private fb: FormBuilder, private _prService: PRServicesService, private authService: MsalService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.prnApproverForm = this.fb.group({
      nPRNApproverCode: [0],
      sPRNApproverName: ['', Validators.required],
      sPRNApproverUserName: ['',[Validators.required, Validators.email,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      bActiveStatus: [false],
      sUpdatedby: ['']
    });
    this.getPRNApproverList();
    this.getClaims(this.authService.instance.getActiveAccount()?.idTokenClaims);
    this.prnApproverForm.patchValue({
      sUpdatedby: this.azureDataSource.name
    });
  }

  //Get all employees
  public getPRNApproverList() {
    this._prService.getPRNApproverList().subscribe((respData: any) => {
      if (respData.length > 0) {
        this.prnApprovers = respData;
        //console.log('=============>', this.prnApprovers)
      }
    });
  }

  

  //Insert/Update prn Approver
  onSubmit(): void {
    this.submitted = true;
    this.objprnApprover.nPRNApproverCode = this.prnApproverForm.value.sPRNApproverCode;
    this.objprnApprover.sPRNApproverName = this.prnApproverForm.value.sPRNApproverName;
    this.objprnApprover.sPRNApproverUserName = this.prnApproverForm.value.sPRNApproverUserName;
    this.objprnApprover.bActiveStatus = this.prnApproverForm.value.bActiveStatus;
    this.objprnApprover.sUpdatedby = this.prnApproverForm.value.sUpdatedby;

    if (this.nPRNApproverCode > 0) {
      this._prService.updatePRNApprover(this.nPRNApproverCode, this.objprnApprover).subscribe((respData: any) => {
        if (respData != null) {
          this.clearData();
          this.getPRNApproverList();
          this.closeButton.nativeElement.click();
          this.toastr.success('PRN approval Updated successfully!');
        } else {
          this.errorMessage = 'Something went wrong!';
        }
      });
    } else {
      this._prService.addPRNApprover(this.objprnApprover).subscribe((respData: any) => {
        if (respData != null) {
          this.clearData();
          this.getPRNApproverList();
          this.closeButton.nativeElement.click();
          this.toastr.success('PRN approval added successfully!');
        } else {
          this.errorMessage = 'Something went wrong!';
        }
      });
    }
  }

  //Get prn Approver by Id
  public getByIDPRNApprover(nPRNApproverCode: string) {
    this._prService.getByIDPRNApprover(nPRNApproverCode).subscribe((respData: any) => {
      if (respData) {
        this.objprnApprover = respData;
      }
    });
  }

  //Edit prn Approver
  public edit(nPRNApproverCode: string) {
    this.lblModalHeader = 'Update PRN Approver';
    this.lblBtn = 'Update';
    this._prService.getByIDPRNApprover(nPRNApproverCode).subscribe((respData: any) => {
      //console.log('Edit data=>', respData?.dtUpdatedOn);
      this.nPRNApproverCode = respData?.nPRNApproverCode;
      if (respData) {
        this.prnApproverForm.patchValue({
          nPRNApproverCode: respData?.nPRNApproverCode,
          sPRNApproverName: respData?.sPRNApproverName,
          sPRNApproverUserName: respData?.sPRNApproverUserName,
          sUpdatedby: respData?.sUpdatedby,
          bActiveStatus: respData?.bActiveStatus
        });
      }
    });
  }

  public deletePRNApprover(nPRNApproverCode: string) {
    if (confirm('Do You really want to delete this record ?')) {
      this._prService.deletePRNApprover(nPRNApproverCode).subscribe((respData: any) => {
        if (respData == 'Record deleted successfully.') {
          this.toastr.error(respData);
          this.getPRNApproverList();
        } else {
          this.toastr.error(respData);
        }
      });
    }
  }

  //Clear controls after action
  clearData() {
    this.prnApproverForm.reset(
      {
        nPRNApproverCode: 0,
        sPRNApproverName: '',
        sPRNApproverUserName: '',
        sUpdatedby: this.azureDataSource.name,
        bActiveStatus: false
      }
    );
  }

  btnNew() {
    this.lblBtn = 'Save';
    this.lblModalHeader = 'Create prn Approver';
    this.nPRNApproverCode = 0;
  }

  getClaims(claims: any): string {
    this.azureDataSource = [
      { id: 1, claim: "Display Name", value: claims ? claims['name'] : null },
      { id: 2, claim: "User Email ID", value: claims ? claims['preferred_username'] : null },
    ];
    return this.azureDataSource = claims;
  }

  get PRNApproverName() {
    return this.prnApproverForm.get('sPRNApproverName') as FormControl
  }
  get PRNApproverUserName() {
    return this.prnApproverForm.get('sPRNApproverUserName') as FormControl
  }

  //get f() { return this.prnApproverForm.controls; }
 

  emailValidator(control: { value: string; }) {
    if (control.value) {
      const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      return matches ? null : { 'invalidEmail': true };
    } else {
      return null;
    }
  }

// Toaster work
  public showSuccess(): void {
    this.toastr.success('Added new PRN Approval Successfully!');
  }

  public showDelete(): void {
    this.toastr.error('Deleted PRN Approval Successfully!');
  }
}
