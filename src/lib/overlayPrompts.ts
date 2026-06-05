/** Evita que install + push compitan el mismo día en la primera sesión */

const INSTALL_ACTIVE = 'bbx-install-banner-active'
const INSTALL_SETTLED = 'bbx-install-banner-settled'

export function markInstallBannerActive() {
  try {
    sessionStorage.setItem(INSTALL_ACTIVE, '1')
  } catch { /* ignore */ }
}

export function markInstallBannerSettled() {
  try {
    sessionStorage.removeItem(INSTALL_ACTIVE)
    sessionStorage.setItem(INSTALL_SETTLED, '1')
  } catch { /* ignore */ }
}

export function isInstallBannerActive(): boolean {
  try {
    return sessionStorage.getItem(INSTALL_ACTIVE) === '1'
  } catch {
    return false
  }
}

export function canShowPushPrompt(): boolean {
  if (isInstallBannerActive()) return false
  try {
    return sessionStorage.getItem(INSTALL_SETTLED) === '1'
      || localStorage.getItem('pwa-install-dismissed') === '1'
  } catch {
    return true
  }
}
