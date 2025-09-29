  import { Component, OnInit } from '@angular/core';
import { NzTreeNodeOptions, NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetEmployeeHierarchy, EmployeeState } from '../../store/employee.state';
import { Employee } from '../../interface/employee.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @Select(EmployeeState.employees) employees$!: Observable<Employee[]>;
  @Select(EmployeeState.isLoading) isLoading$!: Observable<boolean>;
  @Select(EmployeeState.error) error$!: Observable<string | null>;

  employeeHierarchy: NzTreeNodeOptions[] = [];
  private employees: Employee[] = [];

  drawerVisible = false;
  selectedEmployee: Employee | null = null;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetEmployeeHierarchy());
    this.employees$.subscribe(employees => {
      this.employees = employees;
      this.employeeHierarchy = this.transformToNzTreeNodes(employees);
    });
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
