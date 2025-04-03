# Dental Chatbot Assistant

A Next.js-based dental appointment booking chatbot that uses OpenAI's GPT-4 to handle patient interactions and appointment scheduling.

## Features

- 🤖 AI-powered dental assistant
- 📅 Appointment booking and management
- 👨‍👩‍👧‍👦 Family appointment scheduling
- 🚨 Emergency case handling
- 📱 Modern, responsive UI
- 🔒 Secure patient data handling

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **AI**: OpenAI GPT-4
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database**: JSON-based file system (for demo purposes)

## Project Structure

```
dental-chatbot/
├── app/
│   ├── api/
│   │   ├── chat/              # Chat API endpoints
│   │   │   ├── Message.tsx   # Message component
│   │   │   ├── Header.tsx    # Chat header
│   │   │   └── Input.tsx     # Message input
│   │   └── ui/              # Reusable UI components
│   ├── config/
│   │   ├── openai.ts        # OpenAI configuration
│   │   └── tools.ts         # AI tool definitions
│   ├── lib/
│   │   ├── handlers/        # API request handlers
│   │   │   ├── appointment.ts
│   │   │   ├── emergency.ts
│   │   │   ├── slots.ts
│   │   │   └── verifyPatients.ts
│   │   └── utils/          # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── page.tsx           # Main application page
├── public/               # Static assets
└── package.json         # Project dependencies
```

## API Endpoints

### Chat API (`/api/chat`)
- **POST**: Handles chat interactions with the AI assistant
- Supports multiple tools for appointment management

### Schedule API (`/api/schedule`)
- **GET**: Retrieves available appointment slots
- **POST**: Books new appointments
- **POST /family**: Handles family appointment bookings

### Appointment API (`/api/appointment`)
- **PUT**: Reschedules existing appointments
- **POST**: Cancels appointments

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/dental-chatbot.git
cd dental-chatbot
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `NEXT_PUBLIC_BASE_URL`: Base URL for API calls (defaults to http://localhost:3000)

## Features in Detail

### AI Assistant
- Natural language processing for patient interactions
- Context-aware responses
- Multi-turn conversation handling

### Appointment Management
- Book new appointments
- Reschedule existing appointments
- Cancel appointments
- View available slots
- Family appointment scheduling

### Emergency Handling
- Priority case identification
- Staff notification system
- Patient information collection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for the GPT-4 API
- Next.js team for the amazing framework
- Shadcn/ui for the beautiful components
