# YoungerU - Personal Anti-Aging System

A comprehensive mobile-first web application for personalized supplement guidance, habit tracking, and wellness optimization.

## Features

- **AI Supplement Planner**: Personalized recommendations based on lifestyle factors
- **Science-Backed Library**: Evidence-based supplement information with A/B/C ratings
- **Habit Tracker**: Build and maintain healthy routines with streak tracking
- **Wellness Forecast**: Visualize potential progress with consistent habits
- **Safety Checker**: Identify potential supplement and medication interactions
- **Community Q&A**: Ask questions and get answers from experts and peers

## Setup

### Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Create a new Supabase project
2. Run the migration file `supabase/migrations/create_tables.sql` in your Supabase SQL editor
3. This will create all necessary tables and enable Row Level Security (RLS)

### RLS Policies

The migration automatically sets up these security policies:

- **User Data**: Users can only access their own profiles, planner sessions, habits, forecasts, and safety checks
- **Library Items**: Public read access for all supplement information
- **Community**: Public read access for questions and answers, authenticated users can post

### Installation

```bash
npm install
npm run dev
```

## Customization

### Safety Checker Rules

Edit the safety checking logic in `src/pages/Safety.tsx`. The current implementation includes basic rules for:

- Pregnancy/nursing warnings
- Omega-3 + blood thinner interactions
- Vitamin D + kidney disease cautions
- General medication interaction alerts

### Library Seed Data

Sample supplement data is included in the migration file. To add more items:

1. Insert new records into the `library_items` table
2. Include proper evidence levels (A/B/C)
3. Add relevant tags for filtering

### AI Planner Logic

The planner uses rule-based recommendations in `src/pages/Planner.tsx`. For production, consider:

- Integrating with a more sophisticated recommendation engine
- Adding more lifestyle factors and conditions
- Implementing machine learning for personalization

## Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Routing**: React Router
- **State Management**: React Context + Hooks
- **UI Components**: Custom components with Lucide icons

## Security

- Row Level Security (RLS) enabled on all user tables
- Authentication required for protected features
- Input validation and sanitization
- Secure API endpoints through Supabase

## Deployment

The app is designed to work with any static hosting provider. For Supabase integration:

1. Deploy your frontend to Vercel, Netlify, or similar
2. Configure environment variables in your hosting platform
3. Ensure your Supabase project allows your domain in the allowed origins

## Contributing

1. Follow the existing code structure and naming conventions
2. Add proper TypeScript types for new features
3. Include error handling and loading states
4. Test accessibility with keyboard navigation
5. Update this README for any new setup requirements