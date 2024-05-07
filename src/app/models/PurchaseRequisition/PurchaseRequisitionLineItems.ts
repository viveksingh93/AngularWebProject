export class PurchaseRequisitionLineItems {
    public nID: number;
    public nPRNID: number;
    public sAccountCode: string;
    public sAccountName: string;
    public sDepartmentCode: string;
    public sDepartmentName: string;
    public sPartNo: string;
    public sPartDescription: string;
    public nQuantity: any;
    public nUnitCost: any;
    public nExtendedCost: any;
    public nTaxes: any;
    public nExtendedCostwithTaxes: any;
    public sUpdatedBy: string;
    public dtUpdatedOn: Date;
    constructor() {
        this.nID = 0;
        this.nPRNID = 0;
        this.sAccountCode = '';
        this.sAccountName = '';
        this.sDepartmentCode = '';
        this.sDepartmentName = '';
        this.sPartNo = '';
        this.sPartDescription = '';
        this.nQuantity = '';
        this.nUnitCost = '';
        this.nExtendedCost = '';
        this.nTaxes = '';
        this.nExtendedCostwithTaxes = '';
        this.sUpdatedBy = '';
        this.dtUpdatedOn = new Date();
    }
  }

  export class PurchaseRequisitionLineItemsRequest {
    public nID: number;
    public nPRNID: number;
    public sAccountCode: string;
    public sDepartmentCode: string;
    public sPartNo: string;
    public sPartDescription: string;
    public nQuantity: any;
    public nUnitCost: any;
    public nExtendedCost: any;
    public nTaxes: any;
    public nExtendedCostwithTaxes: any;
    public sUpdatedBy: string;
    constructor() {
        this.nID = 0;
        this.nPRNID = 0;
        this.sAccountCode = '';
        this.sDepartmentCode = '';
        this.sPartNo = '';
        this.sPartDescription = '';
        this.nQuantity = '';
        this.nUnitCost = '';
        this.nExtendedCost = '';
        this.nTaxes = '';
        this.nExtendedCostwithTaxes = '';
        this.sUpdatedBy = '';
    }
  }