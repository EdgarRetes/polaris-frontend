type AuditLog = {
  id: number
  entityName: string
  recordId: number
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  before?: Record<string, any> | null
  after?: Record<string, any> | null
  userId?: number | null
  createdAt: string
}

export default AuditLog
