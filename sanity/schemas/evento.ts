import { defineField, defineType } from 'sanity'

export const eventoSchema = defineType({
  name: 'evento',
  title: 'Evento / Concierto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre del evento',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'date',
      title: 'Fecha y hora',
      type: 'datetime',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Lugar',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'string',
      initialValue: 'Rancagua',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'isFree',
      title: '¿Es gratis?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'price',
      title: 'Precio (si no es gratis)',
      type: 'string',
      description: 'Ejemplo: $8.000 CLP',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Enlace de entradas',
      type: 'url',
    }),
    defineField({
      name: 'image',
      title: 'Imagen del evento',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  orderings: [
    {
      title: 'Próximos primero',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'venue', media: 'image' },
  },
})
