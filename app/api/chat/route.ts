import { NextRequest, NextResponse } from 'next/server'
import { openai, SYSTEM_PROMPT } from "@/config/openai"
import { chatTools } from '@/config/tools'
import { handleBookAppointment, handleCancelAppointment, handleFamilyAppointment, handleRescheduleAppointment } from '@/lib/handlers/appointment'
import { handleAvailableSlots } from '@/lib/handlers/slots'
import { handleLogEmergency } from '@/lib/handlers/emergency'
import { handleVerifyPatients } from '@/lib/handlers/verifyPatients'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { messages } = body

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-4-0613',
    messages: [
      {
        role: 'system', content: SYSTEM_PROMPT
      },
      ...messages
    ],
    tools: chatTools,
    tool_choice: 'auto'
  })

  const finish = chatCompletion.choices[0]

  if (finish.finish_reason === 'tool_calls') {
    const toolCall = finish.message.tool_calls?.[0]

    if (!toolCall) {
      return NextResponse.json({ reply: 'Sorry, I didn’t understand that.' })
    }

    const args = JSON.parse(toolCall.function.arguments || '{}')

    switch (toolCall.function.name) {
      case 'bookingAppointment':
        return NextResponse.json(await handleBookAppointment(args))
      case 'getAvailableSlots':
        return NextResponse.json(await handleAvailableSlots(args))
      case 'logEmergency':
        return NextResponse.json(await handleLogEmergency(args))
      case 'verifyPatient':
        return NextResponse.json(await handleVerifyPatients(args))
      case 'rescheduleAppointment':
        return NextResponse.json(await handleRescheduleAppointment(args))
      case 'cancelAppointment':
        return NextResponse.json(await handleCancelAppointment(args))
      case 'bookFamilyAppointments':
        return NextResponse.json(await handleFamilyAppointment(args))
    }

  }
  return NextResponse.json({ reply: finish.message.content })
}