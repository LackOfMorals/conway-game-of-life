function rebuildGrid(maxX, maxY, maxSpacing, existingGraph = { nodes: [], links: [] }) {
    console.log("Resizing grid...");
    
    let existingNodesMap = new Map();
    
    // Store existing nodes in a map for quick lookup
    existingGraph.nodes.forEach(node => {
      existingNodesMap.set(node.id, node);
    });
  
    let newNodes = [];
    let newLinks = [];
  
    // Create new grid nodes while preserving existing ones
    for (let i = 0; i < maxX; i++) {
      for (let k = 0; k < maxY; k++) {
        const nodeId = `${i}_${k}`;
  
        if (existingNodesMap.has(nodeId)) {
          newNodes.push(existingNodesMap.get(nodeId));
        } else {
          newNodes.push({
            id: nodeId,
            alive: false,
            x: i * maxSpacing,
            y: k * maxSpacing,
          });
        }
      }
    }
  
    // Rebuild links based on new grid dimensions
    newNodes.forEach(nodeInGrid => {
      const nodeX = nodeInGrid.x / maxSpacing;
      const nodeY = nodeInGrid.y / maxSpacing;
      const nodeSourceID = nodeInGrid.id;
  
      for (let i = -1; i < 2; i++) {
        for (let k = -1; k < 2; k++) {
          const targetX = nodeX + i;
          const targetY = nodeY + k;
          const targetID = `${targetX}_${targetY}`;
  
          if (
            targetX >= 0 &&
            targetX < maxX &&
            targetY >= 0 &&
            targetY < maxY &&
            nodeSourceID !== targetID
          ) {
            newLinks.push({
              source: nodeSourceID,
              target: targetID,
            });
          }
        }
      }
    });
  
    console.log("Updated nodes:", newNodes);
    console.log("Updated links:", newLinks);
  
    return {
      nodes: newNodes,
      links: newLinks,
    };
  }
  
  export function resizeGrid(width, height, spacing, existingGraph) {
    return rebuildGrid(width, height, spacing, existingGraph);
  }
  