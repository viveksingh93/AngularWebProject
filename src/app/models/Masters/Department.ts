export class Department {
    public sDepartmentCode: string;
    public sDepartmentName: string;
    public sUpdatedBy: string;
    public bActiveStatus: boolean;
    public dtUpdatedOn: Date;
    constructor() {
        this.sDepartmentCode = '';
        this.sDepartmentName = '';
        this.sUpdatedBy = '';
        this.bActiveStatus = false;
        this.dtUpdatedOn = new Date();
    }
  }