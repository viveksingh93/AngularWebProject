import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Department } from 'src/app/models/Masters/Department';
import { PRServicesService } from 'src/app/service/prservices.service';

@Component({
  selector: 'app-departmentnew',
  templateUrl: './departmentnew.component.html',
  styleUrls: ['./departmentnew.component.css']
})
export class DepartmentnewComponent {

  searchText = ''
  azureDataSource: any = [];
  departmentForm!: FormGroup;
  objdepartment: Department = new Department();
  Departments: Department[] = [];
  sDepartmentCode: number = 0;
  @ViewChild('closeButton') closeButton!: ElementRef<any>;
  public errorMessage: string = '';
  public lblModalHeader: string = 'Create prn Approver';
  public lblBtn: string = 'Save';
  constructor(private fb: FormBuilder, private _prService: PRServicesService, private authService: MsalService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.departmentForm = this.fb.group({
      sDepartmentCode: ['', Validators.required],
      sDepartmentName: ['', Validators.required],
      sUpdatedBy: [''],
      bActiveStatus: [false],
      dtUpdatedOn: ['']
    });
    this.getDepartmentList();
    this.getClaims(this.authService.instance.getActiveAccount()?.idTokenClaims);
    this.departmentForm.patchValue({
      sUpdatedBy: this.azureDataSource.name
    });
  }

  //Get all employees
  public getDepartmentList() {
    this._prService.getDepartmentList().subscribe((respData: any) => {
      if (respData.length > 0) {
        this.Departments = respData;
      }
    });
  }

  //Insert/Update Term
  onSubmit(): void {
    this.objdepartment.sDepartmentCode = this.departmentForm.value.sDepartmentCode;
    this.objdepartment.sDepartmentName = this.departmentForm.value.sDepartmentName;
    this.objdepartment.sUpdatedBy = this.departmentForm.value.sUpdatedBy;
    this.objdepartment.bActiveStatus = this.departmentForm.value.bActiveStatus;

    if (this.sDepartmentCode > 0) {

      this.objdepartment.sDepartmentCode = this.departmentForm.value.sDepartmentCode;
      this._prService.updateDepartment(this.sDepartmentCode, this.objdepartment).subscribe((respData: any) => {
        if (respData != null) {
          this.clearData();
          this.getDepartmentList();
          this.closeButton.nativeElement.click();
          this.toastr.success('Department updated successfully!');
        } else {
          this.errorMessage = 'Something went wrong!';
        }
      });
    } else {
      this._prService.addDepartment(this.objdepartment).subscribe((respData: any) => {
        if (respData != null) {
          this.clearData();
          this.getDepartmentList();
          this.closeButton.nativeElement.click();
          this.toastr.success('Department added successfully!');
        } else {
          this.errorMessage = 'Something went wrong!';
        }
      });
    }
  }

  //Get Department by Id
  public getByIDDepartment(sDepartmentCode: string) {
    this._prService.getByIDDepartment(sDepartmentCode).subscribe((respData: any) => {
      if (respData) {
        this.objdepartment = respData;
      }
    });
  }

  //Edit departmentForm
  public edit(sDepartmentCode: string) {
    this.lblModalHeader = 'Update Account';
    this.lblBtn = 'Update';
    this._prService.getByIDDepartment(sDepartmentCode).subscribe((respData: any) => {

      this.sDepartmentCode = respData?.sDepartmentCode;
      if (respData) {
        this.departmentForm.patchValue({
          sDepartmentCode: respData?.sDepartmentCode,
          sDepartmentName: respData?.sDepartmentName,
          sUpdatedBy: respData?.sUpdatedBy,
          bActiveStatus: respData?.bActiveStatus
        });
      }
    });
  }

  //Delete departmentForm
  public deleteDepartment(sDepartmentCode: string) {
    if (confirm('Do You really want to delete this record ?')) {
      this._prService.deleteDepartment(sDepartmentCode).subscribe((respData: any) => {
        if (respData == 'Record deleted successfully.') {
          this.toastr.error(respData);
          this.getDepartmentList();
        } else {
          this.toastr.error(respData);
        }
      });
    }
    else {
      this.toastr.error('This Department is deleted because athe already use!')
    }
  }

  //Clear controls after action
  clearData() {
    this.departmentForm.reset(
      {
        sDepartmentCode: '',
        sDepartmentName: '',
        sUpdatedBy: this.azureDataSource.name,
        bActiveStatus: false
      }
    );
  }

  btnNew() {
    this.lblBtn = 'Save';
    this.lblModalHeader = 'Create departmentForm';
    this.sDepartmentCode = 0;
  }

  getClaims(claims: any): string {
    this.azureDataSource = [
      { id: 1, claim: "Display Name", value: claims ? claims['name'] : null },
      { id: 2, claim: "User Email ID", value: claims ? claims['preferred_username'] : null },
    ];
    return this.azureDataSource = claims;
  }

  get DepartmentCode() {
    return this.departmentForm.get('sDepartmentCode') as FormControl
  }
  get DepartmentName() {
    return this.departmentForm.get('sDepartmentName') as FormControl
  }

  // Toaster work
  public showSuccess(): void {
    this.toastr.success('Added new department Successfully!');
  }

  public showDelete(): void {
    this.toastr.error('Deleted department Successfully!');
  }

}
