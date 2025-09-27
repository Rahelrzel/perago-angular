import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ManagedEmployee {
  id: number;
  name: string;
  position: string;
  email: string;
}

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit {
  selectedView: 'info' | 'hierarchy' | 'settings' = 'info'; // default view
  isLoading = true;

  employee: any = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    createdAt: new Date(),
    salary: 80000,
    desc: 'Head of Engineering Department',
  };

  managedEmployees: ManagedEmployee[] = [];

  // Modal control
  isDeleteModalVisible = false;
  isEditModalVisible = false;
  selectedEmployee: ManagedEmployee | null = null;

  // Edit form
  editForm!: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Placeholder managed employees
    this.managedEmployees = [
      { id: 1, name: 'Jane Smith', position: 'Frontend Developer', email: 'jane.smith@example.com' },
      { id: 2, name: 'Michael Johnson', position: 'Backend Developer', email: 'michael.johnson@example.com' },
      { id: 3, name: 'Emily Brown', position: 'QA Engineer', email: 'emily.brown@example.com' },
    ];

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    setTimeout(() => (this.isLoading = false), 1000);
  }

  selectView(view: 'info' | 'hierarchy' | 'settings') {
    this.selectedView = view;
  }

  logout() {
    this.router.navigate(['/login']);
  }

  onRowClick(emp: ManagedEmployee) {
    this.router.navigate(['/employee', emp.id]);
  }

  // Delete Modal
  showDeleteModal(emp: ManagedEmployee) {
    this.selectedEmployee = emp;
    this.isDeleteModalVisible = true;
  }

  confirmDelete() {
    if (this.selectedEmployee) {
      this.managedEmployees = this.managedEmployees.filter(
        (e) => e.id !== this.selectedEmployee?.id
      );
    }
    this.isDeleteModalVisible = false;
  }

  cancelDelete() {
    this.isDeleteModalVisible = false;
  }

  // Edit Modal
  showEditModal(emp: ManagedEmployee) {
    this.selectedEmployee = emp;
    this.editForm.patchValue({
      name: emp.name,
      position: emp.position,
      email: emp.email,
    });
    this.isEditModalVisible = true;
  }

  saveEdit() {
    if (this.selectedEmployee && this.editForm.valid) {
      const index = this.managedEmployees.findIndex(e => e.id === this.selectedEmployee!.id);
      if (index > -1) {
        this.managedEmployees[index] = {
          ...this.managedEmployees[index],
          ...this.editForm.value
        };
      }
    }
    this.isEditModalVisible = false;
  }

  cancelEdit() {
    this.isEditModalVisible = false;
  }
}
