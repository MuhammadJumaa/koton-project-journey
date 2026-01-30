import { WorldProvider } from './context/WorldContext';
import { GameContainer } from './components/game/GameContainer';
import './styles/global.css';

function App() {
  return (
    <WorldProvider>
      <GameContainer />
    </WorldProvider>
  );
}

export default App;
