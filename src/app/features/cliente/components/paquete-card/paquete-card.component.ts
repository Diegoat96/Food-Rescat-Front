import { Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Paquete } from '../../../../core/models/paquete.model';
import { categoryLabel } from '../../../../core/models/categoria.model';
import { EstadoBadgeComponent } from '../estado-badge/estado-badge.component';
import { ReservasService } from '../../../../core/services/reservas.service';
import { Reserva } from '../../../../core/models/reserva.model';
import { FavoritoButtonComponent } from '../favorito-button/favorito-button.component';
import { ValoracionesService } from '../../../../core/services/valoraciones.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Rol } from '../../../../core/models/rol.enum';
import { ValoracionesPaquete } from '../../../../core/models/valoracion.model';

@Component({
  selector: 'app-paquete-card',
  standalone: true,
  imports: [EstadoBadgeComponent, FavoritoButtonComponent, LucideAngularModule],
  templateUrl: './paquete-card.component.html',
  styleUrl: './paquete-card.component.css',
})
export class PaqueteCardComponent {
  @Input({ required: true }) paquete!: Paquete;
  @Output() reservaExitosa = new EventEmitter<Reserva>();

  private reservasService = inject(ReservasService);
  private valoracionesService = inject(ValoracionesService);
  private authService = inject(AuthService);

  readonly reservando = signal(false);
  readonly errorReserva = signal<string | null>(null);
  readonly metodoPago = signal<string>('CASH');
  readonly estrellas = [1, 2, 3, 4, 5];

  readonly verResenas = signal(false);
  readonly resenas = signal<ValoracionesPaquete | null>(null);
  readonly cargandoResenas = signal(false);
  readonly errorResenas = signal<string | null>(null);

  readonly miPuntuacion = signal(0);
  readonly miComentario = signal('');
  readonly miGuardando = signal(false);
  readonly miError = signal<string | null>(null);
  readonly resenado = signal(false);

  readonly esCliente = computed(
    () => this.authService.currentUser()?.role === Rol.CLIENT,
  );

  onReservar(): void {
    if (this.reservando()) {
      return;
    }
    this.reservando.set(true);
    this.errorReserva.set(null);
    this.reservasService.reservar(this.paquete.id, this.metodoPago()).subscribe({
      next: (res) => {
        this.reservando.set(false);
        const reservaCompuesta: Reserva = {
          ...res,
          packageName: this.paquete.name,
          branchName: this.paquete.branch?.name,
          branchCity: this.paquete.branch?.city,
          branchAddress: this.paquete.branch?.address,
          pickupDeadline: this.paquete.pickupDeadline,
        };
        this.reservaExitosa.emit(reservaCompuesta);
      },
      error: () => {
        this.reservando.set(false);
        this.errorReserva.set('Este paquete ya no tiene stock disponible. Intenta con otro.');
      },
    });
  }

  onMetodoPago(event: Event): void {
    this.metodoPago.set((event.target as HTMLSelectElement).value);
  }

  iconoCategoria(): string {
    const nombre = categoryLabel(this.paquete.category?.name).toLowerCase();
    if (nombre.includes('pan')) {
      return 'croissant';
    }
    if (nombre.includes('bebida') || nombre.includes('caf')) {
      return 'coffee';
    }
    if (nombre.includes('fruta') || nombre.includes('verd')) {
      return 'carrot';
    }
    if (nombre.includes('carne')) {
      return 'drumstick';
    }
    return 'utensils';
  }

  horaLimite(): string {
    const fecha = new Date(this.paquete.pickupDeadline);
    if (Number.isNaN(fecha.getTime())) {
      return 'pronto';
    }
    return fecha.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
  }

  promedio(): string {
    return Number(this.resenas()?.average ?? this.paquete.ratingAverage ?? 0).toFixed(1);
  }

  estrellaActiva(indice: number): boolean {
    const promedio = Number(this.resenas()?.average ?? this.paquete.ratingAverage ?? 0);
    return promedio >= indice - 0.25;
  }

  totalResenas(): number {
    return this.resenas()?.total ?? this.paquete.ratingCount ?? 0;
  }

  alternarResenas(): void {
    this.verResenas.set(!this.verResenas());
    if (this.verResenas()) {
      this.cargarResenas();
    }
  }

  cargarResenas(): void {
    this.cargandoResenas.set(true);
    this.errorResenas.set(null);
    this.valoracionesService.dePaquete(this.paquete.id).subscribe({
      next: (data) => {
        this.resenas.set(data);
        this.cargandoResenas.set(false);
      },
      error: () => {
        this.cargandoResenas.set(false);
        this.errorResenas.set('No se pudieron cargar las reseñas.');
      },
    });
  }

  seleccionarPuntuacion(valor: number): void {
    this.miPuntuacion.set(valor);
    this.miError.set(null);
  }

  onMiComentario(event: Event): void {
    this.miComentario.set((event.target as HTMLTextAreaElement).value);
  }

  enviarMiResena(): void {
    if (this.miGuardando()) {
      return;
    }
    if (this.miPuntuacion() < 1) {
      this.miError.set('Selecciona de 1 a 5 estrellas para calificar.');
      return;
    }
    this.miGuardando.set(true);
    this.miError.set(null);
    this.valoracionesService
      .crear({
        packageId: this.paquete.id,
        score: this.miPuntuacion(),
        comment: this.miComentario().trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.miGuardando.set(false);
          this.resenado.set(true);
          this.miPuntuacion.set(0);
          this.miComentario.set('');
          this.cargarResenas();
        },
        error: (err) => {
          this.miGuardando.set(false);
          const conflict = err?.status === 409;
          this.miError.set(
            conflict
              ? 'Ya calificaste este paquete.'
              : 'No se pudo enviar tu reseña. Intenta de nuevo.',
          );
        },
      });
  }
}
