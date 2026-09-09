import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValue = this.registerForm.value;
    this.authService.register({
      name: formValue.nombre,
      email: formValue.email,
      password: formValue.password,
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/auth/login']);
      },
      error: (err: { status: number }) => {
        this.isLoading.set(false);
        if (err.status === 409) {
          this.errorMessage.set('Este correo ya está registrado. Inicia sesión.');
        } else if (err.status === 400) {
          this.errorMessage.set('Datos inválidos. Revisa el formulario.');
        } else {
          this.errorMessage.set('Ocurrió un error inesperado. Intenta de nuevo.');
        }
      },
    });
  }
}
