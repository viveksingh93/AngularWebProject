export class termNew {
    public sTermCode: string;
    public sTermName: string;
    public bActiveStatus: boolean;
    public sUpdatedBy: string;
    public dtUpdatedOn: Date;
    constructor() {
        this.sTermCode = '';
        this.sTermName = '';
        this.bActiveStatus = false;
        this.sUpdatedBy = '';
        this.dtUpdatedOn = new Date();
    }
  }

