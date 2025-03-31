import { useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { resizeGrid } from "./resizeGrid.js";

export default function DisplayGrid({
  params,
  running,
  setRunning,
  conwayGraph,
  setConwayGraph,
}) {
  const fgRef = useRef();

  // If the slides are used to re-size the grid, this will detect it
  // and re-draw our newly sized grid
  useEffect(() => {
    if (running) return; // don't do this if sim is running
    const newSizeGraph = resizeGrid(
      params.cellsWidth,
      params.cellsHeight,
      params.cellSpacing,
      conwayGraph
    );
    setConwayGraph(newSizeGraph);
  }, [params.cellsHeight, params.cellsWidth, params.cellSpacing]);

  // Custom node rendering function
  // gives black / green round cells
  const drawNode = (node, ctx, globalScale) => {
    const radius = 8 / globalScale;

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 4 * Math.PI, false);

    if (node.alive) {
      ctx.fillStyle = "green"; // Alive nodes are solid green
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.strokeStyle = "green"; // Black outline
      ctx.stroke();
    } else {
      ctx.fillStyle = "black"; // Dead nodes are black
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black"; // Black outline
      ctx.stroke();
    }
  };

  const ToggleCellState = ({ node }) => {
    if (running) return; // Don't allow toggling when simulation is running

    setConwayGraph((prevGraph) => {
      // Create a new nodes array with the updated node state
      const updatedNodes = prevGraph.nodes.map((n) =>
        n.id === node.id ? { ...n, alive: !n.alive } : n
      );

      return { ...prevGraph, nodes: updatedNodes, links: prevGraph.links }; // Return new graph object
    });
  };

  return (
    <div>
      <p>Simulation: {running ? "Running" : "Stopped"}</p>
      <ForceGraph2D
        graphData={conwayGraph}
        ref={fgRef}
        linkColor={() => "#00c7e3"}
        linkWidth={4}
        nodeRelSize={8}
        enableNodeDrag={false}
        d3VelocityDecay={0}
        cooldownTicks={0} // Using zero stops the grid jumping around
        nodeAutoColorBy={null}
        panInteraction={false}
        d3AlphaMin={1}
        zoom={false}
        onEngineStop={() => fgRef.current?.zoomToFit(400)}
        onNodeClick={(node) => {
          ToggleCellState({ node });
        }}
        nodeCanvasObject={drawNode} // Node rendering function to override default
      />
    </div>
  );
}
