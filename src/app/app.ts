import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeBioComponent } from './employee-bio/employee-bio';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EmployeeBioComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
