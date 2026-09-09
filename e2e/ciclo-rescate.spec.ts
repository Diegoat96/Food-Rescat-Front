import { expect, test } from '@playwright/test';
import { cerrarSesion, registrar, usuarioUnico } from './helpers/auth';

// TODO: Este test requiere el flujo completo de business-request + aprobación por admin
// para que un usuario pase de CLIENT a BUSINESS. Por ahora solo verifica el registro
// como CLIENT y la navegación básica.
test.describe('Ciclo completo de rescate', () => {
  test('cliente se registra y se le envía al login', async ({ page }) => {
    const cliente = usuarioUnico('cliente');

    await registrar(page, cliente);
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15_000 });
  });
});
