/** Generic paginated API response */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** Generic API error shape */
export interface ApiError {
  message: string
  code?: string
  statusCode?: number
}

/** Table sort direction */
export type SortDirection = 'asc' | 'desc'

/** Table sort state */
export interface SortState {
  column: string
  direction: SortDirection
}

/** Generic select option */
export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}

/** Navigation route item */
export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}
