import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/interface/user.interface';
import { AuthState, Logout } from 'src/app/store/auth.state';
import { EmployeeState, FetchManagedEmployees } from 'src/app/store/employee.state';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  @Select(AuthState.user) user$!: Observable<User | null>;
  @Select(EmployeeState.managedEmployees) managedEmployees$!: Observable<User[]>;

  private subscription: Subscription = new Subscription();

  selectedView: string = 'info';
  isLoading = false;

  // Delete Modal
  isDeleteModalVisible = false;
  employeeToDelete: User | null = null;

  // Edit Modal
  isEditModalVisible = false;
  editForm: FormGroup;
  employeeToEdit: User | null = null;

  employee: User | null = null;

  // Managed employees list - will be replaced with dynamic data
  managedEmployees: User[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.subscription.add(
      this.user$.subscribe(user => {
        if (user) {
          this.employee = user;
          this.store.dispatch(new FetchManagedEmployees());
        }
        this.isLoading = false;
      })
    );

    this.subscription.add(
      this.managedEmployees$.subscribe(employees => {
        this.managedEmployees = employees;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      this.managedEmployees = this.managedEmployees.filter(emp => emp.id !== this.employeeToDelete!.id);
    }
    this.isDeleteModalVisible = false;
    this.employeeToDelete = null;
  }

  cancelDelete(): void {
    this.isDeleteModalVisible = false;
    this.employeeToDelete = null;
  }

  /** Edit modal functions */
  showEditModal(emp: User): void {
    this.employeeToEdit = emp;
    this.isEditModalVisible = true;

    this.editForm.patchValue({
      name: `${emp.firstName} ${emp.lastName}`,
      position: emp.role.name,
      email: emp.email
    });
  }

  saveEdit(): void {
    if (this.editForm.valid && this.employeeToEdit) {
      const updatedEmp = {
        ...this.employeeToEdit,
        firstName: this.editForm.value.name.split(' ')[0],
        lastName: this.editForm.value.name.split(' ').slice(1).join(' '),
        email: this.editForm.value.email,
        role: { ...this.employeeToEdit.role, name: this.editForm.value.position }
      };
      const index = this.managedEmployees.findIndex(emp => emp.id === this.employeeToEdit!.id);
      if (index > -1) {
        this.managedEmployees[index] = updatedEmp;
      }
      this.isEditModalVisible = false;
      this.employeeToEdit = null;
    }
  }

  cancelEdit(): void {
    this.isEditModalVisible = false;
    this.employeeToEdit = null;
  }
}
