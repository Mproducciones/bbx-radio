import { defineField, defineType } from 'sanity'

export const paquetesPublicitariosSchema = defineType({
  name: 'paquetesPublicitarios',
  title: 'Paquetes Publicitarios',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título Principal',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitulo',
      title: 'Subtítulo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paqueteBasico',
      title: 'Paquete Básico',
      type: 'object',
      fields: [
        defineField({
          name: 'nombre',
          title: 'Nombre del Paquete',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'precio',
          title: 'Precio (CLP)',
          type: 'number',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'periodo',
          title: 'Período',
          type: 'string',
          initialValue: 'mes',
        }),
        defineField({
          name: 'caracteristicas',
          title: 'Características',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'paquetePremium',
      title: 'Paquete Premium',
      type: 'object',
      fields: [
        defineField({
          name: 'nombre',
          title: 'Nombre del Paquete',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'precio',
          title: 'Precio (CLP)',
          type: 'number',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'periodo',
          title: 'Período',
          type: 'string',
          initialValue: 'mes',
        }),
        defineField({
          name: 'caracteristicas',
          title: 'Características',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'paqueteEmpresarial',
      title: 'Paquete Empresarial',
      type: 'object',
      fields: [
        defineField({
          name: 'nombre',
          title: 'Nombre del Paquete',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'precio',
          title: 'Precio (CLP)',
          type: 'number',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'periodo',
          title: 'Período',
          type: 'string',
          initialValue: 'mes',
        }),
        defineField({
          name: 'caracteristicas',
          title: 'Características',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'whatsapp',
      title: 'Número de WhatsApp',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
    },
    prepare({ title }) {
      return {
        title: `Paquetes: ${title}`,
      }
    },
  },
})
