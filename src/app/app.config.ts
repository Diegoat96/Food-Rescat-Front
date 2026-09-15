import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  LucideAngularModule,
  Home,
  Store,
  Clock,
  History,
  Utensils,
  Package,
  Hourglass,
  Leaf,
  Wallet,
  MapPin,
  Star,
  Heart,
  CheckCircle,
  Inbox,
  PartyPopper,
  ClipboardList,
  BellOff,
  Bell,
  BellRing,
  PlusCircle,
  ListTodo,
  Eye,
  EyeOff,
  HeartHandshake,
  X,
  Search,
  Users,
  Upload,
  Croissant,
  Coffee,
  Carrot,
  Drumstick,
} from 'lucide-angular';

import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { responseInterceptor } from './core/interceptors/response.interceptor';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return firstValueFrom(authService.cargarSesion());
    }),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(withInterceptors([authInterceptor, responseInterceptor, httpErrorInterceptor])),
    importProvidersFrom(
      LucideAngularModule.pick({
        Home,
        Store,
        Clock,
        History,
        Utensils,
        Package,
        Hourglass,
        Leaf,
        Wallet,
        MapPin,
        Star,
        Heart,
        CheckCircle,
        Inbox,
        PartyPopper,
        ClipboardList,
        BellOff,
        Bell,
        BellRing,
        PlusCircle,
        ListTodo,
        Eye,
        EyeOff,
        HeartHandshake,
        X,
        Search,
        Users,
        Upload,
        Croissant,
        Coffee,
        Carrot,
        Drumstick,
      }),
    ),
  ],
};
