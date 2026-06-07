import type { RadioConfig } from '@/types/radio'

const config: RadioConfig = {
  id:       'radio-bienvenida',
  name:     'Radio Bienvenida FM',
  slogan:   'La radio de O\'Higgins',
  frequency: '93.3 FM',
  city:     'Rancagua',
  country:  'CL',
  location: {
    label: 'Rancagua',
    lat: -34.1708,
    lon: -70.7444,
    timezone: 'America/Santiago',
  },
  streamUrl: 'https://sonicstream-puntual.grupozgh.cl/8180/bienenida',
  primaryColor: '#0055A4',
  logoUrl: 'https://radiobienvenida.cl/bienvenida/site/artic/20230727/imag/foto_0000000120230727153324/LOGO_BIENVENIDA.png',
}

export default config
