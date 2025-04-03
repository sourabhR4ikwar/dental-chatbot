export function formatDate(date: string, time: string) {
    const dt = new Date(`${date}T${time}`)
    return {
      prettyDate: dt.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }),
      prettyTime: dt.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })
    }
  }
  
  export function formatSlot(slot: string) {
    const dt = new Date(slot)
    return `• ${dt.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })} at ${dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
  }