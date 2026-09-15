import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { AdminService } from '../../../../core/services/admin.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Usuario } from '../../../../core/models/usuario.model';
import { Rol } from '../../../../core/models/rol.enum';
import { BusinessRequest } from '../../../../core/models/business-request.model';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../core/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { VerDocumentoModalComponent } from '../../../../core/components/ver-documento-modal/ver-documento-modal.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [LoadingSpinnerComponent, EmptyStateComponent, ConfirmDialogComponent, LucideAngularModule, VerDocumentoModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  readonly authService = inject(AuthService);

  readonly mostrarConfirmacionLogout = signal(false);

  readonly usuarios = this.adminService.usuarios;
  readonly cargandoUsuarios = this.adminService.cargandoUsuarios;
  readonly estadisticas = this.adminService.estadisticas;
  readonly cargandoEstadisticas = this.adminService.cargandoEstadisticas;

  readonly solicitudes = this.adminService.solicitudes;
  readonly cargandoSolicitudes = this.adminService.cargandoSolicitudes;
  readonly filtroSolicitud = signal<string>('');
  readonly documento = signal<{ url: string; titulo: string } | null>(null);

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
    const totalKg = e ? Number(e.kgRescuedTotal ?? 0).toLocaleString('es-GT') : '0';
    const totalPaquetes = e
      ? (e.packagesByStatus ?? []).reduce((sum, p) => sum + Number(p.count), 0)
      : 0;
    return [
      { label: 'Usuarios', valor: String(this.usuarios().length), icono: 'users' },
      {
        label: 'Comercios',
        valor: String(this.usuarios().filter((u) => u.role === Rol.BUSINESS).length),
        icono: 'store',
      },
      { label: 'Kg rescatados', valor: totalKg, icono: 'leaf' },
      { label: 'Paquetes publicados', valor: String(totalPaquetes), icono: 'package' },
    ];
  });

  readonly rankingSucursales = computed(() => this.estadisticas()?.topBranches ?? []);

  readonly paquetesPorEstado = computed(() => this.estadisticas()?.packagesByStatus ?? []);

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

  verDocumento(solicitud: BusinessRequest, tipo: 'licencia' | 'foto'): void {
    const url = tipo === 'licencia' ? solicitud.businessLicenseUrl : solicitud.photoUrl;
    if (!url) {
      return;
    }
    this.documento.set({
      url,
      titulo: tipo === 'licencia' ? 'Licencia comercial' : 'Foto del negocio',
    });
  }

  cerrarDocumento(): void {
    this.documento.set(null);
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

  preguntarLogout(): void {
    this.mostrarConfirmacionLogout.set(true);
  }

  confirmarLogout(): void {
    this.mostrarConfirmacionLogout.set(false);
    this.authService.logout();
  }

  cancelarLogout(): void {
    this.mostrarConfirmacionLogout.set(false);
  }
}
