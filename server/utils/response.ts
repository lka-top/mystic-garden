export function successResponse<T = any>(data: T, message = 'success') {
  return {
    code: 200,
    message,
    data
  }
}

export function paginationResponse<T = any>(
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
      }
    }
  }
}
