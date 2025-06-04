# Game Search Engine

A full-stack application that allows users to search for games using the RAWG Video Games Database API. The application provides detailed information about games, including store availability, ratings, and platform information.

## Project Structure

This is a monorepo containing both the frontend and backend code:

- `/client` - React frontend built with Vite, TypeScript, and Tailwind CSS
- `/server` - Express backend with TypeScript

## Features

- Game search with instant results
- Display game information including:
  - Release date
  - Ratings (RAWG and Metacritic)
  - Store availability (Steam, GOG, Epic Games)
  - Platform-specific ratings
  - Average playtime
  - Official website links
  - Genres and platforms

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- RAWG API Key (get one at [https://rawg.io/apidocs](https://rawg.io/apidocs))

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd game-search-engine
```

2. Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Create a `.env` file in the server directory with your RAWG API key:

```
RAWG_API_KEY=your_api_key_here
```

4. Start the development servers:

In the server directory:

```bash
npm run dev
```

In the client directory:

```bash
npm run dev
```

The client will be available at `http://localhost:5173` and the server at `http://localhost:3001`.
