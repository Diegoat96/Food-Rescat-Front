import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComercioSidebarComponent } from '../components/comercio-sidebar/sidebar.component';
import { ComercioHeaderComponent } from '../components/comercio-header/header.component';
import { SucursalesService } from '../../../core/services/sucursales.service';

@Component({
  selector: 'app-comercio-layout',
  standalone: true,
  imports: [RouterOutlet, ComercioSidebarComponent, ComercioHeaderComponent],
  templateUrl: './comercio-layout.component.html',
  styleUrl: './comercio-layout.component.css',
})
export class ComercioLayoutComponent implements OnInit {
  private sucursalesService = inject(SucursalesService);

  ngOnInit(): void {
    this.sucursalesService.cargar().subscribe();
  }
}
