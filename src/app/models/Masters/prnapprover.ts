export class prnApprover {
    public nPRNApproverCode: string;
    public sPRNApproverName: string;
    public sPRNApproverUserName: string;
    public bActiveStatus: boolean;
    public sUpdatedby: string;
    public dtUpdatedOn: Date;
    constructor() {
        this.nPRNApproverCode = '';
        this.sPRNApproverName = '';
        this.sPRNApproverUserName = '';
        this.bActiveStatus = false;
        this.sUpdatedby = '';
        this.dtUpdatedOn = new Date();
    }
  }