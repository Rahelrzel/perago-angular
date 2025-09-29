import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { EmployeeService, Role } from '../service/employee.service';
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

export class GetRoles {
  static readonly type = '[Employee] Get Roles';
}

export class GetRolesSuccess {
  static readonly type = '[Employee] Get Roles Success';
  constructor(public payload: Role[]) {}
}

export class GetRolesFailure {
  static readonly type = '[Employee] Get Roles Failure';
  constructor(public payload: any) {}
}

export class AddEmployee {
  static readonly type = '[Employee] Add Employee';
  constructor(public payload: any) {}
}

export class AddEmployeeSuccess {
  static readonly type = '[Employee] Add Employee Success';
}

export class AddEmployeeFailure {
  static readonly type = '[Employee] Add Employee Failure';
  constructor(public payload: any) {}
}

export class DeleteEmployee {
  static readonly type = '[Employee] Delete Employee';
  constructor(public payload: string) {}
}

export class DeleteEmployeeSuccess {
  static readonly type = '[Employee] Delete Employee Success';
}

export class DeleteEmployeeFailure {
  static readonly type = '[Employee] Delete Employee Failure';
  constructor(public payload: any) {}
}

// -------- STATE MODEL --------
export interface EmployeeStateModel {
  employees: Employee[];
  managedEmployees: User[];
  roles: Role[];
  loading: boolean;
  error: string | null;
}

// -------- STATE --------
@State<EmployeeStateModel>({
  name: 'employee',
  defaults: {
    employees: [],
    managedEmployees: [],
    roles: [],
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
  static managedEmployees(state: EmployeeStateModel): User[] {
    return state.managedEmployees;
  }

  @Selector()
  static roles(state: EmployeeStateModel): Role[] {
    return state.roles;
  }

  @Selector()
  static isLoading(state: EmployeeStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: EmployeeStateModel): string | null {
    return state.error;
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

  @Action(GetRoles)
  getRoles(ctx: StateContext<EmployeeStateModel>) {
    return this.employeeService.getRoles().pipe(
      tap((roles: Role[]) => {
        ctx.dispatch(new GetRolesSuccess(roles));
      }),
      catchError((error) => {
        ctx.dispatch(new GetRolesFailure(error));
        return throwError(() => new Error(error));
      })
    );
  }

  @Action(GetRolesSuccess)
  getRolesSuccess(ctx: StateContext<EmployeeStateModel>, action: GetRolesSuccess) {
    ctx.patchState({ roles: action.payload });
  }

  @Action(GetRolesFailure)
  getRolesFailure(ctx: StateContext<EmployeeStateModel>, action: GetRolesFailure) {
    ctx.patchState({ error: action.payload });
  }

  @Action(AddEmployee)
  addEmployee(ctx: StateContext<EmployeeStateModel>, action: AddEmployee) {
    return this.employeeService.addEmployee(action.payload).pipe(
      tap(() => {
        ctx.dispatch(new AddEmployeeSuccess());
        ctx.dispatch(new FetchManagedEmployees());
      }),
      catchError((error) => {
        ctx.dispatch(new AddEmployeeFailure(error));
        return throwError(() => new Error(error));
      })
    );
  }

  @Action(DeleteEmployee)
  deleteEmployee(ctx: StateContext<EmployeeStateModel>, action: DeleteEmployee) {
    return this.employeeService.deleteEmployee(action.payload).pipe(
      tap(() => {
        ctx.dispatch(new DeleteEmployeeSuccess());
        ctx.dispatch(new FetchManagedEmployees());
      }),
      catchError((error) => {
        ctx.dispatch(new DeleteEmployeeFailure(error));
        return throwError(() => new Error(error));
      })
    );
  }
}
