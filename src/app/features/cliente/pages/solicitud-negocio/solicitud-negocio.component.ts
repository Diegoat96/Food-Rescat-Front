import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { BusinessRequestsService } from '../../../../core/services/business-requests.service';
import { BusinessRequest, BusinessRequestStatus } from '../../../../core/models/business-request.model';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-solicitud-negocio',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingSpinnerComponent, LucideAngularModule],
  templateUrl: './solicitud-negocio.component.html',
  styleUrl: './solicitud-negocio.component.css',
})
export class SolicitudNegocioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private businessRequestsService = inject(BusinessRequestsService);

  readonly solicitud = this.businessRequestsService.solicitudActual;
  readonly cargando = this.businessRequestsService.cargando;
  readonly enviando = signal(false);
  readonly exito = signal(false);
  readonly error = signal<string | null>(null);

  readonly BusinessRequestStatus = BusinessRequestStatus;

  readonly form: FormGroup = this.fb.group({
    businessName: ['', [Validators.required, Validators.maxLength(120)]],
    address: ['', [Validators.required, Validators.maxLength(300)]],
    businessLicense: [null, [Validators.required]],
    photo: [null],
  });

  private archivoLicense: File | null = null;
  private archivoPhoto: File | null = null;

  readonly nombreArchivoLicense = signal<string | null>(null);
  readonly nombreArchivoPhoto = signal<string | null>(null);

  ngOnInit(): void {
    this.businessRequestsService.miSolicitud().subscribe();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onLicenseChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.archivoLicense = input.files?.[0] ?? null;
    if (this.archivoLicense) {
      this.form.get('businessLicense')?.setValue(this.archivoLicense);
      this.nombreArchivoLicense.set(this.archivoLicense.name);
    } else {
      this.form.get('businessLicense')?.setValue(null);
      this.nombreArchivoLicense.set(null);
    }
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.archivoPhoto = input.files?.[0] ?? null;
    if (this.archivoPhoto) {
      this.form.get('photo')?.setValue(this.archivoPhoto);
      this.nombreArchivoPhoto.set(this.archivoPhoto.name);
    } else {
      this.form.get('photo')?.setValue(null);
      this.nombreArchivoPhoto.set(null);
    }
  }

  removerLicencia(): void {
    this.archivoLicense = null;
    this.form.get('businessLicense')?.setValue(null);
    this.nombreArchivoLicense.set(null);
  }

  removerFoto(): void {
    this.archivoPhoto = null;
    this.form.get('photo')?.setValue(null);
    this.nombreArchivoPhoto.set(null);
  }

  onSubmit(): void {
    if (this.form.invalid || !this.archivoLicense) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.enviando()) {
      return;
    }

    this.enviando.set(true);
    this.error.set(null);
    this.exito.set(false);

    const formData = new FormData();
    formData.append('businessName', this.form.get('businessName')?.value);
    formData.append('address', this.form.get('address')?.value);
    formData.append('businessLicense', this.archivoLicense);
    if (this.archivoPhoto) {
      formData.append('photo', this.archivoPhoto);
    }

    this.businessRequestsService.crear(formData).subscribe({
      next: () => {
        this.enviando.set(false);
        this.exito.set(true);
        this.businessRequestsService.miSolicitud().subscribe();
      },
      error: (err: { status: number }) => {
        this.enviando.set(false);
        if (err.status === 409) {
          this.error.set('Ya tienes una solicitud pendiente.');
        } else if (err.status === 413) {
          this.error.set('El archivo es demasiado grande (máx. 5 MB).');
        } else {
          this.error.set('No se pudo enviar la solicitud. Intenta de nuevo.');
        }
      },
    });
  }

  estadoLabel(status: BusinessRequestStatus): string {
    switch (status) {
      case BusinessRequestStatus.APPROVED:
        return 'Aprobada';
      case BusinessRequestStatus.REJECTED:
        return 'Rechazada';
      default:
        return 'Pendiente';
    }
  }

  estadoBadge(status: BusinessRequestStatus): string {
    switch (status) {
      case BusinessRequestStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case BusinessRequestStatus.REJECTED:
        return 'bg-error-light text-error';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  }
}
