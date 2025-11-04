import API_URL from '../../../api/API_URL'

export async function createSuivi(payload) {
  if (!payload || !payload.idAction) throw new Error('idAction is required')
  const base = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
  const url = `${base}/SuiviAction`
  console.log("creation suivi playload" + payload)
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error(`Failed to create suivi (${res.status})`)
    err.status = res.status
    err.body = text
    throw err
  }
  const json = await res.json().catch(() => null)
  return json
}

export default { createSuivi }
