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
      name: 'tipo',
      title: 'Tipo de publicidad',
      type: 'string',
      options: {
        list: [
          { title: 'Banner Superior', value: 'banner_superior' },
          { title: 'Banner Intermedio', value: 'banner_intermedio' },
          { title: 'Banner Inferior', value: 'banner_inferior' },
          { title: 'Pop-up Intersticial', value: 'popup_intersticial' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true,
        accept: 'image/*',
      },
    }),
    defineField({
      name: 'imagenUrl',
      title: 'URL de imagen externa (opcional)',
      type: 'url',
      description: 'Usa una URL externa en lugar de subir un archivo. Si se proporciona, tiene prioridad sobre el archivo subido.',
    }),
    defineField({
      name: 'enlace',
      title: 'Enlace (opcional)',
      type: 'url',
      description: 'URL a donde redirige al hacer clic en la publicidad',
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
      name: 'activo',
      title: 'Activo',
      type: 'boolean',
      initialValue: true,
      description: 'Si está desactivado, la publicidad no se mostrará aunque esté dentro del rango de fechas',
    }),
    defineField({
      name: 'prioridad',
      title: 'Prioridad',
      type: 'number',
      description: 'Mayor número = mayor prioridad. Si hay múltiples publicidades activas del mismo tipo, se mostrará la de mayor prioridad.',
      initialValue: 1,
    }),
    defineField({
      name: 'cliente',
      title: 'Nombre del cliente',
      type: 'string',
      description: 'Nombre de la empresa o cliente que paga por la publicidad',
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      tipo: 'tipo',
      imagen: 'imagen',
      activo: 'activo',
    },
    prepare(selection) {
      const { title, tipo, imagen, activo } = selection
      return {
        title: title,
        subtitle: `${tipo} - ${activo ? 'Activo' : 'Inactivo'}`,
        media: imagen,
      }
    },
  },
})
