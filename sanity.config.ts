import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'
import { radioStructure } from './sanity/structure/radioStructure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  name: 'radio-bienvenida',
  title: 'Editor de contenido · Radio Bienvenida',
  schema: { types: schemaTypes },
  theme: {
    __colorMode: 'dark',
  },
  plugins: [
    structureTool({
      structure: radioStructure,
    }),
  ],
})
