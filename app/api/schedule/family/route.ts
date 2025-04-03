import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { family, preferredDate, startingTime } = await req.json()
  const db = await readDB()

  const startingSlot = `${preferredDate}T${startingTime}`
  const totalAppointments = family.length
  const startIndex = db.availableSlots.indexOf(startingSlot)

  if (startIndex === -1 || startIndex + totalAppointments > db.availableSlots.length) {
    return NextResponse.json({
      success: false,
      message: 'Sorry, we couldn’t find enough back-to-back slots for your family at that time. Want to try a different starting time?'
    }, { status: 400 })
  }

  const slotsToBook = db.availableSlots.slice(startIndex, startIndex + totalAppointments)
  const summary: string[] = []

  for (let i = 0; i < family.length; i++) {
    const member = family[i]
    const time = slotsToBook[i]

    let patient = db.patients.find((p:any) => p.name === member.name && p.dob === member.dob)
    if (!patient) {
      const newId = db.patients.length + 1
      patient = { id: newId, name: member.name, dob: member.dob, phone: '', insurance: '' }
      db.patients.push(patient)
    }

    db.appointments.push({
      id: db.appointments.length + 1,
      patientId: patient.id,
      time,
      type: member.appointmentType
    })

    db.availableSlots = db.availableSlots.filter((slot: any) => slot !== time)

    const pretty = new Date(time).toLocaleString('en-US', {
      weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    })

    summary.push(`• ${member.name} – ${pretty} (${member.appointmentType})`)
  }

  await writeDB(db)

  return NextResponse.json({
    success: true,
    message: `✅ You’re all set! I’ve booked back-to-back appointments for your family:

${summary.join('\n')}

We look forward to seeing you all! 😊`
  })
}