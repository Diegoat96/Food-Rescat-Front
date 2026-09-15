import { Component, EventEmitter, HostListener, Input, Output, computed, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-ver-documento-modal',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './ver-documento-modal.component.html',
})
export class VerDocumentoModalComponent {
  @Input({ required: true }) url!: string;
  @Input({ required: true }) titulo = 'Documento';
  @Output() cerrar = new EventEmitter<void>();

  private sanitizer = inject(DomSanitizer);

  readonly esPdf = computed(() => /\.pdf($|\?)/i.test(this.url));

  readonly urlSegura = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.url),
  );

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cerrar.emit();
  }
}