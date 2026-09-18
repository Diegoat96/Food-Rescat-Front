import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Sucursal,
  SucursalRequest,
  TIPOS_COMERCIO,
  TIPOS_COMERCIO_LABELS,
} from '../../../../core/models/sucursal.model';

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
        name: value.name,
        address: value.address,
        city: value.city ?? '',
        phone: value.phone ?? '',
        openingHours: value.openingHours ?? '',
        businessType: value.businessType ?? '',
      });
    } else {
      this.form.reset({
        name: '',
        address: '',
        city: '',
        phone: '',
        openingHours: '',
        businessType: '',
      });
    }
  }

  @Input() guardando = false;
  @Output() guardar = new EventEmitter<SucursalRequest>();
  @Output() cancelar = new EventEmitter<void>();

  private _sucursal: Sucursal | null = null;

  readonly tiposComercio = TIPOS_COMERCIO;
  readonly tipoComercioLabel = TIPOS_COMERCIO_LABELS;

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
    businessType: ['', [Validators.required]],
    city: [''],
    phone: [''],
    openingHours: [''],
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
