# Análisis Completo - Radio Bienvenida FM

## Información General
- **URL**: https://radiobienvenida.cl/
- **CMS**: WordPress (Prontus)
- **Streaming**: MP3 + HLS (video)
- **Google Tag Manager**: GTM-M8XHWNF

---

## Estructura del Sitio

### Menú Principal (Header)
1. **Región de O'higgins** - `/regiondeohiggins` (404 en análisis)
2. **Actualidad** - `/actualidad`
3. **Regionales** - `/regionales`
4. **Tendencias** - `/tendencias`
5. **Internacional** - `/internacional`
6. **Deportes** - `/deportes`
7. **Entrevistas** - `/entrevistas`

### Componentes del Header
- **Logo**: Radio Bienvenida FM
- **Reproductor**: "Señal En Vivo" con botón play/pause
- **Redes Sociales**: Facebook, Twitter, Instagram
- **Botones de Acceso** (ELIMINAR en PULSO):
  - Botón de accesibilidad (ic-access)
  - Modo claro/oscuro
  - Búsqueda (menu__search)

---

## Secciones de Contenido

### Home
- **Player de Video**: "Señal TV En Vivo - Radio Bienvenida"
- **Sección Región de O'higgins**: Cards con noticias locales
- **Sección Regionales**: Noticias de otras regiones
- **Sección Actualidad**: Noticias nacionales
- **Sección Tendencias**: Noticias virales
- **Sección Internacional**: Noticias mundiales
- **Sección Deportes**: Noticias deportivas
- **Sección Entrevistas**: Entrevistas exclusivas
- **Sección Emergencias y Salud**: Noticias de salud

### Estructura de Cards
```html
<article class="card">
  <figure class="card__img">
    <img src="..." alt="...">
    <a class="card__pill">Categoría</a>
  </figure>
  <div class="card__content">
    <p class="card__epig">Fecha</p>
    <h3 class="card__title">Título</h3>
  </div>
</article>
```

---

## Botones de Acceso a Eliminar/Modificar

### Header - Botones Secundarios
```html
<ul class="header__btns">
  <li class="item-icon">
    <!-- ELIMINAR: Botón accesibilidad -->
    <button class="ic-access color-texto">...</button>
  </li>
  <li class="item-icon">
    <!-- ELIMINAR: Modo claro/oscuro -->
    <button class="ic-mode color-texto">...</button>
  </li>
</ul>
```

### Menú Móvil - Búsqueda
```html
<!-- ELIMINAR: Barra de búsqueda -->
<div class="menu__search">
  <input type="text" class="search-input" placeholder="Ingresa tu búsqueda">
  <button class="search-icon">...</button>
</div>
```

---

## Google Ads (Eliminar en PULSO)

### Ad Units Identificadas
- `radios_reg_itt` (1x1)
- `radios_reg_sticky` (1x2)
- `radios_reg_top` (320x50, 728x90, 970x90, etc.)
- `radios_reg_middle1` (300x250, 728x90, etc.)
- `radios_reg_middle2` (300x250, 728x90, etc.)
- `radios_reg_middle3` (300x250, 728x90, etc.)
- `radios_reg_middle4` (300x250, 728x90, etc.)
- `radios_reg_footer` (300x50)

---

## Footer

### Información de Contacto
- **Logo**: Radio Bienvenida
- **Redes Sociales**: Facebook, Twitter, Instagram
- **Contacto**:
  - Teléfono: +56 72 2 23 03 99
  - WhatsApp: +56 9 50291592
  - Email: contacto@radiobienvenida.cl
- **Dirección**: Cuevas 289 - Rancagua - Región de O'higgins

---

## Streaming

### Audio Stream (Principal)
- **URL**: `https://sonicstream-puntual.grupozgh.cl/8180/bienenida`
- **Formato**: MP3
- **Bitrate**: 128 kbps

### Video Stream (HLS)
- **URL**: `https://panel.tvstream.cl:1936/8012/8012/playlist.m3u8`
- **Formato**: HLS (m3u8)
- **Resolución**: 1280x720
- **Bitrate**: ~1.6 Mbps
- **Codecs**: H.264 + AAC

---

## Contenido a Replicar en PULSO

### ✅ Mantener
1. **Reproductor de audio** con play/pause
2. **Secciones de noticias** (Actualidad, Regionales, etc.)
3. **Cards de artículos** con imágenes
4. **Footer** con contacto y redes sociales
5. **Logo** y branding de Radio Bienvenida

### ❌ Eliminar
1. **Botón de accesibilidad**
2. **Modo claro/oscuro**
3. **Barra de búsqueda**
4. **Todos los Google Ads**
5. **Scripts de analytics de terceros** (mantener solo GTM)

### 🔄 Modificar
1. **Menú principal**: Simplificar a secciones esenciales
2. **Header**: Eliminar botones secundarios
3. **Footer**: Mantener solo información esencial

---

## Colores Identificados

- **Primario**: #0055A4 (Azul Bienvenida)
- **Secundario**: #E8B400 (Dorado)
- **Enfasis**: Color variable usado en CTAs

---

## Scripts de Terceros

### Mantener
- Google Tag Manager (GTM-M8XHWNF)
- jQuery
- Swiper (slider)
- FontAwesome

### Eliminar
- Google Ads (todos los scripts)
- Scripts de analytics adicionales

---

## Recursos de Imágenes

- **Logo**: `/bienvenida/site/artic/20230727/imag/foto_0000000120230727153324/LOGO_BIENVENIDA.png`
- **Favicon**: `/bienvenida/favicon.png`
- **Artículos**: `/radios/site/artic/[YYYYMMDD]/imag/[filename]`

---

## Próximos Pasos

1. ✅ Crear archivo de configuración `clients/radio-bienvenida.config.ts`
2. ✅ Analizar estructura completa del sitio
3. ⏳ Actualizar `.env.local` con variables de Radio Bienvenida
4. ⏳ Implementar navegación simplificada en PULSO
5. ⏳ Integrar streaming de audio
6. ⏳ Crear componentes de noticias/cards
7. ⏳ Configurar Sanity CMS para Radio Bienvenida
