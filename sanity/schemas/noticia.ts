import { defineField, defineType } from 'sanity'

export const noticiaSchema = defineType({
  name: 'noticia',
  title: 'Noticia',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
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
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Radio', value: 'Radio' },
          { title: 'Música', value: 'Música' },
          { title: 'Lanzamientos', value: 'Lanzamientos' },
          { title: 'Eventos', value: 'Eventos' },
          { title: 'Programas', value: 'Programas' },
          { title: 'Cultura', value: 'Cultura' },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumen',
      type: 'text',
      rows: 3,
      validation: (R) => R.required().max(300),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagen destacada',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'externalLink',
      title: 'Enlace al artículo completo',
      type: 'url',
      description: 'URL de la noticia en el sitio web de la radio (opcional)',
    }),
  ],
  orderings: [
    {
      title: 'Más recientes primero',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'image' },
  },
})
