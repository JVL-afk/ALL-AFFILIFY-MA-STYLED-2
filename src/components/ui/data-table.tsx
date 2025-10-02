'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  RefreshCw,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  X,
  Plus,
  Minus,
  Calendar,
  Clock,
  User,
  Globe,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'

// Types
interface Column {
  key: string
  title: string
  sortable?: boolean
  filterable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any, index: number) => React.ReactNode
  type?: 'text' | 'number' | 'date' | 'boolean' | 'currency' | 'percentage' | 'status'
  filterOptions?: string[]
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  loading?: boolean
  error?: string
  searchable?: boolean
  filterable?: boolean
  sortable?: boolean
  selectable?: boolean
  pagination?: boolean
  pageSize?: number
  onRowClick?: (row: any, index: number) => void
  onRowSelect?: (selectedRows: any[]) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  onFilter?: (filters: Record<string, any>) => void
  onSearch?: (query: string) => void
  actions?: Array<{
    label: string
    icon?: React.ReactNode
    onClick: (row: any, index: number) => void
    variant?: 'primary' | 'secondary' | 'danger'
    show?: (row: any) => boolean
  }>
  bulkActions?: Array<{
    label: string
    icon?: React.ReactNode
    onClick: (selectedRows: any[]) => void
    variant?: 'primary' | 'secondary' | 'danger'
  }>
  emptyState?: React.ReactNode
  className?: string
}

// Status badge component
const StatusBadge = ({ status, variant = 'default' }: { status: string, variant?: string }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'published':
      case 'success':
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'inactive':
      case 'draft':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'processing':
      case 'loading':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  )
}

// Cell renderer based on type
const CellRenderer = ({ value, type, column, row, index }: any) => {
  if (column.render) {
    return column.render(value, row, index)
  }

  switch (type) {
    case 'currency':
      return (
        <span className="font-medium text-gray-900">
          ${typeof value === 'number' ? value?.toLocaleString() || "0" : value}
        </span>
      )
    
    case 'percentage':
      return (
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-900">{value}%</span>
          {value > 0 ? (
            <TrendingUp className="w-3 h-3 text-green-500" />
          ) : value < 0 ? (
            <TrendingDown className="w-3 h-3 text-red-500" />
          ) : null}
        </div>
      )
    
    case 'date':
      return (
        <span className="text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    
    case 'boolean':
      return value ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500" />
      )
    
    case 'status':
      return <StatusBadge status={value} />
    
    case 'number':
      return (
        <span className="font-medium text-gray-900">
          {typeof value === 'number' ? value?.toLocaleString() || "0" : value}
        </span>
      )
    
    default:
      return <span className="text-gray-900">{value}</span>
  }
}

// Main DataTable component
export const DataTable = ({
  data,
  columns,
  loading = false,
  error,
  searchable = true,
  filterable = true,
  sortable = true,
  selectable = false,
  pagination = true,
  pageSize = 10,
  onRowClick,
  onRowSelect,
  onSort,
  onFilter,
  onSearch,
  actions = [],
  bulkActions = [],
  emptyState,
  className = ""
}: DataTableProps) => {
  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let result = [...data]

    // Search
    if (searchQuery) {
      result = result.filter(row =>
        columns.some(column =>
          String(row[column.key]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Filter
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(row => {
          if (Array.isArray(value)) {
            return value.includes(row[key])
          }
          return String(row[key]).toLowerCase().includes(String(value).toLowerCase())
        })
      }
    })

    // Sort
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
        }
        
        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()
        
        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      })
    }

    return result
  }, [data, searchQuery, filters, sortColumn, sortDirection, columns])

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize)
  const paginatedData = pagination 
    ? processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : processedData

  // Handlers
  const handleSort = useCallback((column: string) => {
    if (!sortable) return
    
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
    
    onSort?.(column, sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc')
  }, [sortColumn, sortDirection, sortable, onSort])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    onSearch?.(query)
  }, [onSearch])

  const handleFilter = useCallback((key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setCurrentPage(1)
    onFilter?.(newFilters)
  }, [filters, onFilter])

  const handleSelectRow = useCallback((row: any, checked: boolean) => {
    if (!selectable) return
    
    let newSelected
    if (checked) {
      newSelected = [...selectedRows, row]
    } else {
      newSelected = selectedRows.filter(r => r !== row)
    }
    
    setSelectedRows(newSelected)
    onRowSelect?.(newSelected)
  }, [selectedRows, selectable, onRowSelect])

  const handleSelectAll = useCallback((checked: boolean) => {
    if (!selectable) return
    
    const newSelected = checked ? [...paginatedData] : []
    setSelectedRows(newSelected)
    onRowSelect?.(newSelected)
  }, [paginatedData, selectable, onRowSelect])

  // Render loading state
  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="p-8 text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="p-8 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
                />
              </div>
            )}
            
            {filterable && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  showFilters ? 'bg-purple-50 border-purple-200 text-purple-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedRows.length > 0 && bulkActions.length > 0 && (
              <div className="flex items-center gap-2 mr-4">
                <span className="text-sm text-gray-600">
                  {selectedRows.length} selected
                </span>
                {bulkActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => action.onClick(selectedRows)}
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      action.variant === 'danger' 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : action.variant === 'primary'
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
            
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                {columns.filter(col => col.filterable).map(column => (
                  <div key={column.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {column.title}
                    </label>
                    {column.filterOptions ? (
                      <select
                        value={filters[column.key] || ''}
                        onChange={(e) => handleFilter(column.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">All</option>
                        {column.filterOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={filters[column.key] || ''}
                        onChange={(e) => handleFilter(column.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder={`Filter ${column.title.toLowerCase()}...`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
              )}
              
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  style={{ width: column.width }}
                >
                  {column.sortable && sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                    >
                      {column.title}
                      {sortColumn === column.key ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-4 h-4 opacity-50" />
                      )}
                    </button>
                  ) : (
                    column.title
                  )}
                </th>
              ))}
              
              {actions.length > 0 && (
                <th className="w-20 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
                  {emptyState || (
                    <div>
                      <Info className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No data available</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`hover:bg-gray-50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${selectedRows.includes(row) ? 'bg-purple-50' : ''}`}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row)}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleSelectRow(row, e.target.checked)
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                  )}
                  
                  {columns.map(column => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap ${
                        column.align === 'center' ? 'text-center' : 
                        column.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <CellRenderer
                        value={row[column.key]}
                        type={column.type}
                        column={column}
                        row={row}
                        index={index}
                      />
                    </td>
                  ))}
                  
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {actions.map((action, actionIndex) => {
                          if (action.show && !action.show(row)) return null
                          
                          return (
                            <button
                              key={actionIndex}
                              onClick={(e) => {
                                e.stopPropagation()
                                action.onClick(row, index)
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${
                                action.variant === 'danger' 
                                  ? 'text-red-600 hover:bg-red-100'
                                  : action.variant === 'primary'
                                  ? 'text-purple-600 hover:bg-purple-100'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                              title={action.label}
                            >
                              {action.icon || <MoreHorizontal className="w-4 h-4" />}
                            </button>
                          )
                        })}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable

