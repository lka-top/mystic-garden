declare global {
  const H3Error: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').H3Error
  const H3Event: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').H3Event
  const IMAGE_MIME_TYPES: typeof import('../../../../../server/utils/image-upload').IMAGE_MIME_TYPES
  const MAX_ADMIN_IMAGE_SIZE: typeof import('../../../../../server/utils/image-upload').MAX_ADMIN_IMAGE_SIZE
  const MAX_NOTE_IMAGE_SIZE: typeof import('../../../../../server/utils/image-upload').MAX_NOTE_IMAGE_SIZE
  const __buildAssetsURL: typeof import('../../../../.pnpm/@nuxt+nitro-server@3.21.11_db0@0.3.4_esbuild@0.28.2_ioredis@5.11.1_supports-color@10.0._2eb6b3b4ee261884245b2d4558507643/node_modules/@nuxt/nitro-server/dist/runtime/utils/paths').buildAssetsURL
  const __publicAssetsURL: typeof import('../../../../.pnpm/@nuxt+nitro-server@3.21.11_db0@0.3.4_esbuild@0.28.2_ioredis@5.11.1_supports-color@10.0._2eb6b3b4ee261884245b2d4558507643/node_modules/@nuxt/nitro-server/dist/runtime/utils/paths').publicAssetsURL
  const appendCorsHeaders: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').appendCorsHeaders
  const appendCorsPreflightHeaders: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').appendCorsPreflightHeaders
  const appendHeader: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').appendHeader
  const appendHeaders: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').appendHeaders
  const appendResponseHeader: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').appendResponseHeader
  const appendResponseHeaders: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').appendResponseHeaders
  const applyApprovalFilter: typeof import('../../../../../server/utils/pagination').applyApprovalFilter
  const applyPublishFilter: typeof import('../../../../../server/utils/pagination').applyPublishFilter
  const assertMethod: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').assertMethod
  const cachedEventHandler: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/cache').cachedEventHandler
  const cachedFunction: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/cache').cachedFunction
  const callNodeListener: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').callNodeListener
  const clearResponseHeaders: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').clearResponseHeaders
  const clearSession: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').clearSession
  const createApp: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').createApp
  const createAppEventHandler: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').createAppEventHandler
  const createDirectUploadSignature: typeof import('../../../../../server/utils/storage').createDirectUploadSignature
  const createError: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').createError
  const createEvent: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').createEvent
  const createEventStream: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').createEventStream
  const createRouter: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').createRouter
  const createStorageObjectKey: typeof import('../../../../../server/utils/storage').createStorageObjectKey
  const defaultContentType: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').defaultContentType
  const defineAppConfig: typeof import('../../../../.pnpm/@nuxt+nitro-server@3.21.11_db0@0.3.4_esbuild@0.28.2_ioredis@5.11.1_supports-color@10.0._2eb6b3b4ee261884245b2d4558507643/node_modules/@nuxt/nitro-server/dist/runtime/utils/config').defineAppConfig
  const defineCachedEventHandler: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/cache').defineCachedEventHandler
  const defineCachedFunction: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/cache').defineCachedFunction
  const defineEventHandler: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').defineEventHandler
  const defineLazyEventHandler: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').defineLazyEventHandler
  const defineNitroErrorHandler: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/error/utils').defineNitroErrorHandler
  const defineNitroPlugin: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/plugin').defineNitroPlugin
  const defineNodeListener: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').defineNodeListener
  const defineNodeMiddleware: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').defineNodeMiddleware
  const defineRenderHandler: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/renderer').defineRenderHandler
  const defineRequestMiddleware: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').defineRequestMiddleware
  const defineResponseMiddleware: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').defineResponseMiddleware
  const defineRouteMeta: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/meta').defineRouteMeta
  const defineTask: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/task').defineTask
  const defineWebSocket: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').defineWebSocket
  const defineWebSocketHandler: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').defineWebSocketHandler
  const deleteCookie: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').deleteCookie
  const dynamicEventHandler: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').dynamicEventHandler
  const eventHandler: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').eventHandler
  const fetchWithEvent: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').fetchWithEvent
  const fromNodeMiddleware: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').fromNodeMiddleware
  const fromPlainHandler: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').fromPlainHandler
  const fromWebHandler: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').fromWebHandler
  const getClientIp: typeof import('../../../../../server/utils/validate').getClientIp
  const getClientUa: typeof import('../../../../../server/utils/validate').getClientUa
  const getCookie: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getCookie
  const getHeader: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getHeader
  const getHeaders: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getHeaders
  const getJwtSecret: typeof import('../../../../../server/utils/auth').getJwtSecret
  const getLocalFilePath: typeof import('../../../../../server/utils/storage').getLocalFilePath
  const getLocalPublicUrl: typeof import('../../../../../server/utils/storage').getLocalPublicUrl
  const getLocalRelativePath: typeof import('../../../../../server/utils/storage').getLocalRelativePath
  const getMethod: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getMethod
  const getProxyRequestHeaders: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getProxyRequestHeaders
  const getQuery: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getQuery
  const getRequestFingerprint: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getRequestFingerprint
  const getRequestHeader: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getRequestHeader
  const getRequestHeaders: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getRequestHeaders
  const getRequestHost: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getRequestHost
  const getRequestIP: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getRequestIP
  const getRequestPath: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getRequestPath
  const getRequestProtocol: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getRequestProtocol
  const getRequestURL: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getRequestURL
  const getRequestWebStream: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getRequestWebStream
  const getResponseHeader: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getResponseHeader
  const getResponseHeaders: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getResponseHeaders
  const getResponseStatus: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getResponseStatus
  const getResponseStatusText: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getResponseStatusText
  const getRouteRules: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/route-rules').getRouteRules
  const getRouterParam: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getRouterParam
  const getRouterParams: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getRouterParams
  const getSession: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getSession
  const getValidated: typeof import('../../../../../server/utils/validate').getValidated
  const getValidatedImageType: typeof import('../../../../../server/utils/image-upload').getValidatedImageType
  const getValidatedQuery: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getValidatedQuery
  const getValidatedRouterParams: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').getValidatedRouterParams
  const handleCacheHeaders: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').handleCacheHeaders
  const handleCors: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').handleCors
  const isAdminAllRequest: typeof import('../../../../../server/utils/pagination').isAdminAllRequest
  const isCorsOriginAllowed: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').isCorsOriginAllowed
  const isError: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').isError
  const isEvent: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').isEvent
  const isEventHandler: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').isEventHandler
  const isMethod: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').isMethod
  const isOssStorageConfigured: typeof import('../../../../../server/utils/storage').isOssStorageConfigured
  const isPreflightRequest: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').isPreflightRequest
  const isStream: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').isStream
  const isWebResponse: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').isWebResponse
  const lazyEventHandler: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').lazyEventHandler
  const nitroPlugin: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/plugin').nitroPlugin
  const paginationResponse: typeof import('../../../../../server/utils/response').paginationResponse
  const parseCookies: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').parseCookies
  const parseIdParam: typeof import('../../../../../server/utils/validate').parseIdParam
  const prisma: typeof import('../../../../../server/utils/prisma').prisma
  const promisifyNodeListener: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').promisifyNodeListener
  const proxyRequest: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').proxyRequest
  const readBody: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').readBody
  const readFormData: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').readFormData
  const readMultipartFormData: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').readMultipartFormData
  const readRawBody: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').readRawBody
  const readValidated: typeof import('../../../../../server/utils/validate').readValidated
  const readValidatedBody: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').readValidatedBody
  const removeResponseHeader: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').removeResponseHeader
  const requireAdminUser: typeof import('../../../../../server/utils/auth').requireAdminUser
  const requireNoteSyncToken: typeof import('../../../../../server/utils/note-sync').requireNoteSyncToken
  const runTask: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/task').runTask
  const sanitizeStatusCode: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').sanitizeStatusCode
  const sanitizeStatusMessage: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').sanitizeStatusMessage
  const sealSession: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').sealSession
  const send: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').send
  const sendError: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').sendError
  const sendIterable: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').sendIterable
  const sendNoContent: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').sendNoContent
  const sendProxy: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').sendProxy
  const sendRedirect: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').sendRedirect
  const sendStream: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').sendStream
  const sendWebResponse: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').sendWebResponse
  const serveStatic: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').serveStatic
  const setCookie: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').setCookie
  const setHeader: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').setHeader
  const setHeaders: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').setHeaders
  const setResponseHeader: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').setResponseHeader
  const setResponseHeaders: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').setResponseHeaders
  const setResponseStatus: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').setResponseStatus
  const signAuthToken: typeof import('../../../../../server/utils/auth').signAuthToken
  const splitCookiesString: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').splitCookiesString
  const successResponse: typeof import('../../../../../server/utils/response').successResponse
  const toEventHandler: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').toEventHandler
  const toNodeListener: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').toNodeListener
  const toPlainHandler: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').toPlainHandler
  const toWebHandler: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').toWebHandler
  const toWebRequest: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').toWebRequest
  const tryGetAdminUser: typeof import('../../../../../server/utils/auth').tryGetAdminUser
  const tryGetAuthUser: typeof import('../../../../../server/utils/auth').tryGetAuthUser
  const unsealSession: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').unsealSession
  const updateSession: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').updateSession
  const uploadFileToStorage: typeof import('../../../../../server/utils/storage').uploadFileToStorage
  const useAppConfig: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/config').useAppConfig
  const useBase: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').useBase
  const useEvent: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/context').useEvent
  const useNitroApp: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/app').useNitroApp
  const useRuntimeConfig: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/config').useRuntimeConfig
  const useSession: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').useSession
  const useStorage: typeof import('../../../../.pnpm/nitropack@2.13.4_oxc-parser@0.143.0_srvx@0.11.22_supports-color@10.0.0_vite@7.3.6_@type_c4c2664677c4b464f2592e185fb0e194/node_modules/nitropack/dist/runtime/internal/storage').useStorage
  const writeEarlyHints: typeof import('../../../../.pnpm/h3@1.15.11/node_modules/h3').writeEarlyHints
}
// for type re-export
declare global {
  // @ts-ignore
  export type { EventHandler, EventHandlerRequest, EventHandlerResponse, EventHandlerObject, H3EventContext } from '../../../../.pnpm/h3@1.15.11/node_modules/h3'
  import('../../../../.pnpm/h3@1.15.11/node_modules/h3')
  // @ts-ignore
  export type { User, Category, Tag, Notebook, Note, Article, Essay, Comment, ApiResponse, Pagination, PaginatedList, AuthUser, StatsOverview, FetchErrorLike } from '../../../../../shared/types/index'
  import('../../../../../shared/types/index')
  // @ts-ignore
  export type { AuthPayload } from '../../../../../server/utils/auth'
  import('../../../../../server/utils/auth')
  // @ts-ignore
  export type { SupportedImageMimeType } from '../../../../../server/utils/image-upload'
  import('../../../../../server/utils/image-upload')
  // @ts-ignore
  export type { PaginationMeta } from '../../../../../server/utils/response'
  import('../../../../../server/utils/response')
  // @ts-ignore
  export type { StorageScope, StorageDriver, StorageUploadOptions } from '../../../../../server/utils/storage'
  import('../../../../../server/utils/storage')
}
export { H3Event, H3Error, appendCorsHeaders, appendCorsPreflightHeaders, appendHeader, appendHeaders, appendResponseHeader, appendResponseHeaders, assertMethod, callNodeListener, clearResponseHeaders, clearSession, createApp, createAppEventHandler, createError, createEvent, createEventStream, createRouter, defaultContentType, defineEventHandler, defineLazyEventHandler, defineNodeListener, defineNodeMiddleware, defineRequestMiddleware, defineResponseMiddleware, defineWebSocket, defineWebSocketHandler, deleteCookie, dynamicEventHandler, eventHandler, fetchWithEvent, fromNodeMiddleware, fromPlainHandler, fromWebHandler, getCookie, getHeader, getHeaders, getMethod, getProxyRequestHeaders, getQuery, getRequestFingerprint, getRequestHeader, getRequestHeaders, getRequestHost, getRequestIP, getRequestPath, getRequestProtocol, getRequestURL, getRequestWebStream, getResponseHeader, getResponseHeaders, getResponseStatus, getResponseStatusText, getRouterParam, getRouterParams, getSession, getValidatedQuery, getValidatedRouterParams, handleCacheHeaders, handleCors, isCorsOriginAllowed, isError, isEvent, isEventHandler, isMethod, isPreflightRequest, isStream, isWebResponse, lazyEventHandler, parseCookies, promisifyNodeListener, proxyRequest, readBody, readFormData, readMultipartFormData, readRawBody, readValidatedBody, removeResponseHeader, sanitizeStatusCode, sanitizeStatusMessage, sealSession, send, sendError, sendIterable, sendNoContent, sendProxy, sendRedirect, sendStream, sendWebResponse, serveStatic, setCookie, setHeader, setHeaders, setResponseHeader, setResponseHeaders, setResponseStatus, splitCookiesString, toEventHandler, toNodeListener, toPlainHandler, toWebHandler, toWebRequest, unsealSession, updateSession, useBase, useSession, writeEarlyHints } from 'h3';
export { useNitroApp } from 'nitropack/runtime/internal/app';
export { useRuntimeConfig, useAppConfig } from 'nitropack/runtime/internal/config';
export { defineNitroPlugin, nitroPlugin } from 'nitropack/runtime/internal/plugin';
export { defineCachedFunction, defineCachedEventHandler, cachedFunction, cachedEventHandler } from 'nitropack/runtime/internal/cache';
export { useStorage } from 'nitropack/runtime/internal/storage';
export { defineRenderHandler } from 'nitropack/runtime/internal/renderer';
export { defineRouteMeta } from 'nitropack/runtime/internal/meta';
export { getRouteRules } from 'nitropack/runtime/internal/route-rules';
export { useEvent } from 'nitropack/runtime/internal/context';
export { defineTask, runTask } from 'nitropack/runtime/internal/task';
export { defineNitroErrorHandler } from 'nitropack/runtime/internal/error/utils';
export { buildAssetsURL as __buildAssetsURL, publicAssetsURL as __publicAssetsURL } from '/home/li/workspace/mystic-garden/node_modules/.pnpm/@nuxt+nitro-server@3.21.11_db0@0.3.4_esbuild@0.28.2_ioredis@5.11.1_supports-color@10.0._2eb6b3b4ee261884245b2d4558507643/node_modules/@nuxt/nitro-server/dist/runtime/utils/paths';
export { defineAppConfig } from '/home/li/workspace/mystic-garden/node_modules/.pnpm/@nuxt+nitro-server@3.21.11_db0@0.3.4_esbuild@0.28.2_ioredis@5.11.1_supports-color@10.0._2eb6b3b4ee261884245b2d4558507643/node_modules/@nuxt/nitro-server/dist/runtime/utils/config';
export { getJwtSecret, requireAdminUser, tryGetAdminUser, tryGetAuthUser, signAuthToken } from '/home/li/workspace/mystic-garden/server/utils/auth';
export { MAX_ADMIN_IMAGE_SIZE, MAX_NOTE_IMAGE_SIZE, IMAGE_MIME_TYPES, getValidatedImageType } from '/home/li/workspace/mystic-garden/server/utils/image-upload';
export { requireNoteSyncToken } from '/home/li/workspace/mystic-garden/server/utils/note-sync';
export { applyPublishFilter, applyApprovalFilter, isAdminAllRequest } from '/home/li/workspace/mystic-garden/server/utils/pagination';
export { prisma } from '/home/li/workspace/mystic-garden/server/utils/prisma';
export { successResponse, paginationResponse } from '/home/li/workspace/mystic-garden/server/utils/response';
export { getLocalRelativePath, getLocalFilePath, getLocalPublicUrl, isOssStorageConfigured, createStorageObjectKey, uploadFileToStorage, createDirectUploadSignature } from '/home/li/workspace/mystic-garden/server/utils/storage';
export { readValidated, getValidated, parseIdParam, getClientIp, getClientUa } from '/home/li/workspace/mystic-garden/server/utils/validate';