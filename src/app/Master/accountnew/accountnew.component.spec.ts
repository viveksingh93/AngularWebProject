import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountnewComponent } from './accountnew.component';

describe('AccountnewComponent', () => {
  let component: AccountnewComponent;
  let fixture: ComponentFixture<AccountnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountnewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
