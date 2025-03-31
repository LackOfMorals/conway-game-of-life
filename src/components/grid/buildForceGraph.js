// this supplies the information for forcegraph
// to draw the grid

function buildGrid(maxX, maxY, maxSpacing) {
  var newNodes = [];
  var newLinks = [];

  for (var i = 0; i < maxX; i++) {
    for (var k = 0; k < maxY; k++) {
      newNodes.push({
        id: i.toString() + "_" + k.toString(),
        //alive: !Math.round(Math.random()),
        alive: false,
        x: i * maxSpacing,
        y: k * maxSpacing,
      });
    }
  }

  newNodes.forEach((nodeInGrid) => {
    const nodeX = nodeInGrid.x / maxSpacing;
    const nodeY = nodeInGrid.y / maxSpacing;
    const nodeSourceID = nodeInGrid.id;

    for (var i = -1; i < 2; i++) {
      for (var k = -1; k < 2; k++) {
        const targetX = nodeX + i;
        const targetY = nodeY + k;
        const targetID = targetX.toString() + "_" + targetY.toString();

        if (
          targetX >= 0 &&
          targetX < maxX &&
          targetY >= 0 &&
          targetY < maxY &&
          nodeSourceID != targetID
        ) {
          // The target is within the grid and should be a direct neighbor
          newLinks.push({
            source: nodeSourceID,
            target: targetID,
          });
        }
      }
    }
  });

  const newGraph = {
    nodes: newNodes,
    links: newLinks,
  };

  return newGraph;
}

export function buildForceGraphGrid(width, height, spacing) {
  return buildGrid(width, height, spacing);
}
