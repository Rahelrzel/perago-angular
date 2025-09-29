import { State, Action, StateContext, Selector, ofActionSuccessful, ofActionErrored } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { EmployeeService } from '../service/employee.service';
import { User } from '../interface/user.interface';
import { throwError } from 'rxjs';
import { Employee } from '../interface/employee.interface';

// -------- ACTIONS --------
export class GetEmployeeHierarchy {
  static readonly type = '[Employee] Get Employee Hierarchy';
}

export class GetEmployeeHierarchySuccess {
  static readonly type = '[Employee] Get Employee Hierarchy Success';
  constructor(public payload: Employee[]) {}
}

export class GetEmployeeHierarchyFailure {
  static readonly type = '[Employee] Get Employee Hierarchy Failure';
  constructor(public payload: any) {}
}

export class FetchManagedEmployees {
  static readonly type = '[Employee] Fetch Managed Employees';
}


// -------- STATE MODEL --------
export interface EmployeeStateModel {
  employees: Employee[];
  managedEmployees: User[];
  loading: boolean;
  error: string | null;
}

// -------- STATE --------
@State<EmployeeStateModel>({
  name: 'employee',
  defaults: {
    employees: [],
    managedEmployees: [],
    loading: false,
    error: null,
  },
})
@Injectable()
export class EmployeeState {
  constructor(private employeeService: EmployeeService) {}

  // -------- SELECTORS --------
  @Selector()
  static employees(state: EmployeeStateModel): Employee[] {
    return state.employees;
  }

  @Selector()
  static isLoading(state: EmployeeStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: EmployeeStateModel): string | null {
    return state.error;
  }

  @Selector()
  static managedEmployees(state: EmployeeStateModel) {
    return state.managedEmployees;
  }

  // -------- ACTION HANDLERS --------

  @Action(GetEmployeeHierarchy)
  getEmployeeHierarchy(ctx: StateContext<EmployeeStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.employeeService.getEmployeeHierarchy().pipe(
      tap((employees: Employee[]) => {
        ctx.dispatch(new GetEmployeeHierarchySuccess(employees));
      }),
      catchError((error) => {
        ctx.dispatch(new GetEmployeeHierarchyFailure(error));
        return throwError(() => new Error(error));
      })
    );
  }

  @Action(GetEmployeeHierarchySuccess)
  getEmployeeHierarchySuccess(ctx: StateContext<EmployeeStateModel>, action: GetEmployeeHierarchySuccess) {
    ctx.patchState({ employees: action.payload, loading: false });
  }

  @Action(GetEmployeeHierarchyFailure)
  getEmployeeHierarchyFailure(ctx: StateContext<EmployeeStateModel>, action: GetEmployeeHierarchyFailure) {
    ctx.patchState({ error: action.payload, loading: false });
  }


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
