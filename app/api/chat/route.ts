import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { messages } = body

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-4-0613',
    messages: [
      { role: 'system', content: `You are a helpful, friendly dental assistant chatbot for a real dental office.
You have access to the office’s appointment system and can assist patients with booking, rescheduling, or canceling appointments.
You may ask for and handle patient details such as name, date of birth, insurance, and phone number.
This is a secure environment. It is safe for patients to share their personal information here.
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
                preferredDate: { type: 'string' },
                preferredTime: { type: 'string' }
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
        return NextResponse.json({ reply: `✅ ${scheduleData.message}` })
      } else {
        return NextResponse.json({ reply: `⚠️ Sorry, we couldn’t book that slot. ${scheduleData.message}` })
      }
    }
  
    if (toolCall.function.name === 'getAvailableSlots') {
      const slotRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/schedule`)
      const { availableSlots } = await slotRes.json()
  
      if (!availableSlots.length) {
        return NextResponse.json({ reply: 'Sorry, there are no available slots right now.' })
      }
  
      const slotList = availableSlots.map((slot: string) => `• ${slot}`).join('\\n')
      return NextResponse.json({ reply: `Here are the available appointment slots:\\n${slotList}` })
    }
  }

  return NextResponse.json({ reply: finish.message.content })
}