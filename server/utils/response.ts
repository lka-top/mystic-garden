export function successResponse<T>(data: T, message = 'success') {
  return {
    code: 200,
    message,
    data
  }
}

export interface PaginationMeta {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function paginationResponse<T>(
  list: T[],
  total: number,
  page: number,
  pageSize: number
) {
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      } satisfies PaginationMeta
    }
  }
}