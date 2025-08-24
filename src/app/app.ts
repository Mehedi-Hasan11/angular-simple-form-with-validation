import { Component, OnInit, ViewChild, ElementRef, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeBioComponent } from './employee-bio/employee-bio';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface DocInfo {
  name: string;
  size: number; // bytes
}

export interface Employee {
  name: string;
  phone: string;
  email?: string | null;
  nid: string;
  dob: string; // ISO date string (yyyy-mm-dd)
  address: string;
  qualification: string;
  religion?: string | null;
  experience: number;
  lastWorkPlace?: string | null;
  salary: number;
  photoDataUrl?: string | null; // base64 image preview
  documents: DocInfo[];
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
 private LS_KEY = 'employees';

  form!: FormGroup;

  employees = signal<Employee[]>([]);
  editingIndex = signal<number | null>(null);

  photoPreview = signal<string | null>(null);
  docs = signal<DocInfo[]>([]);

  @ViewChild('photoInput') photoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('docsInput') docsInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      email: ['', [Validators.email]],
      nid: ['', [Validators.required, Validators.maxLength(30)]],
      dob: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.maxLength(250)]],
      qualification: ['', [Validators.required, Validators.maxLength(120)]],
      religion: [''],
      experience: [0, [Validators.min(0)]],
      lastWorkPlace: [''],
      salary: [0, [Validators.min(0)]],
    });

    this.loadEmployees();
  }

  get f() {
    return this.form.controls;
  }

  // ===== File Handling =====
  async onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    // Read as DataURL for preview + persistence
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.photoPreview.set(null);
    if (this.photoInput?.nativeElement) {
      this.photoInput.nativeElement.value = '';
    }
  }

  onDocsSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    const added: DocInfo[] = Array.from(files).map(f => ({
      name: f.name,
      size: f.size,
    }));
    this.docs.set([...this.docs(), ...added]);

    // allow re-adding the same file later
    if (this.docsInput?.nativeElement) {
      this.docsInput.nativeElement.value = '';
    }
  }

  removeDoc(index: number) {
    const list = [...this.docs()];
    list.splice(index, 1);
    this.docs.set(list);
  }

  // ===== CRUD =====
  addEmployee() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const employee: Employee = {
      ...this.form.value,
      photoDataUrl: this.photoPreview(),
      documents: this.docs(),
    };

    this.employees.set([employee, ...this.employees()]);
    this.saveEmployees();
    this.resetForm();
  }

  updateEmployee() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const idx = this.editingIndex();
    if (idx === null || idx < 0) return;

    const updated: Employee = {
      ...this.form.value,
      photoDataUrl: this.photoPreview(),
      documents: this.docs(),
    };

    const list = [...this.employees()];
    list[idx] = updated;
    this.employees.set(list);
    this.saveEmployees();
    this.resetForm();
  }

  editEmployee(index: number) {
    const emp = this.employees()[index];
    if (!emp) return;

    this.form.reset({
      name: emp.name,
      phone: emp.phone,
      email: emp.email ?? '',
      nid: emp.nid,
      dob: emp.dob,
      address: emp.address,
      qualification: emp.qualification,
      religion: emp.religion ?? '',
      experience: emp.experience,
      lastWorkPlace: emp.lastWorkPlace ?? '',
      salary: emp.salary,
    });

    this.photoPreview.set(emp.photoDataUrl ?? null);
    this.docs.set(emp.documents ?? []);
    this.editingIndex.set(index);
    // scroll to top for form focus (optional UX)
    try { window?.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
  }

  deleteEmployee(index: number) {
    const list = [...this.employees()];
    list.splice(index, 1);
    this.employees.set(list);
    this.saveEmployees();

    // if we deleted the one being edited, reset
    if (this.editingIndex() === index) this.resetForm();
  }

  resetForm() {
    this.form.reset({
      name: '',
      phone: '',
      email: '',
      nid: '',
      dob: '',
      address: '',
      qualification: '',
      religion: '',
      experience: 0,
      lastWorkPlace: '',
      salary: 0,
    });

    this.photoPreview.set(null);
    this.docs.set([]);
    this.editingIndex.set(null);

    if (this.photoInput?.nativeElement) this.photoInput.nativeElement.value = '';
    if (this.docsInput?.nativeElement) this.docsInput.nativeElement.value = '';
  }

  // ===== Persistence =====
  saveEmployees() {
    localStorage.setItem(this.LS_KEY, JSON.stringify(this.employees()));
  }

  loadEmployees() {
    const raw = localStorage.getItem(this.LS_KEY);
    if (!raw) {
      this.employees.set([]);
      return;
    }
    try {
      const data = JSON.parse(raw) as Employee[];
      // validate shape minimally
      this.employees.set(Array.isArray(data) ? data : []);
    } catch {
      this.employees.set([]);
    }
  }

  // ===== Helpers =====
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const val = bytes / Math.pow(k, i);
    return `${val.toFixed(val >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
  }

  initials(name: string): string {
    return (name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(s => s[0]?.toUpperCase() ?? '')
      .join('');
  }

  isEditing = computed(() => this.editingIndex() !== null);
}


