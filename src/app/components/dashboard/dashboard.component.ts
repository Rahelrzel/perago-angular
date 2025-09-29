  import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzTreeNodeOptions, NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { Store, Select, Actions, ofActionSuccessful, ofActionErrored } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GetEmployeeHierarchy, EmployeeState, AddEmployeeSuccess, DeleteEmployeeSuccess, GetEmployeeHierarchySuccess, GetEmployeeHierarchyFailure } from '../../store/employee.state';
import { Employee } from '../../interface/employee.interface';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @Select(EmployeeState.employees) employees$!: Observable<Employee[]>;
  @Select(EmployeeState.isLoading) isLoading$!: Observable<boolean>;
  @Select(EmployeeState.error) error$!: Observable<string | null>;

  employeeHierarchy: NzTreeNodeOptions[] = [];
  private employees: Employee[] = [];
  private destroy$ = new Subject<void>();

  drawerVisible = false;
  selectedEmployee: Employee | null = null;

  constructor(private store: Store, private actions$: Actions, private message: NzMessageService) { }

  ngOnInit(): void {
    this.employees$.pipe(take(1)).subscribe(employees => {
      if (employees.length === 0) {
        this.store.dispatch(new GetEmployeeHierarchy());
      }
    });

    this.employees$.pipe(takeUntil(this.destroy$)).subscribe(employees => {
      this.employees = employees;
      this.employeeHierarchy = this.transformToNzTreeNodes(employees);
    });

    this.actions$.pipe(
      ofActionSuccessful(AddEmployeeSuccess, DeleteEmployeeSuccess),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.store.dispatch(new GetEmployeeHierarchy());
    });

    this.actions$.pipe(ofActionSuccessful(GetEmployeeHierarchySuccess), takeUntil(this.destroy$)).subscribe(() => {
      this.message.success('Employee hierarchy loaded successfully');
    });

    this.actions$.pipe(ofActionErrored(GetEmployeeHierarchyFailure), takeUntil(this.destroy$)).subscribe((err) => {
      this.message.error(err.payload.message || 'Failed to load employee hierarchy');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  transformToNzTreeNodes(employees: Employee[]): NzTreeNodeOptions[] {
    return employees.map(employee => ({
      title: `${employee.firstName} ${employee.lastName}`,
      key: employee.id,
      role: employee.role.name, // Add role to the node data
      children: employee.children ? this.transformToNzTreeNodes(employee.children) : [],
      isLeaf: !employee.children || employee.children.length === 0
    }));
  }

  isCollapsed = false;
  currentYear = new Date().getFullYear();

  onSelect(event: NzFormatEmitEvent): void {
    if (event.node) {
      const employee = this.findEmployee(this.employees, event.node.key);
      if (employee) {
        this.selectedEmployee = employee;
        this.drawerVisible = true;
      }
    }
  }

  private findEmployee(employees: Employee[], key: string): Employee | null {
    for (const employee of employees) {
      if (employee.id === key) {
        return employee;
      }
      if (employee.children) {
        const found = this.findEmployee(employee.children, key);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }
}
