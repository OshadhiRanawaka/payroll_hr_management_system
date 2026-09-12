import { useContext } from 'react'
import { RoleContext } from './RoleContextDef'

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
