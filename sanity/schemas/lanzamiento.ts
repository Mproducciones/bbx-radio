import { defineField, defineType } from 'sanity'

export const lanzamientoSchema = defineType({
  name: 'lanzamiento',
  title: 'Lanzamiento musical',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre del tema / álbum',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'artist',
      title: 'Artista',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'releaseType',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Single', value: 'Single' },
          { title: 'EP', value: 'EP' },
          { title: 'Álbum', value: 'Álbum' },
          { title: 'Colaboración', value: 'Colaboración' },
        ],
      },
      initialValue: 'Single',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'genre',
      title: 'Género',
      type: 'string',
      options: {
        list: [
          { title: 'Reggaetón', value: 'Reggaetón' },
          { title: 'Pop', value: 'Pop' },
          { title: 'Cumbia', value: 'Cumbia' },
          { title: 'Electrónica', value: 'Electrónica' },
          { title: 'Salsa', value: 'Salsa' },
          { title: 'Rock', value: 'Rock' },
          { title: 'Pop Latino', value: 'Pop Latino' },
          { title: 'Trap', value: 'Trap' },
        ],
      },
    }),
    defineField({
      name: 'releaseDate',
      title: 'Fecha de lanzamiento',
      type: 'date',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'cover',
      title: 'Portada',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify',
      type: 'url',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube / Video clip',
      type: 'url',
    }),
    defineField({
      name: 'appleMusicUrl',
      title: 'Apple Music',
      type: 'url',
    }),
  ],
  orderings: [
    {
      title: 'Más recientes primero',
      name: 'releaseDateDesc',
      by: [{ field: 'releaseDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'artist',
      media: 'cover',
    },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: `${subtitle}`, media }
    },
  },
})
