import { useState } from "react";
import Sidebar from "../sidebar/sidebar";
import DisplayGrid from "../grid/displayGrid";
import { buildForceGraphGrid }  from "../grid/buildForceGraph";



export default function Main() {
  const [params, setParams] = useState({
    cellsWidth: 5,
    cellsHeight: 5,
    cellSpacing: 50,
  });
  const [running, setRunning] = useState(false); // Flag to control simulation running

  const [conwayGraph, setConwayGraph] = useState(buildForceGraphGrid(params.cellsWidth, params.cellsHeight, params.cellSpacing));  // The graph of the Conway Game of Life used by ForceGraph


  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-500 p-4">Conway Game Of Life</header>
      <div className="flex flex-row flex-grow">
        <aside className="w-64 p-4 bg-gray-200 hidden sm:block">
          <Sidebar
            params={params}
            setParams={setParams}
            setRunning={setRunning}
            running={running}
            conwayGraph={conwayGraph}
            setConwayGraph={setConwayGraph}
          />
        </aside>
        <main className="flex-grow p-4">
          <DisplayGrid params={params} running={running} setRunning={setRunning} conwayGraph={conwayGraph} setConwayGraph={setConwayGraph} />
        </main>
      </div>
    </div>
  );
}
