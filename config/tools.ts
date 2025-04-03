import { ChatCompletionTool } from 'openai/resources/chat'

export const chatTools: ChatCompletionTool[] = [
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
  },
  {
    type: 'function',
    function: {
      name: 'verifyPatient',
      description: 'Verifies a patient by name and DOB and returns any upcoming appointments',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          dob: { type: 'string' }
        },
        required: ['name', 'dob']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'rescheduleAppointment',
      description: 'Reschedules an existing appointment for a patient',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          dob: { type: 'string' },
          appointmentId: { type: 'number' },
          newDate: { type: 'string' },
          newTime: { type: 'string' }
        },
        required: ['name', 'dob', 'appointmentId', 'newDate', 'newTime']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'cancelAppointment',
      description: 'Cancels an existing appointment for a patient',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          dob: { type: 'string' },
          appointmentId: { type: 'number' }
        },
        required: ['name', 'dob', 'appointmentId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'bookFamilyAppointments',
      description: 'Books back-to-back appointments for multiple family members',
      parameters: {
        type: 'object',
        properties: {
          family: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                dob: { type: 'string' },
                appointmentType: { type: 'string', enum: ['Cleaning', 'Checkup'] }
              },
              required: ['name', 'dob', 'appointmentType']
            }
          },
          preferredDate: { type: 'string' },
          startingTime: { type: 'string' }
        },
        required: ['family', 'preferredDate', 'startingTime']
      }
    }
  }
]