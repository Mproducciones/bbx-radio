import { defineField, defineType } from 'sanity'

export const programaSchema = defineType({
  name: 'programa',
  title: 'Programa',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre del programa',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'host',
      title: 'Conductor / DJ',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Hora de inicio',
      type: 'string',
      description: 'Formato HH:MM — ej: 06:00',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'endTime',
      title: 'Hora de término',
      type: 'string',
      description: 'Formato HH:MM — ej: 10:00',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'days',
      title: 'Días de emisión',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Lunes', value: 'mon' },
          { title: 'Martes', value: 'tue' },
          { title: 'Miércoles', value: 'wed' },
          { title: 'Jueves', value: 'thu' },
          { title: 'Viernes', value: 'fri' },
          { title: 'Sábado', value: 'sat' },
          { title: 'Domingo', value: 'sun' },
        ],
      },
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Descripción corta',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'image',
      title: 'Foto del conductor',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'host',
      media: 'image',
    },
  },
})
