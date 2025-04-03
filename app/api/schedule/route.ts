import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'

export async function GET() {
  const db = await readDB()
  return NextResponse.json({ availableSlots: db.availableSlots })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, dob, phone, insurance, appointmentType, preferredDate, preferredTime } = body

  const db = await readDB()
  const requestedSlot = `${preferredDate}T${preferredTime}`
  const slotAvailable = db.availableSlots.includes(requestedSlot)

  if (!slotAvailable) {
    return NextResponse.json({ success: false, message: 'Slot not available' }, { status: 400 })
  }

  let patient = db.patients.find(p => p.name === name && p.dob === dob)
  if (!patient) {
    const newId = db.patients.length + 1
    patient = { id: newId, name, dob, phone, insurance }
    db.patients.push(patient)
  }

  const appointment = {
    id: db.appointments.length + 1,
    patientId: patient.id,
    time: requestedSlot,
    type: appointmentType
  }

  db.appointments.push(appointment)
  db.availableSlots = db.availableSlots.filter(slot => slot !== requestedSlot)

  await writeDB(db)
  return NextResponse.json({ success: true, message: `Appointment booked for ${requestedSlot}` })
}