// Looks after the left hand side bar that allows
// sizing of the grid and start / stopping the simulation

import WriteDBAndStartSim from "./startSim";

export default function Sidebar({
  params,
  setParams,
  setRunning,
  running,
  settakeStep,
  conwayGraph,
  setConwayGraph,
}) {
  const updateParam = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <h2 className="text-lg font-bold">Simulation</h2>
      <p>Grid choices</p>
      <div className="flex-row mt-4">
        <label className="block mt-2">Cells across: {params.cellsWidth}</label>
        <input
          type="range"
          min="10"
          max="100"
          value={params.cellsWidth}
          onChange={(e) => updateParam("cellsWidth", Number(e.target.value))}
          className={
            !running
              ? "w-full"
              : "bg-gray-300 cursor-not-allowed opacity-50 w-full"
          }
          disabled={running}
        />
      </div>
      <div className="flex-row mt-4">
        <label className="block mt-2">Cells up: {params.cellsHeight}</label>
        <input
          type="range"
          min="10"
          max="100"
          value={params.cellsHeight}
          onChange={(e) => updateParam("cellsHeight", Number(e.target.value))}
          className={
            !running
              ? "w-full"
              : "bg-gray-300 cursor-not-allowed opacity-50 w-full"
          }
          disabled={running}
        />
      </div>
      <div className="flex-row mt-4">
        <hr className="h-px my-8 bg-red-400 border-0 dark:bg-red-700" />
      </div>
      <p>Controls</p>
      <div className="flex-row mt-4">
        <WriteDBAndStartSim
          params={params}
          running={running}
          setRunning={setRunning}
          conwayGraph={conwayGraph}
          setConwayGraph={setConwayGraph}
        />
      </div>
      <div className="flex-row mt-4">
        <button
          onClick={() => setRunning(false)}
          className="px-6 py-2 bg-sky-500 hover:bg-sky-700 rounded-full ..."
        >
          Stop
        </button>
      </div>
    </div>
  );
}
