import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-bio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-bio.html',
  styleUrls: ['./employee-bio.css'],
})
export class EmployeeBioComponent implements OnInit {
  bioForm!: FormGroup;
  @ViewChild('photoInput') photoInput!: ElementRef<HTMLInputElement>;

  photoFile: File | null = null;
  photoPreview: string | null = null;
  personalFile: File | null = null;
  nomineeFile: File | null = null;

  triggerPhotoUpload() {
    this.photoInput.nativeElement.click();
  }

  onPhotoSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.photoFile = file;

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  triggerPersonalFileInput() {
    const el = document.getElementById('personalFile');
    el?.click();
  }

  triggerNomineeFileInput() {
    const el = document.getElementById('nomineeFile');
    el?.click();
  }

  onFileChange(event: any, fileType: 'personalFile' | 'nomineeFile') {
    const file = event.target.files?.[0] ?? null;
    if (fileType === 'personalFile') {
      this.personalFile = file;
    } else {
      this.nomineeFile = file;
    }
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.bioForm = this.fb.group({
      nameEnglish: ['', Validators.required],
      dob: ['', Validators.required],
      bloodGroup: [''],
      qualification: ['', Validators.required],
      skills: [''],
      email: [''],

      maritalStatus: ['', Validators.required],
      fatherName: ['', Validators.required],

      bankName: [''],
      accountNumber: [''],

      reference: [''],
      refPhone: [''],

      presentAddress: [''],
      district: ['', Validators.required],

      nameBangla: [''],
      age: ['', Validators.required],
      religion: [''],
      phone: ['', Validators.required],

      officialNumber: [''],
      lastJob: [''],
      linkedin: [''],
      facebook: [''],
      nid: ['', Validators.required],

      guardianType: ['', Validators.required],
      fatherContact: ['', Validators.required],
      branchName: [''],
      tin: [''],

      publicRepresentative: [''],
      contactPhone: [''],
      permanentAddress: [''],
      policeStation: [''],
      postalCode: [''],

      nomineeName: ['', Validators.required],
      nomineeRelationship: [''],
      nomineeMobile: ['', Validators.required],
      nomineeNid: ['', Validators.required],
      personalFile: this.personalFile,
      nomineeFile: this.nomineeFile,
    });
  }

  onSubmit() {
    const formData = {
      ...this.bioForm.value,
      profileImage: this.photoFile,
    };
    if (this.bioForm.valid) {
      console.log('Form Data:', formData);
    } else {
      console.warn('Form is invalid');
    }
  }
}
