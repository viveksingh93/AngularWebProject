export class AccountHead {
    public sAccountCode: string;
    public sAccountName: string;
    public sUpdatedBy: string;
    public bActiveStatus: boolean;
    public dtUpdatedOn: Date;
    constructor() {
        this.sAccountCode = '';
        this.sAccountName = '';
        this.sUpdatedBy = '';
        this.bActiveStatus = false;
        this.dtUpdatedOn = new Date();
    }
  }