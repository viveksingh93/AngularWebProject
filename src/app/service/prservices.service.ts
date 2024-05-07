import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PRServicesService {
  [x: string]: any;

  //readonly url = 'https://localhost:44326/';
  readonly url = 'https://localhost:44373/';
  

  constructor(private _http: HttpClient) { }

  //#region   Account
  getAccountList(): Observable<any> {
    return this._http.get('https://localhost:44373/api/AccountHead/GetAll');
  }

  getByIDAccount(sAccountCode:string){
    return this._http.get( this.url + `api/AccountHead/GetbyId?sAccountCode=${sAccountCode}`);
  }

  addAccount(data: any): Observable<any> {
    return this._http.post(this.url + 'api/AccountHead/Add', data, { responseType: 'text' });
  }
  updateAccount(sAccountCode: number, data: any): Observable<any> {
    return this._http.put(this.url + `api/AccountHead/Update?sAccountCode=${sAccountCode}`, data, { responseType: 'text' });
  }

  deleteAccount(sAccountCode: string): Observable<any> {
    return this._http.delete(this.url + `api/AccountHead/Delete?sAccountCode=${sAccountCode}`, { responseType: 'text' });
  }
  //#endregion

  //#region   Department
  getDepartmentList(): Observable<any> {
    return this._http.get(this.url + 'api/Department/GetAll');
  }

  getByIDDepartment(sDepartmentCode:string){
    return this._http.get( this.url + `api/Department/GetbyId?sDepartmentCode=${sDepartmentCode}`);
  }

  addDepartment(data: any): Observable<any> {
    return this._http.post(this.url + 'api/Department/Add', data, { responseType: 'text' });
  }

  updateDepartment(sDepartmentCode: number, data: any): Observable<any> {
    return this._http.put(this.url + `api/Department/Update?sDepartmentCode=${sDepartmentCode}`, data, { responseType: 'text' });
  }

  deleteDepartment(sDepartmentCode: string): Observable<any> {
    return this._http.delete(this.url + `api/Department/Delete?sDepartmentCode=${sDepartmentCode}`, { responseType: 'text' });
  }
  //#endregion

  //#region    Term
  getTermList(): Observable<any> {

    return this._http.get(this.url + 'api/Term/GetAll');
  }

  getByTermID(sTermCode:string){

    return this._http.get( this.url + `api/Term/GetbyId?sTermCode=${sTermCode}`);
  }

  addTerm(data: any): Observable<any> {
    return this._http.post(this.url + 'api/Term/Add', data, { responseType: 'text' });
  }

  updateTerm(sTermCode: number, data: any): Observable<any> {
    return this._http.put(this.url + `api/Term/Update?sTermCode=${sTermCode}`, data, { responseType: 'text' });
  }

  deleteTerm(sTermCode: string): Observable<any> {

    return this._http.delete(this.url + `api/Term/Delete?sTermCode=${sTermCode}`, { responseType: 'text' });
  }
  //#endregion

  //#region PurchaseRequisition

  getPurchaseRequisitionList(): Observable<any> {
    return this._http.get(this.url + 'api/PurchaseRequisition/GetAll');
  }

  GetByPRNIDPurchaseRequisitionList(): Observable<any> {
    return this._http.get(this.url + 'api/PurchaseRequisition/GetByPRNID');
  }

  addPurchaseRequisition(data: any): Observable<any> {
    return this._http.post(this.url + 'api/PurchaseRequisition/Add', data, { responseType: 'text' });
  }

  updatePurchaseRequisition( nPRNID: number, data: any): Observable<any> {
    return this._http.put(this.url + `api/PurchaseRequisition/Update?nPRNID${nPRNID}`, data, { responseType: 'text' });
  }

  deletePurchaseRequisition(nPRNID: number): Observable<any> {
    return this._http.delete(this.url + `api/PurchaseRequisition/Delete?nPRNID=${nPRNID}`, { responseType: 'text' });
  }
  
  getbyIDPurchaseRequisition(nPRNID:number){

    return this._http.get( `${this.url}api/PurchaseRequisition/GetbyId?nPRNID=${nPRNID}`);
  }
  //#endregion

  //#region PurchaseRequisitionLineItem

  getPurchaseRequisitionLineItemList(nPRNID: any): Observable<any> {
    return this._http.get(this.url + `api/PurchaseRequisitionLineItem/GetAll?nPRNID=${nPRNID}`);
  }

  getByIdPurchaseRequisitionLineItem(nID:number){
    return this._http.get( this.url + `api/PurchaseRequisitionLineItem/GetbyId?nID=${nID}`);
  }

  addPurchaseRequisitionLineItem(data: any): Observable<any> {
    return this._http.post(this.url + 'api/PurchaseRequisitionLineItem/Add', data, { responseType: 'text' });
  }

  updatePurchaseRequisitionLineItem(nID: number, data: any): Observable<any> {
    return this._http.put(this.url + `api/PurchaseRequisitionLineItem/Update?nID=${nID}`, data, { responseType: 'text' });
  }

  deletePurchaseRequisitionLineItem(nID: number): Observable<any> {
    return this._http.delete(this.url + `api/PurchaseRequisitionLineItem/Delete?nID=${nID}`, { responseType: 'text' });
  }

  //#endregion

  //#region PRN Approver

  

  getPRNApproverList(): Observable<any> {
    return this._http.get(this.url + 'api/PRNApprover/GetAll');
  }

  getByIDPRNApprover(nPRNApproverCode:string){
    return this._http.get( this.url + `api/PRNApprover/GetbyId?nPRNApproverCode=${nPRNApproverCode}`);
  }

  addPRNApprover(data: any): Observable<any> {
    return this._http.post(this.url + 'api/PRNApprover/Add', data, { responseType: 'text' });
  }

  updatePRNApprover(nPRNApproverCode: number, data: any): Observable<any> {
    return this._http.put(this.url + `api/PRNApprover/Update?nPRNApproverCode=${nPRNApproverCode}`, data, { responseType: 'text' });
  }

  deletePRNApprover(nPRNApproverCode: string): Observable<any> {
    return this._http.delete(this.url + `api/PRNApprover/Delete?nPRNApproverCode=${nPRNApproverCode}`, { responseType: 'text' });
  }

  //#endregion

}
