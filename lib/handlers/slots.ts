export async function handleAvailableSlots(args: any) {
    const slotRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/schedule`)
    const { availableSlots } = await slotRes.json()

    if (!availableSlots.length) {
        return { reply: 'Hmm, it looks like we don’t have any open slots right now. Want me to check for a different day?' }
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

    return { reply: friendly }
}
