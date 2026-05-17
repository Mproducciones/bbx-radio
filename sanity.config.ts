import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  name: 'radio-bienvenida',
  title: 'Radio Bienvenida 93.3 FM — Panel de Administración',
  schema: { types: schemaTypes },
  theme: {
    __colorMode: 'dark',
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Panel de contenido')
          .items([
            S.listItem()
              .title('📰 Noticias')
              .schemaType('noticia')
              .child(S.documentTypeList('noticia').title('Noticias')),

            S.listItem()
              .title('📅 Eventos')
              .schemaType('evento')
              .child(S.documentTypeList('evento').title('Eventos')),

            S.listItem()
              .title('🎙️ Programas')
              .schemaType('programa')
              .child(S.documentTypeList('programa').title('Programas')),

            S.listItem()
              .title('▶️ Replay')
              .schemaType('replay')
              .child(S.documentTypeList('replay').title('Replay')),

            S.listItem()
              .title('🎵 Lanzamientos')
              .schemaType('lanzamiento')
              .child(S.documentTypeList('lanzamiento').title('Lanzamientos')),

            S.divider(),

            S.listItem()
              .title('📢 Publicidad (banners)')
              .schemaType('publicidad')
              .child(S.documentTypeList('publicidad').title('Publicidad')),

            S.listItem()
              .title('💼 Paquetes Publicitarios')
              .schemaType('paquetesPublicitarios')
              .child(S.documentTypeList('paquetesPublicitarios').title('Paquetes Publicitarios')),
          ]),
    }),
    visionTool(),
  ],
})
