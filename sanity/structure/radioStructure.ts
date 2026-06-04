import type { StructureResolver } from 'sanity/structure'
import { AdminPanelLink } from '../components/AdminPanelLink'

/**
 * Menú alineado a la PWA: publicidad primero, luego grilla y editorial.
 * El panel operativo sigue siendo /admin (no confundir con este editor).
 */
export const radioStructure: StructureResolver = (S) =>
  S.list()
    .title('Editor de contenido')
    .items([
      S.listItem()
        .title('← Panel radio (operación)')
        .child(S.component().id('admin-link').component(AdminPanelLink)),

      S.divider(),

      S.listItem()
        .title('📢 Campañas publicitarias')
        .schemaType('publicidad')
        .child(
          S.documentTypeList('publicidad')
            .title('Banners en la app')
            .defaultOrdering([{ field: 'prioridad', direction: 'desc' }]),
        ),

      S.listItem()
        .title('🎙️ Grilla · Programas')
        .schemaType('programa')
        .child(
          S.documentTypeList('programa')
            .title('Programación (/programacion)')
            .defaultOrdering([{ field: 'startTime', direction: 'asc' }]),
        ),

      S.divider(),

      S.listItem()
        .title('📰 Noticias')
        .schemaType('noticia')
        .child(S.documentTypeList('noticia').title('Noticias (/noticias)')),

      S.listItem()
        .title('📅 Eventos')
        .schemaType('evento')
        .child(S.documentTypeList('evento').title('Eventos (/eventos)')),

      S.listItem()
        .title('▶️ Replay')
        .schemaType('replay')
        .child(S.documentTypeList('replay').title('Replay (/replay)')),

      S.listItem()
        .title('🎵 Lanzamientos')
        .schemaType('lanzamiento')
        .child(S.documentTypeList('lanzamiento').title('Lanzamientos')),

      S.divider(),

      S.listItem()
        .title('💼 Textos página Anunciate')
        .schemaType('paquetesPublicitarios')
        .child(
          S.documentTypeList('paquetesPublicitarios').title('Solo precios/copy de venta'),
        ),
    ])
