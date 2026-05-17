import { noticiaSchema }              from './noticia'
import { eventoSchema }               from './evento'
import { replaySchema }               from './replay'
import { lanzamientoSchema }          from './lanzamiento'
import { programaSchema }             from './programa'
import { publicidadSchema }           from './publicidad'
import { paquetesPublicitariosSchema } from './paquetesPublicitarios'

export const schemaTypes = [
  noticiaSchema,
  eventoSchema,
  replaySchema,
  lanzamientoSchema,
  programaSchema,
  publicidadSchema,
  paquetesPublicitariosSchema,
]
