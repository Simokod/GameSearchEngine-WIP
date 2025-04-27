import GameSearch from "./components/GameSearch";

function App() {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="w-full px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 py-8">
          AI Game Search Engine
        </h1>
        <GameSearch />
      </div>
    </div>
  );
}

export default App;
