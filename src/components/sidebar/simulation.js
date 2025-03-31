export default function simulation(
  cellsAliveNeighbours,
  existingGraph,
  existingGraphLinks
) {
  // take the list of cells with alive neighboroughs
  // calculate the next iteration of the grid and
  // return it

  var existingNodesMap = new Map();

  // Store existing nodes in a map for quick lookup
  existingGraph.cells.forEach((node) => {
    existingNodesMap.set(node.id, {
      alive: node.alive,
      id: node.id,
      x: Number(node.x),
      y: Number(node.y),
    }); // Store a clone, not a reference
  });

  var request_where_alive = { id: { in: [] } };
  var request_where_dead = { id: { in: [] } };

  // Iterate over cellsAliveNeighours.
  // Determine if the cell will be alive or dead
  // The rules
  /* 
        Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        Any live cell with two or three live neighbours lives on to the next generation.
        Any live cell with more than three live neighbours dies, as if by overpopulation.
        Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    */
  cellsAliveNeighbours.cells.forEach((cell) => {
    var cellAliveNeighbourCount = cell.connectedCells.length;
    var existingCell = existingNodesMap.get(cell.id);
    if (existingCell.alive) {
      switch (cellAliveNeighbourCount) {
        case 0:
          existingCell.alive = false;
          request_where_dead.id.in.push(existingCell.id);
          break;
        case 1:
          existingCell.alive = false;
          request_where_dead.id.in.push(existingCell.id);
          break;
        case 2:
          existingCell.alive = true;
          request_where_alive.id.in.push(existingCell.id);
          break;
        case 3:
          existingCell.alive = true;
          request_where_alive.id.in.push(existingCell.id);
          break;
        default:
          existingCell.alive = false;
          request_where_dead.id.in.push(existingCell.id);
      }
    } else if (!existingCell.alive) {
      // cell is currently dead.  Can it become alive?
      switch (cellAliveNeighbourCount) {
        case 3:
          existingCell.alive = true;
          request_where_alive.id.in.push(existingCell.id);
          break;
      }
    }
  });

  var newNodes = Array.from(existingNodesMap.values());

  return {
    nextGraph: { nodes: newNodes, links: existingGraphLinks },
    deadCells: JSON.stringify(request_where_dead),
    aliveCells: JSON.stringify(request_where_alive),
  };
}
