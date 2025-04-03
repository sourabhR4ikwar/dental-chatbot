import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'

// PUT = Reschedule, POST = Cancel, GET = Fetch upcoming appointments

export async function PUT(req: NextRequest) {
  const { name, dob, appointmentId, newDate, newTime } = await req.json()
  const db = await readDB()

  const patient = db.patients.find(p => p.name === name && p.dob === dob)
  if (!patient) {
    return NextResponse.json({ success: false, message: 'Patient not found.' }, { status: 404 })
  }

  const appointment = db.appointments.find(
    a => a.id === appointmentId && a.patientId === patient.id
  )
  if (!appointment) {
    return NextResponse.json({ success: false, message: 'Appointment not found.' }, { status: 404 })
  }

  const newSlot = `${newDate}T${newTime}`
  const slotAvailable = db.availableSlots.includes(newSlot)
  if (!slotAvailable) {
    return NextResponse.json({ success: false, message: 'Requested slot is not available.' }, { status: 400 })
  }

  db.availableSlots.push(appointment.time) // free old
  appointment.time = newSlot
  db.availableSlots = db.availableSlots.filter(slot => slot !== newSlot)

  await writeDB(db)

  const pretty = new Date(newSlot).toLocaleString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  })

  return NextResponse.json({ success: true, message: `✅ Your appointment has been rescheduled to ${pretty}.` })
}

export async function POST(req: NextRequest) {
  const { name, dob, appointmentId } = await req.json()
  const db = await readDB()

  const patient = db.patients.find(p => p.name === name && p.dob === dob)
  if (!patient) {
    return NextResponse.json({ success: false, message: 'Patient not found.' }, { status: 404 })
  }

  const index = db.appointments.findIndex(
    a => a.id === appointmentId && a.patientId === patient.id
  )
  if (index === -1) {
    return NextResponse.json({ success: false, message: 'Appointment not found.' }, { status: 404 })
  }

  const [cancelled] = db.appointments.splice(index, 1)
  db.availableSlots.push(cancelled.time)
  db.cancelledAppointments.push(cancelled)

  await writeDB(db)

  return NextResponse.json({ success: true, message: `❌ Your appointment has been cancelled.` })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  const dob = searchParams.get('dob')

  if (!name || !dob) {
    return NextResponse.json({ success: false, message: 'Name and DOB are required.' }, { status: 400 })
  }

  const db = await readDB()
  const patient = db.patients.find(p => p.name === name && p.dob === dob)
  if (!patient) {
    return NextResponse.json({ success: false, message: 'Patient not found.' }, { status: 404 })
  }

  const upcoming = db.appointments.filter(a => a.patientId === patient.id)

  return NextResponse.json({ success: true, appointments: upcoming })
}