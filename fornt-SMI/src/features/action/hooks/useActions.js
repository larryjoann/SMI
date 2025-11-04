import { useCallback, useState } from 'react'
import * as service from '../services/actionService'

export default function useActions() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [actions, setActions] = useState([])
  const [statuses, setStatuses] = useState([])

  const fetchActions = useCallback(async () => {
    setLoading(true)
    try {
      const list = await service.fetchActions()
      setActions(list || [])
    } catch (err) {
      console.error('Error fetching actions (hook)', err)
      setActions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStatuses = useCallback(async () => {
    try {
      const list = await service.fetchStatuses()
      setStatuses(list && list.length ? list : [])
    } catch (err) {
      console.error('Error fetching statuses (hook)', err)
      setStatuses([])
    }
  }, [])

  const updateActionStatusOnServer = useCallback(async (actionId, newStatusKey) => {
    let statusId = null
    const match = /^s-(\d+)$/.exec(newStatusKey)
    if (match) {
      statusId = Number(match[1])
    } else {
      if (!statuses || statuses.length === 0) {
        console.warn('No statuses available to resolve statusId')
      } else {
        const found = statuses.find(
          (s) => (s.nom && s.nom.toLowerCase() === String(newStatusKey).toLowerCase()) || s.color === String(newStatusKey)
        )
        if (found) statusId = found.id
      }
    }
    if (statusId == null) {
      console.warn('Could not determine statusId for', newStatusKey)
      return false
    }
    try {
      setSaving(true)
      await service.updateActionStatus(actionId, statusId)
      return true
    } catch (err) {
      console.error('Network error updating action status (hook)', err)
      return false
    } finally {
      setSaving(false)
    }
  }, [statuses])

  const deleteAction = useCallback(async (id) => {
    if (!id) return false
    try {
      setSaving(true)
      await service.deleteAction(id)
      // refresh list after successful delete
      await fetchActions()
      return true
    } catch (err) {
      console.error('Error deleting action (hook)', err)
      return false
    } finally {
      setSaving(false)
    }
  }, [fetchActions])

  return {
    loading,
    saving,
    actions,
    statuses,
    fetchActions,
    fetchStatuses,
    updateActionStatusOnServer,
    deleteAction,
    setActions,
    setStatuses,
  }
}
