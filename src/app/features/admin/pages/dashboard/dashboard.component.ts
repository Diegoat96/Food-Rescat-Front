import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AdminService } from '../../../../core/services/admin.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Usuario } from '../../../../core/models/usuario.model';
import { Rol } from '../../../../core/models/rol.enum';
import { BusinessRequest } from '../../../../core/models/business-request.model';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../core/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  readonly authService = inject(AuthService);

  readonly usuarios = this.adminService.usuarios;
  readonly cargandoUsuarios = this.adminService.cargandoUsuarios;
  readonly estadisticas = this.adminService.estadisticas;
  readonly cargandoEstadisticas = this.adminService.cargandoEstadisticas;

  readonly solicitudes = this.adminService.solicitudes;
  readonly cargandoSolicitudes = this.adminService.cargandoSolicitudes;
  readonly filtroSolicitud = signal<string>('');

  readonly rolSeleccionado = signal<'TODOS' | Rol>('TODOS');
  readonly Rol = Rol;
  readonly opciones: ('TODOS' | Rol)[] = ['TODOS', Rol.CLIENT, Rol.BUSINESS, Rol.ADMIN];

  readonly usuariosFiltrados = computed(() => {
    const rol = this.rolSeleccionado();
    return this.usuarios().filter((u) => rol === 'TODOS' || u.role === rol);
  });

  readonly solicitudesFiltradas = computed(() => {
    const filtro = this.filtroSolicitud();
    if (!filtro) {
      return this.solicitudes();
    }
    return this.solicitudes().filter((s) => s.status === filtro);
  });

  readonly cards = computed(() => {
    const e = this.estadisticas();
    if (!e) {
      return [];
    }
    return [
      { label: 'Usuarios', valor: String(e.totalUsuarios), icono: '👥' },
      { label: 'Comercios', valor: String(e.totalComercios), icono: '🏪' },
      { label: 'Rescates completados', valor: String(e.totalRescates), icono: '✅' },
      {
        label: 'Kg rescatados',
        valor: Number(e.totalKgRescatados).toLocaleString('es-GT'),
        icono: '🥦',
      },
    ];
  });

  readonly barras = computed(() => {
    const dias = this.estadisticas()?.rescatadosUltimos7Dias ?? [];
    const max = Math.max(1, ...dias.map((d) => Number(d.kg)));
    return dias.map((d) => ({
      etiqueta: etiquetaDia(d.fecha),
      kg: Number(d.kg),
      pct: Math.max(3, Math.round((Number(d.kg) / max) * 100)),
    }));
  });

  ngOnInit(): void {
    this.cargarEstadisticas();
    this.cargarUsuarios();
    this.cargarSolicitudes();
  }

  cargarEstadisticas(): void {
    this.adminService.cargarEstadisticas().subscribe();
  }

  cargarUsuarios(): void {
    this.adminService.cargarUsuarios().subscribe();
  }

  cargarSolicitudes(): void {
    this.adminService.cargarSolicitudes().subscribe();
  }

  cambiarRol(rol: 'TODOS' | Rol): void {
    this.rolSeleccionado.set(rol);
  }

  filtrarSolicitudes(status: string): void {
    this.filtroSolicitud.set(status);
  }

  toggle(usuario: Usuario): void {
    this.adminService.toggleEstado(usuario).subscribe({
      error: () => this.adminService.cargarUsuarios().subscribe(),
    });
  }

  aprobar(id: string): void {
    this.adminService.aprobarSolicitud(id).subscribe();
  }

  rechazar(id: string): void {
    const reason = prompt('Motivo del rechazo:');
    if (reason !== null && reason.trim()) {
      this.adminService.rechazarSolicitud(id, reason.trim()).subscribe();
    }
  }

  badgeRol(role: Rol): string {
    switch (role) {
      case Rol.BUSINESS:
        return 'bg-secondary-100 text-secondary-700';
      case Rol.ADMIN:
        return 'bg-surface-alt text-text-muted';
      default:
        return 'bg-primary-100 text-primary-700';
    }
  }

  badgeSolicitud(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-error-light text-error';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  }
}

function etiquetaDia(iso: string): string {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) {
    return iso;
  }
  return fecha.toLocaleDateString('es-GT', { weekday: 'short' });
}
