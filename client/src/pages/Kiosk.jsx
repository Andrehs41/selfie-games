import { useState } from 'react';
import KioskShell from '../components/kiosk/KioskShell.jsx';
import StartForm from '../components/kiosk/StartForm.jsx';
import GameSelect from '../components/kiosk/GameSelect.jsx';
import TriviaGame from '../components/kiosk/TriviaGame.jsx';
import RuletaGame from '../components/kiosk/RuletaGame.jsx';
import Finish from '../components/kiosk/Finish.jsx';

// Flujo del kiosko (tótem del stand):
// form (nombre+tel) → elegir juego → jugar ambos → final → reset al siguiente.
export default function Kiosk() {
  const [step, setStep] = useState('form');
  const [participant, setParticipant] = useState(null);
  const [done, setDone] = useState({ trivia: false, ruleta: false });
  const [results, setResults] = useState({ trivia: null, ruleta: null });

  const reset = () => {
    setParticipant(null);
    setDone({ trivia: false, ruleta: false });
    setResults({ trivia: null, ruleta: null });
    setStep('form');
  };

  const onStarted = (p) => {
    setParticipant(p);
    setStep('select');
  };

  const onGameDone = (game, result) => {
    const nextDone = { ...done, [game]: true };
    setDone(nextDone);
    setResults((r) => ({ ...r, [game]: result }));
    setStep(nextDone.trivia && nextDone.ruleta ? 'finish' : 'select');
  };

  const wide = step === 'select';

  return (
    <KioskShell maxWidth={wide ? 'md' : 'sm'}>
      {step === 'form' && <StartForm onStarted={onStarted} />}
      {step === 'select' && <GameSelect participant={participant} done={done} onPick={setStep} />}
      {step === 'trivia' && <TriviaGame participant={participant} onDone={(r) => onGameDone('trivia', r)} />}
      {step === 'ruleta' && <RuletaGame participant={participant} onDone={(r) => onGameDone('ruleta', r)} />}
      {step === 'finish' && <Finish participant={participant} results={results} onReset={reset} />}
    </KioskShell>
  );
}
