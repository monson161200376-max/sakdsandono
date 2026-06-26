import { NovelStage } from "./components/NovelStage";
import { StartScreen } from "./components/StartScreen";
import { useGame } from "./hooks/useGame";

export default function App() {
  const game = useGame();
  console.log(game.profile);
  if (!game.profile) {
    return <StartScreen onStart={game.startGame} />;
  }

  return (
    <NovelStage
      current={game.current}
      history={game.history}
      completed={game.completed}

      selectedInNode={
        game.selectedInNode?.[game.current.id] ?? []  
      }
      
      playTime={game.playTime}
      analysis={game.analysis}
      profile={game.profile}
      choices={game.choices}
      onNext={game.goNext}
      onChoose={game.choose}
      onRestart={game.restart}
      onSubmitText={game.submitText}
      nickname={game.profile.nickname}
    />
  );
}
