import { GameSearch } from "./components/GameSearch";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Game Search Engine
          </h1>
        </div>
      </header>
      <main className="py-6">
        <GameSearch />
      </main>
    </div>
  );
}

export default App;
