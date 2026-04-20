import { PartitionView } from "./components/PartitionView";
import { partitionStore } from "./store/partitionStore";

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <PartitionView id={partitionStore.rootId} />
    </div>
  );
}

export default App;
