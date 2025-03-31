import { useEffect, useRef } from "react";
import UseGraphQLAPI from "../../utils/api/graphQLfetchClient.jsx";
import simulation from "./simulation";

function forceGraphFormatToNeo4j(params, conwayGraphData) {
  var newCellsForNeo4j = [];

  conwayGraphData.nodes.forEach((nodeInGrid) => {
    newCellsForNeo4j.push({
      id: nodeInGrid.id,
      alive: nodeInGrid.alive,
      x: nodeInGrid.x.toString(),
      y: nodeInGrid.y.toString(),
    });
  });

  newCellsForNeo4j = JSON.stringify(newCellsForNeo4j);

  return newCellsForNeo4j;
}

export default function WriteDBAndStartSim({
  params,
  running,
  setRunning,
  conwayGraph,
  setConwayGraph,
}) {
  const runningRef = useRef(running);

  const conwayGraphRef = useRef(conwayGraph);

  const deleteGrid =
    "mutation deleteEntireGrid { deleteCells { relationshipsDeleted nodesDeleted }}";

  const createGrid =
    "mutation createCells($input: [CellCreateInput!]!) { createCells(input: $input) { cells { id alive } }}";

  const joinCells = "mutation MyMutation { joinCellsTogetherIntoGrid }";

  const getCellWithAliveConnectedCells =
    "query aliveCellsWithAliveNeighours { cells { id alive x y connectedCells(where: { alive: { eq: true } }) { id } } }";

  const setCellToAlive =
    "mutation changeCellToAlive($where: CellWhere) { updateCells(where: $where, update: {alive: {set: true}} ) { cells { id alive } } }";

  const setCellToDead =
    "mutation changeCellToDead($where: CellWhere) { updateCells(where: $where, update: {alive: {set: false}} ) { cells { id alive } } }";

  const readCellsOnGrid = "query getEntireGrid { cells { alive id x y } }";

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    conwayGraphRef.current = conwayGraph;
  }, [conwayGraph]);

  const startSim = async () => {
    setRunning(true);
    await new Promise((resolve) => setTimeout(resolve, 50)); // after setting running , we're taking a short pause to let react catch up

    const dataToWriteToNeo4j = forceGraphFormatToNeo4j(params, conwayGraph); // take the existing grid from the ui and turn it into something neo4j can understand

    try {
      await UseGraphQLAPI(deleteGrid); // delete any existing grid from the db
      const createGridVariables = { input: JSON.parse(dataToWriteToNeo4j) };

      await UseGraphQLAPI(createGrid, createGridVariables); // write existing grid cells to DB
      await UseGraphQLAPI(joinCells); // join them together into a grid

      while (runningRef.current) {
        // While runnig is true
        try {
          var cellsWithStatus = [];

          cellsWithStatus = await UseGraphQLAPI(readCellsOnGrid); // Read the DB to get a list of cells and their status

          var cellsAliveNeightbours = await UseGraphQLAPI(
            getCellWithAliveConnectedCells
          ); // Get cells with alive neighbours

          // Use the simulation function to calculate the next iteration using our graphql query results
          // We take copies of these to avoid altering them
          var nextGraphIteration = simulation(
            structuredClone(cellsAliveNeightbours),
            structuredClone(cellsWithStatus),
            structuredClone(conwayGraph.links)
          );

          // Write changes to the DB for alive cells
          var cellAliveVariables = {
            where: JSON.parse(nextGraphIteration.aliveCells),
          };
          await UseGraphQLAPI(setCellToAlive, cellAliveVariables);
          await new Promise((resolve) => setTimeout(resolve, 250)); // Small delay to prevent freezing

          // Write changes to the DB for dead cells
          var cellDeadVariables = {
            where: JSON.parse(nextGraphIteration.deadCells),
          };
          await UseGraphQLAPI(setCellToDead, cellDeadVariables);
          await new Promise((resolve) => setTimeout(resolve, 250)); // Small delay to prevent freezing// Wait for short bit

          // By setting conwayGraph to our next iteration, this causes React to re-render the display component
          // so we can see the grid change
          setConwayGraph(nextGraphIteration.nextGraph);

          await new Promise((resolve) => setTimeout(resolve, 250)); // Small delay to prevent freezing
        } catch (error) {
          console.error("Error processing simulation iterations ", error);
        }
      }
    } catch (error) {
      console.error("Error processing grid update ", error);
    }
  };

  return (
    <div>
      <button
        className={
          !running
            ? "px-4 py-2 bg-sky-500 hover:bg-sky-700 rounded-full"
            : "bg-gray-300 px-4 py-2 rounded-full cursor-not-allowed opacity-50"
        }
        onClick={() => startSim()}
      >
        Start
      </button>
    </div>
  );
}
