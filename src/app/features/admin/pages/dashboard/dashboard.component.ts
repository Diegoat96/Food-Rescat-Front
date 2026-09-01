import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AdminService } from '../../../../core/services/admin.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Usuario } from '../../../../core/models/usuario.model';
import { Rol } from '../../../../core/models/rol.enum';
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

  readonly rolSeleccionado = signal<'TODOS' | Rol>('TODOS');
  readonly Rol = Rol;
  readonly opciones: ('TODOS' | Rol)[] = ['TODOS', Rol.CLIENTE, Rol.COMERCIO, Rol.ADMIN];

  readonly usuariosFiltrados = computed(() => {
    const rol = this.rolSeleccionado();
    return this.usuarios().filter((u) => rol === 'TODOS' || u.rol === rol);
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
  }

  cargarEstadisticas(): void {
    this.adminService.cargarEstadisticas().subscribe();
  }

  cargarUsuarios(): void {
    this.adminService.cargarUsuarios().subscribe();
  }

  cambiarRol(rol: 'TODOS' | Rol): void {
    this.rolSeleccionado.set(rol);
  }

  toggle(usuario: Usuario): void {
    const objetivo = !usuario.activo;
    this.usuarios.update((lista) =>
      lista.map((u) => (u.id === usuario.id ? { ...u, activo: objetivo } : u)),
    );
    this.adminService.toggleEstado(usuario).subscribe({
      error: () => this.adminService.cargarUsuarios().subscribe(),
    });
  }

  badgeRol(rol: Rol): string {
    switch (rol) {
      case Rol.COMERCIO:
        return 'bg-secondary-100 text-secondary-700';
      case Rol.ADMIN:
        return 'bg-surface-alt text-text-muted';
      default:
        return 'bg-primary-100 text-primary-700';
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