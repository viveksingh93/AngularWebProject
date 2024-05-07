import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { ToastrService } from 'ngx-toastr';
import { termNew } from 'src/app/models/Masters/Termnew';
import { PRServicesService } from 'src/app/service/prservices.service';

@Component({
  selector: 'app-termnew',
  templateUrl: './termnew.component.html',
  styleUrls: ['./termnew.component.css']
})
export class TermnewComponent {

  searchText='';

  azureDataSource: any = [];
  termnewForm!: FormGroup;
  objtermnew: termNew = new termNew();
  termnew: termNew[] = [];
  sTermCode: number = 0;
  @ViewChild('closeButton') closeButton!: ElementRef<any>;
  public errorMessage: string = '';
  public lblModalHeader: string = 'Create Term';
  public lblBtn: string = 'Save';
  constructor(private fb: FormBuilder, private _termnewService: PRServicesService, private authService: MsalService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.termnewForm = this.fb.group({
      sTermCode: ['', Validators.required],
      sTermName: ['', Validators.required],
      bActiveStatus: [false],
      sUpdatedBy: ['']
    });
    this.getTermList();
    this.getClaims(this.authService.instance.getActiveAccount()?.idTokenClaims);
    this.termnewForm.patchValue({
      sUpdatedBy: this.azureDataSource.name
    });
  }

  //Get all employees
  public getTermList() {
    this._termnewService.getTermList().subscribe((respData: any) => {
      if (respData.length > 0) {
        this.termnew = respData;
      }
    });
  }

  //Insert/Update Term
  onSubmit(): void {
    this.objtermnew.sTermCode = this.termnewForm.value.sTermCode;
    this.objtermnew.sTermName = this.termnewForm.value.sTermName;
    this.objtermnew.bActiveStatus = this.termnewForm.value.bActiveStatus;
    this.objtermnew.sUpdatedBy = this.termnewForm.value.sUpdatedBy;

    if (this.sTermCode > 0) {
      this._termnewService.updateTerm(this.sTermCode, this.objtermnew).subscribe((respData: any) => {
        if (respData != null) {
          this.clearData();
          this.getTermList();
          this.closeButton.nativeElement.click();
          this.toastr.success('Term Updated successfully!');
        } else {
          this.errorMessage = 'Something went wrong!';
        }
      });
    } else {
      this._termnewService.addTerm(this.objtermnew).subscribe((respData: any) => {
        if (respData != null) {
          this.clearData();
          this.getTermList();
          this.closeButton.nativeElement.click();
          this.toastr.success('Term added successfully!');
        } else {
          this.errorMessage = 'Something went wrong!';
        }
      });
    }
  }

  //Get Term by Id
  public getByTermID(sTermCode: string) {
    this._termnewService.getByTermID(sTermCode).subscribe((respData: any) => {
      if (respData) {
        this.objtermnew = respData;
      }
    });
  }

  //Edit Term
  public edit(sTermCode: string) {
    this.lblModalHeader = 'Update Term';
    this.lblBtn = 'Update';
    this._termnewService.getByTermID(sTermCode).subscribe((respData: any) => {
      console.log('Edit data=>', respData?.dtUpdatedOn);
      this.sTermCode = respData?.sTermCode;
      if (respData) {
        this.termnewForm.patchValue({
          sTermCode: respData?.sTermCode,
          sTermName: respData?.sTermName,
          bActiveStatus: respData?.bActiveStatus,
          sUpdatedBy: respData?.sUpdatedBy
        });
      }
    });
  }

  //Delete Term
  public deleteTerm(sTermCode: string) {
    if (confirm('Do You really want to delete this record ?')) {
      this._termnewService.deleteTerm(sTermCode).subscribe((respData: any) => {
        if (respData == 'Record deleted successfully.') {
          this.toastr.error(respData);
          this.getTermList();
        } else {
          this.toastr.error(respData);
        }
      });
    }
  }

  //Clear controls after action
  clearData() {

    //this.termnewForm.reset();
    this.termnewForm.reset(
      {
        sTermCode: '',
        sTermName: '',
        bActiveStatus: false,
        sUpdatedBy: this.azureDataSource.name
      }
    );
  }

  btnNew() {
    this.lblBtn = 'Save';
    this.lblModalHeader = 'Create Term';
    this.sTermCode = 0;
  }

  getClaims(claims: any): string {
    this.azureDataSource = [
      { id: 1, claim: "Display Name", value: claims ? claims['name'] : null },
      { id: 2, claim: "User Email ID", value: claims ? claims['preferred_username'] : null },
    ];
      return this.azureDataSource = claims;
  }

  get TermCode() {
    return this.termnewForm.get('sTermCode') as FormControl
  }
  get TermName() {
    return this.termnewForm.get('sTermName') as FormControl
  }

// Toaster work
  public showSuccess(): void {
    this.toastr.success('Save new Term Successfully!');
  }

  public showDelete(): void {
    this.toastr.error('Deleted Term Successfully!');
  }
}