import { Component, Input, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaSelectComponent } from '../categoria-select/categoria-select.component';
import { CategoriasService } from '../../../../core/services/categorias.service';
import { SucursalesService } from '../../../../core/services/sucursales.service';
import { PaquetesService } from '../../../../core/services/paquetes.service';

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
  readonly imagenFile = signal<File | null>(null);
  readonly imagenPreview = signal<string | null>(null);
  readonly errorImagen = signal<string | null>(null);

  // Genera automáticamente todas las horas del día de 00:00 a 23:00
  readonly horarios: string[] = Array.from({ length: 24 }, (_, i) => {
    return i.toString().padStart(2, '0') + ':00';
  });

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

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.errorImagen.set(null);

    if (!file) {
      this.imagenFile.set(null);
      this.imagenPreview.set(null);
      return;
    }

    const permitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!permitidos.includes(file.type)) {
      this.errorImagen.set('Formato no permitido. Usa JPG, PNG o WebP.');
      input.value = '';
      this.imagenFile.set(null);
      this.imagenPreview.set(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorImagen.set('La imagen no puede superar los 5 MB.');
      input.value = '';
      this.imagenFile.set(null);
      this.imagenPreview.set(null);
      return;
    }

    this.imagenFile.set(file);
    this.imagenPreview.set(URL.createObjectURL(file));
  }

  quitarImagen(input: HTMLInputElement): void {
    input.value = '';
    if (this.imagenPreview()) {
      URL.revokeObjectURL(this.imagenPreview()!);
    }
    this.imagenFile.set(null);
    this.imagenPreview.set(null);
    this.errorImagen.set(null);
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

    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value ?? '');
    const descripcion = this.form.get('description')?.value;
    if (descripcion) {
      formData.append('description', descripcion);
    }
    formData.append('categoryId', this.form.get('categoryId')?.value);
    formData.append('branchId', sucursal.id);
    formData.append('quantity', String(this.form.get('quantity')?.value ?? 1));
    formData.append(
      'pickupDeadline',
      this.horaRecogida(this.form.get('pickupDeadline')?.value),
    );
    formData.append('estimatedWeightKg', '0');
    if (original > 0) {
      formData.append('originalPrice', String(original));
    }
    if (descuento > 0) {
      formData.append('discountedPrice', String(descuento));
    }
    const imagen = this.imagenFile();
    if (imagen) {
      formData.append('image', imagen, imagen.name);
    }

    this.guardando.set(true);
    this.paquetesService.crear(formData).subscribe({
      next: () => {
        this.guardando.set(false);
        this.publicado.set(true);
        this.form.reset({ quantity: 1, pickupDeadline: '' });
        this.quitarImagen({ value: '' } as HTMLInputElement);
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