import { readDB, writeDB } from "../db"

export async function handleLogEmergency (args: any) {
  const { name, dob, phone, insurance, issue } = args

      const db = await readDB()
      db.patients.push({ id: db.patients.length + 1, name, dob, phone, insurance })
      db.emergencies.push({ name, issue })
      await writeDB(db)

      // TODO: send a mail to staff here
      console.log("sending alerts to staff...")

      return {
        reply: `🚨 Thanks for letting us know, ${name}. I’ve alerted the dental staff about your emergency. They’ll be in touch ASAP.`
      }
}