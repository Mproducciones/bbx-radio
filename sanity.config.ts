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
          .title('Contenido')
          .items([
            S.listItem().title('Publicidad').schemaType('publicidad').child(
              S.documentTypeList('publicidad').title('Publicidad')
            ),
            S.listItem().title('Paquetes Publicitarios').schemaType('paquetesPublicitarios').child(
              S.documentTypeList('paquetesPublicitarios').title('Paquetes Publicitarios')
            ),
          ]),
    }),
    visionTool(),
  ],
})
