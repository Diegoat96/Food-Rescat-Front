import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sucursal, SucursalRequest } from '../../../../core/models/sucursal.model';
import { latitudValidator, longitudValidator } from './sucursal.validators';

@Component({
  selector: 'app-sucursal-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sucursal-form.component.html',
  styleUrl: './sucursal-form.component.css',
})
export class SucursalFormComponent {
  private fb = inject(FormBuilder);

  @Input() set sucursal(value: Sucursal | null) {
    this._sucursal = value;
    if (value) {
      this.form.patchValue({
        nombreSucursal: value.nombreSucursal,
        direccion: value.direccion,
        latitud: value.latitud,
        longitud: value.longitud,
      });
    } else {
      this.form.reset({
        nombreSucursal: '',
        direccion: '',
        latitud: '',
        longitud: '',
      });
    }
  }

  @Input() guardando = false;
  @Output() guardar = new EventEmitter<SucursalRequest>();
  @Output() cancelar = new EventEmitter<void>();

  private _sucursal: Sucursal | null = null;

  readonly form: FormGroup = this.fb.group({
    nombreSucursal: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    latitud: ['', [Validators.required, latitudValidator]],
    longitud: ['', [Validators.required, longitudValidator]],
  });

  get esEdicion(): boolean {
    return this._sucursal !== null;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardar.emit(this.form.value as SucursalRequest);
  }
}
