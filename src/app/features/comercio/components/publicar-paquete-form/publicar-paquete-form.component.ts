import { Component, Input, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaSelectComponent } from '../categoria-select/categoria-select.component';
import { CategoriasService } from '../../../../core/services/categorias.service';
import { SucursalesService } from '../../../../core/services/sucursales.service';
import { PaquetesService } from '../../../../core/services/paquetes.service';
import { PaqueteRequest } from '../../../../core/models/paquete.model';

@Component({
  selector: 'app-publicar-paquete-form',
  standalone: true,
  imports: [ReactiveFormsModule, CategoriaSelectComponent],
  templateUrl: './publicar-paquete-form.component.html',
  styleUrl: './publicar-paquete-form.component.css',
})
export class PublicarPaqueteFormComponent {
  private fb = inject(FormBuilder);
  private categoriasService = inject(CategoriasService);
  private sucursalesService = inject(SucursalesService);
  private paquetesService = inject(PaquetesService);

  @Input() variante: 'compacta' | 'grande' = 'grande';

  readonly guardando = signal(false);
  readonly publicado = signal(false);
  readonly sucursales = this.sucursalesService.sucursales;

  readonly horarios = [
    '12:00', '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
  ];

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    categoryId: ['', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    pickupDeadline: ['', [Validators.required]],
    originalPrice: [''],
    discountedPrice: [''],
  });

  private readonly formValues = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  constructor() {
    this.categoriasService.cargar().subscribe();
    this.sucursalesService.cargar().subscribe();
  }

  readonly preview = computed(() => {
    const valores = this.formValues();
    const original = Number(valores?.originalPrice);
    const descuento = Number(valores?.discountedPrice);
    if (Number.isFinite(original) && Number.isFinite(descuento) && original > 0 && descuento > 0) {
      return `El cliente paga Q${descuento} en lugar de Q${original}`;
    }
    return 'Ingresa los precios para ver el descuento en vivo.';
  });

  ajustarStock(delta: number): void {
    const control = this.form.get('quantity');
    const actual = Number(control?.value) || 0;
    control?.setValue(Math.max(1, actual + delta));
    control?.markAsTouched();
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
    const sucursal = this.sucursales()[0];
    if (!sucursal) {
      return;
    }
    const original = Number(this.form.get('originalPrice')?.value) || 0;
    const descuento = Number(this.form.get('discountedPrice')?.value) || 0;

    const data: PaqueteRequest = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value || undefined,
      categoryId: this.form.get('categoryId')?.value,
      branchId: sucursal.id,
      quantity: Number(this.form.get('quantity')?.value),
      pickupDeadline: this.horaRecogida(this.form.get('pickupDeadline')?.value),
      estimatedWeightKg: 0,
      ...(original > 0 ? { originalPrice: original } : {}),
      ...(descuento > 0 ? { discountedPrice: descuento } : {}),
    };

    this.guardando.set(true);
    this.paquetesService.crear(data).subscribe({
      next: () => {
        this.guardando.set(false);
        this.publicado.set(true);
        this.form.reset({ quantity: 1, pickupDeadline: '' });
      },
      error: () => {
        this.guardando.set(false);
      },
    });
  }

  private horaRecogida(hora: string): string {
    const [hh, mm] = (hora || '12:00').split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(hh, mm, 0, 0);
    return fecha.toISOString();
  }
}
