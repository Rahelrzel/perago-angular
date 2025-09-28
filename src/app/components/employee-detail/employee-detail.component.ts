import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  selectedView: string = 'info';
  isLoading = false;

  // Delete Modal
  isDeleteModalVisible = false;
  employeeToDelete: any = null;

  // Edit Modal
  isEditModalVisible = false;
  editForm: FormGroup;
  employeeToEdit: any = null;

  // Static employee data
  employee = {
    firstName: 'John',
    lastName: 'Doe',
    desc: 'A highly skilled software engineer with 5+ years of experience.',
    email: 'john.doe@example.com',
    createdAt: new Date(),
    salary: 60000
  };

  // Static managed employees list
  managedEmployees = [
    { name: 'Alice Smith', position: 'Developer', email: 'alice@example.com' },
    { name: 'Bob Johnson', position: 'Designer', email: 'bob@example.com' },
    { name: 'Charlie Brown', position: 'QA Tester', email: 'charlie@example.com' }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  /** Sidebar navigation */
  selectView(view: string): void {
    this.selectedView = view;
  }

  /** Logout */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  /** Delete modal functions */
  showDeleteModal(emp: any): void {
    this.employeeToDelete = emp;
    this.isDeleteModalVisible = true;
  }

  confirmDelete(): void {
    this.managedEmployees = this.managedEmployees.filter(emp => emp !== this.employeeToDelete);
    this.isDeleteModalVisible = false;
    this.employeeToDelete = null;
  }

  cancelDelete(): void {
    this.isDeleteModalVisible = false;
    this.employeeToDelete = null;
  }

  /** Edit modal functions */
  showEditModal(emp: any): void {
    this.employeeToEdit = emp;
    this.isEditModalVisible = true;

    this.editForm.patchValue({
      name: emp.name,
      position: emp.position,
      email: emp.email
    });
  }

  saveEdit(): void {
    if (this.editForm.valid) {
      const updatedEmp = this.editForm.value;
      const index = this.managedEmployees.indexOf(this.employeeToEdit);
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
