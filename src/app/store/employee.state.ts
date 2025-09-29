import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { EmployeeService } from '../service/employee.service';
import { User } from '../interface/user.interface';

// -------- ACTIONS --------
export class FetchManagedEmployees {
  static readonly type = '[Employee] Fetch Managed Employees';
}

// -------- STATE MODEL --------
export interface EmployeeStateModel {
  managedEmployees: User[];
}

// -------- STATE --------
@State<EmployeeStateModel>({
  name: 'employee',
  defaults: {
    managedEmployees: [],
  },
})
@Injectable()
export class EmployeeState {
  constructor(private employeeService: EmployeeService) {}

  // -------- SELECTORS --------
  @Selector()
  static managedEmployees(state: EmployeeStateModel) {
    return state.managedEmployees;
  }

  // -------- ACTION HANDLERS --------
  @Action(FetchManagedEmployees)
  fetchManagedEmployees(ctx: StateContext<EmployeeStateModel>) {
    return this.employeeService.getManagedEmployees().pipe(
      tap((employees: User[]) => {
        ctx.patchState({
          managedEmployees: employees,
        });
      })
    );
  }
}
