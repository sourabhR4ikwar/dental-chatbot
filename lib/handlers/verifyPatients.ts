import { readDB } from "../db"

export async function handleVerifyPatients(args: any) {
        const { name, dob } = args
      const db = await readDB()
      const patient = db.patients.find((p: any) => p.name === name && p.dob === dob)
      console.log({name, dob})
      console.log(db.patients)
    
      if (!patient) {
        return {
          reply: `Hmm, I wasn’t able to find anyone with that name and date of birth. Could you double-check and try again? 😊`
        }
      }
    
      const appointments = db.appointments
        .filter((a: any) => a.patientId === patient.id)
        .map((a: any) => {
          const time = new Date(a.time).toLocaleString('en-US', {
            weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
          })
          return `• AppointmentID: ${a.id} ${time} — ${a.type}`
        })
    
      const reply = appointments.length
        ? `You're all set, ${patient.name.split(' ')[0]}! 🎉 I’ve found the following upcoming appointment${appointments.length > 1 ? 's' : ''}:\n\n${appointments.join('\n')}\n\nWould you like to reschedule or cancel any of them?`
        : `Thanks, ${patient.name.split(' ')[0]}! I’ve verified your info, but I didn’t find any upcoming appointments. Would you like to book one? 😊`
    
      return { reply }

}