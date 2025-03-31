export function formatData(dbData) {
  console.log("formatData: data got ", dbData);

  if (!dbData?.cells) {
    console.log("formatData: no data");
    return { nodes: [], links: [] }; // Ensure it always returns an object
  }

  const nodes = [];
  const links = new Set(); // Use Set to prevent duplicate links

  const GRID_SPACING = 100; // Distance between nodes in grid

  dbData.cells.forEach((a) => {
    nodes.push({
      id: a.id,
      __typename: a.__typename,
      alive: a.alive,
      x: Number(a.x) * GRID_SPACING,
      y: Number(a.y) * GRID_SPACING,
    });

    a.connectedCells.forEach((t) => {
      links.add(JSON.stringify({ source: a.id, target: t.id })); // Prevent duplicates
    });
  });

  return {
    nodes,
    links: [...links].map((l) => JSON.parse(l)), // Convert back from Set
  };
}
