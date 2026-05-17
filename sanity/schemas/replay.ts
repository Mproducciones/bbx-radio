import { defineField, defineType } from 'sanity'

export const replaySchema = defineType({
  name: 'replay',
  title: 'Replay (programa grabado)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título del episodio',
      type: 'string',
      description: 'Ej: "Clan Marciano — Especial reggaetón"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'program',
      title: 'Programa',
      type: 'string',
      options: {
        list: [
          { title: 'Matinal Bienvenida', value: 'Matinal Bienvenida' },
          { title: 'Mix del Día', value: 'Mix del Día' },
          { title: 'Tarde en Rancagua', value: 'Tarde en Rancagua' },
          { title: 'Noche FM', value: 'Noche FM' },
          { title: 'Sábado Mix', value: 'Sábado Mix' },
          { title: 'Domingo Bienvenida', value: 'Domingo Bienvenida' },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'host',
      title: 'Conductor',
      type: 'string',
    }),
    defineField({
      name: 'broadcastDate',
      title: 'Fecha de emisión original',
      type: 'date',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duración',
      type: 'string',
      description: 'Ej: "4h", "1h30m"',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'URL de YouTube',
      type: 'url',
      description: 'Enlace al video en YouTube (recomendado)',
    }),
    defineField({
      name: 'soundcloudUrl',
      title: 'URL de SoundCloud',
      type: 'url',
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'URL de Spotify',
      type: 'url',
    }),
    defineField({
      name: 'image',
      title: 'Imagen de portada',
      type: 'image',
      options: { hotspot: true },
      description: 'Opcional — se usará una imagen genérica del programa si no se sube',
    }),
  ],
  orderings: [
    {
      title: 'Más recientes primero',
      name: 'broadcastDateDesc',
      by: [{ field: 'broadcastDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'program', media: 'image' },
  },
})
