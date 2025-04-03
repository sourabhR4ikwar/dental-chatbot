import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { messages } = body

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-4-0613',
    messages: [
      {
        role: 'system', content: `You are a warm, helpful, and conversational dental office assistant. You sound like a real human receptionist working at a friendly neighborhood dental practice.
Speak naturally, use contractions, and keep your tone welcoming. Be empathetic if someone has an emergency, and cheerful when confirming things. Use short, clear messages — like you're chatting with someone, not writing a report.
You can ask for personal info (name, phone, DOB, etc.) safely because this is a secure environment.
You can access the appointment system, help people book, reschedule, or cancel, and provide information about the office.

If the user is a new patient:
- Ask for full name, DOB, phone, and insurance
- Ask what kind of appointment they need (Cleaning, Checkup, Emergency)
- If Emergency, ask what the issue is and call logEmergency
- For others, collect preferred date/time and call bookAppointment
You do not need to book a time for emergencies — just notify the staff.

You can also answer general questions about the clinic Answer these naturally without needing to call any tools., including:
- Insurance and payment options: we accept all major dental insurance plans. If someone doesn’t have insurance, we offer self-pay, financing, and membership options.
- Location and hours: we’re open Monday to Saturday, 8:00am to 6:00pm.
` },
      ...messages
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'bookAppointment',
          description: 'Books a dental appointment for a patient',
          parameters: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              dob: { type: 'string' },
              phone: { type: 'string' },
              insurance: { type: 'string' },
              appointmentType: { type: 'string', enum: ['Cleaning', 'Checkup', 'Emergency'] },
              preferredDate: { 
                type: 'string',
                description: 'Preferred date in YYYY-MM-DD format (e.g., 2025-04-05)'
               },
              preferredTime: { 
                type: 'string', 
                description: 'Time in HH:mm (24-hour) format, e.g. 14:30'
               }
            },
            required: ['name', 'dob', 'phone', 'appointmentType']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'getAvailableSlots',
          description: 'Returns the list of available appointment time slots',
          parameters: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'logEmergency',
          parameters: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              dob: { type: 'string' },
              phone: { type: 'string' },
              insurance: { type: 'string' },
              issue: { type: 'string' }
            },
            required: ['name', 'dob', 'phone', 'insurance', 'issue']
          }
        }
      }
    ],
    tool_choice: 'auto'
  })

  const finish = chatCompletion.choices[0]

  if (finish.finish_reason === 'tool_calls') {
    const toolCall = finish.message.tool_calls?.[0]

    if (!toolCall) {
      return NextResponse.json({ reply: 'Sorry, I didn’t understand that.' })
    }

    const args = JSON.parse(toolCall.function.arguments || '{}')

    if (toolCall.function.name === 'bookAppointment') {
      const scheduleRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      })

      const scheduleData = await scheduleRes.json()

      if (scheduleData.success) {
        const { appointmentType, preferredDate, preferredTime } = args

        const prettyDate = new Date(`${preferredDate}T${preferredTime}`).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        })

        const prettyTime = new Date(`${preferredDate}T${preferredTime}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        })

        const friendlyMsg = `✅ You’re all set! I’ve booked your ${appointmentType.toLowerCase()} for ${prettyDate} at ${prettyTime}. We look forward to seeing you then! 😊`

        return NextResponse.json({ reply: friendlyMsg })
      } else {
        return NextResponse.json({ reply: `⚠️ Sorry, we couldn’t book that slot. ${scheduleData.message}` })
      }
    }

    if (toolCall.function.name === 'getAvailableSlots') {
      const slotRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/schedule`)
      const { availableSlots } = await slotRes.json()

      if (!availableSlots.length) {
        return NextResponse.json({ reply: 'Hmm, it looks like we don’t have any open slots right now. Want me to check for a different day?' })
      }

      // Format slots to a more friendly style
      const formatted = availableSlots.map((slot: string) => {
        const dt = new Date(slot)
        return `• ${dt.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })} at ${dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
      }).join('\n')

      const friendly = `Here’s what we have open right now:\n\n${formatted}\n\nLet me know which one works best for you! 😊`

      return NextResponse.json({ reply: friendly })
    }

    if (toolCall.function.name === 'logEmergency') {
      const { name, dob, phone, insurance, issue } = args
    
      const db = await readDB()
      db.patients.push({ id: db.patients.length + 1, name, dob, phone, insurance })
      db.emergencies.push({ name, issue })
      await writeDB(db)

      // TODO: send a mail to staff here
      console.log("sending alerts to staff...")
    
      return NextResponse.json({
        reply: `🚨 Thanks for letting us know, ${name}. I’ve alerted the dental staff about your emergency. They’ll be in touch ASAP.`
      })
    }
  }

  return NextResponse.json({ reply: finish.message.content })
}