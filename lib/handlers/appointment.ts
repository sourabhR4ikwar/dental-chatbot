import { readDB, writeDB } from '@/lib/db'
import { formatDate } from '@/utils/date'

export async function handleBookAppointment(args: any) {
  const scheduleRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  })

  const scheduleData = await scheduleRes.json()

  if (scheduleData.success) {
    const { appointmentType, preferredDate, preferredTime } = args

    const { prettyDate, prettyTime } = formatDate(preferredDate, preferredTime)

    const friendlyMsg = `✅ You’re all set! I’ve booked your ${appointmentType.toLowerCase()} for ${prettyDate} at ${prettyTime}. We look forward to seeing you then! 😊`

    return { reply: friendlyMsg }
  } else {
    return { reply: `⚠️ Sorry, we couldn’t book that slot. ${scheduleData.message}` }
  }
}

export async function handleRescheduleAppointment(args: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/appointment`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  })
  const data = await res.json()
  return { reply: data.message }
}

export async function handleCancelAppointment(args: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/appointment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  })
  const data = await res.json()
  return { reply: data.message }
}

export async function handleFamilyAppointment(args: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/schedule/family`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  })
  const data = await res.json()
  return { reply: data.message }
}