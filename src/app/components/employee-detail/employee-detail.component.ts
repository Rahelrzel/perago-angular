import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store, Actions, ofActionSuccessful, ofActionErrored } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/interface/user.interface';
import { AuthState, Logout } from 'src/app/store/auth.state';
import { EmployeeState, FetchManagedEmployees, GetRoles, AddEmployee, DeleteEmployee, AddEmployeeSuccess, AddEmployeeFailure, DeleteEmployeeSuccess, DeleteEmployeeFailure } from 'src/app/store/employee.state';
import { Role } from 'src/app/service/employee.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  @Select(AuthState.user) user$!: Observable<User | null>;
  @Select(EmployeeState.managedEmployees) managedEmployees$!: Observable<User[]>;
  @Select(EmployeeState.roles) roles$!: Observable<Role[]>;
  @Select(EmployeeState.isLoading) isLoading$!: Observable<boolean>;

  private destroy$ = new Subject<void>();

  selectedView: string = 'info';

  // Delete Modal
  isDeleteModalVisible = false;
  employeeToDelete: User | null = null;
  isDeleting = false;

  // Add Employee Modal
  isAddEmployeeModalVisible = false;
  addEmployeeForm: FormGroup;
  isAddingEmployee = false;

  employee: User | null = null;
  managedEmployees: User[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
    private message: NzMessageService,
    private actions$: Actions
  ) {
    this.addEmployeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roleId: ['', Validators.required],
      salary: [null, Validators.required],
      desc: ['']
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetRoles());

    this.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.employee = user;
        this.store.dispatch(new FetchManagedEmployees());
      }
    });

    this.managedEmployees$.pipe(takeUntil(this.destroy$)).subscribe(employees => {
      this.managedEmployees = employees;
    });

    this.actions$.pipe(ofActionSuccessful(AddEmployeeSuccess), takeUntil(this.destroy$)).subscribe(() => {
      this.isAddingEmployee = false;
      this.isAddEmployeeModalVisible = false;
      this.message.success('Employee added successfully');
    });

    this.actions$.pipe(ofActionErrored(AddEmployeeFailure), takeUntil(this.destroy$)).subscribe(() => {
      this.isAddingEmployee = false;
      this.message.error('Failed to add employee');
    });

    this.actions$.pipe(ofActionSuccessful(DeleteEmployeeSuccess), takeUntil(this.destroy$)).subscribe(() => {
      this.isDeleting = false;
      this.isDeleteModalVisible = false;
      this.message.success('Employee deleted successfully');
    });

    this.actions$.pipe(ofActionErrored(DeleteEmployeeFailure), takeUntil(this.destroy$)).subscribe(() => {
      this.isDeleting = false;
      this.message.error('Failed to delete employee');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Sidebar navigation */
  selectView(view: string): void {
    this.selectedView = view;
  }

  /** Logout */
  logout(): void {
    this.store.dispatch(new Logout());
    this.router.navigate(['/login']);
  }

  /** Delete modal functions */
  showDeleteModal(emp: User): void {
    this.employeeToDelete = emp;
    this.isDeleteModalVisible = true;
  }

  confirmDelete(): void {
    if (this.employeeToDelete) {
      this.isDeleting = true;
      this.store.dispatch(new DeleteEmployee(this.employeeToDelete.id));
    }
  }

  cancelDelete(): void {
    this.isDeleteModalVisible = false;
    this.employeeToDelete = null;
  }

  /** Add Employee modal functions */
  showAddEmployeeModal(): void {
    this.isAddEmployeeModalVisible = true;
  }

  handleAddEmployee(): void {
    if (this.addEmployeeForm.valid) {
      this.isAddingEmployee = true;
      this.store.dispatch(new AddEmployee(this.addEmployeeForm.value));
    }
  }

  cancelAddEmployee(): void {
    this.isAddEmployeeModalVisible = false;
    this.addEmployeeForm.reset();
  }
}
