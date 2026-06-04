import { defineField, defineType } from 'sanity'

export const publicidadSchema = defineType({
  name: 'publicidad',
  title: 'Publicidad',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre de la campaña',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cliente',
      title: 'Cliente / Empresa',
      type: 'string',
      description: 'Nombre del negocio que paga la publicidad',
    }),
    defineField({
      name: 'planContratado',
      title: 'Plan contratado',
      type: 'string',
      description: 'Plan de venta asociado (para control interno; la app filtra por tipo y prioridad).',
      options: {
        list: [
          { title: 'Básico ($80.000)', value: 'basico' },
          { title: 'Premium ($150.000)', value: 'premium' },
          { title: 'Empresarial ($250.000)', value: 'empresarial' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'tipo',
      title: 'Tipo de banner',
      type: 'string',
      options: {
        list: [
          { title: '⭐ Banner Premium (flotante sobre la app)', value: 'banner_premium' },
          { title: 'Banner Superior (arriba del feed)', value: 'banner_superior' },
          { title: 'Banner Intermedio (en el medio)', value: 'banner_intermedio' },
          { title: 'Banner Inferior (abajo del feed)', value: 'banner_inferior' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline del anuncio',
      type: 'string',
      description: 'Frase corta del anunciante. Ej: "Tu próximo auto te está esperando"',
    }),
    defineField({
      name: 'cta',
      title: 'Texto del botón (CTA)',
      type: 'string',
      description: 'Ej: "Ver catálogo", "Llamar ahora", "Ver oferta"',
    }),
    defineField({
      name: 'colorAccent',
      title: 'Color del anuncio (hex)',
      type: 'string',
      description: 'Color corporativo del cliente. Ej: #40B9BF · Solo para banner premium.',
      initialValue: '#db8918',
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen',
      type: 'image',
      options: { hotspot: true, accept: 'image/*' },
    }),
    defineField({
      name: 'imagenUrl',
      title: 'URL de imagen externa (opcional)',
      type: 'url',
      description: 'Si se ingresa, tiene prioridad sobre la imagen subida.',
    }),
    defineField({
      name: 'enlace',
      title: 'Enlace al hacer clic',
      type: 'url',
      description: 'URL o WhatsApp del anunciante',
    }),
    defineField({
      name: 'duracionCampana',
      title: 'Duración acordada',
      type: 'string',
      description: 'Referencia comercial. Las fechas reales son inicio/fin.',
      options: {
        list: [
          { title: '1 mes estándar (30 días)', value: 'mes_estandar' },
          { title: 'Mes calendario', value: 'mes_calendario' },
          { title: '15 días', value: 'quincena' },
          { title: '1 semana', value: 'semana' },
          { title: 'Fin de semana (3 días)', value: 'finde' },
          { title: 'Personalizado (ver fechas)', value: 'personalizado' },
        ],
        layout: 'radio',
      },
      initialValue: 'mes_estandar',
    }),
    defineField({
      name: 'fechaInicio',
      title: 'Fecha de inicio',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fechaFin',
      title: 'Fecha de fin',
      type: 'datetime',
      validation: (Rule) => Rule.required().min(Rule.valueOfField('fechaInicio')),
    }),
    defineField({
      name: 'exclusivoApp',
      title: 'Exclusivo en la app (sin rotación)',
      type: 'boolean',
      initialValue: false,
      description:
        'Plan Empresarial: solo esta campaña en su tipo de banner. Si hay varias exclusivas, gana la de mayor prioridad.',
    }),
    defineField({
      name: 'activo',
      title: 'Activo',
      type: 'boolean',
      initialValue: true,
      description: 'Desactivar para pausar la campaña antes de que venza',
    }),
    defineField({
      name: 'prioridad',
      title: 'Prioridad',
      type: 'number',
      description:
        'Mayor número = se muestra primero. Guía: Básico 1–5 · Premium 6–9 (premium ≥8) · Empresarial 10+',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      cliente: 'cliente',
      tipo: 'tipo',
      plan: 'planContratado',
      imagen: 'imagen',
      activo: 'activo',
      fechaFin: 'fechaFin',
    },
    prepare({ title, cliente, tipo, plan, imagen, activo, fechaFin }) {
      const tipoLabel: Record<string, string> = {
        banner_premium: '⭐ Premium',
        banner_superior: '↑ Superior',
        banner_intermedio: '↔ Intermedio',
        banner_inferior: '↓ Inferior',
      }
      const planLabel: Record<string, string> = {
        basico: 'Básico',
        premium: 'Premium',
        empresarial: 'Empresarial',
      }
      const vence = fechaFin ? new Date(fechaFin).toLocaleDateString('es-CL') : '—'
      const planTxt = plan ? planLabel[plan] ?? plan : '—'
      return {
        title: title,
        subtitle: `${planTxt} · ${tipoLabel[tipo] ?? tipo} · ${cliente ?? '—'} · Vence ${vence} · ${activo ? '✅' : '⏸'}`,
        media: imagen,
      }
    },
  },
})
