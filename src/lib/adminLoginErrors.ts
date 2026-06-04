export function adminLoginErrorMessage(status: number, body?: { code?: string; error?: string }): string {
  if (status === 429) return 'Demasiados intentos. Espera un minuto e intenta de nuevo.'
  if (status === 403) return 'Origen no permitido. Abre el panel desde la misma URL de la app.'
  if (status === 500) {
    if (body?.code === 'password_too_short') {
      return 'Contraseña del servidor demasiado corta. En Vercel debe tener mínimo 12 caracteres y luego redeploy.'
    }
    if (body?.code === 'missing_env') {
      return 'Faltan variables en Vercel (ADMIN_* o SUPER_ADMIN_*). Revisa Environment Variables y redeploy.'
    }
    return 'Panel no configurado en el servidor. Revisa variables en Vercel y vuelve a desplegar.'
  }
  if (status === 401) {
    return 'Usuario o contraseña incorrectos. En /admin usa ADMIN_USERNAME y ADMIN_PASSWORD de Vercel (mín. 12 caracteres). Las de super admin son solo para /bbx-admin.'
  }
  return 'No se pudo iniciar sesión'
}
