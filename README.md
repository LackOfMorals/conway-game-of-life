# Conway Game of Life using Neo4j GraphQL libray

## Requirements

- neo4j
- neo4j graphql library v7.x.x
- a graphql server to use with neo4j graphql library OR
- graphql for new4j aura db with an aura instance
- node.js
- git

## GraphQL for AuraDB
Follow the instructions for [GraphQL for Aura](https://neo4j.com/docs/graphql/current/aura-graphql/) and use the contents from [typeDefs.graphql](https://github.com/LackOfMorals/conway-game-of-life/blob/main/typeDefs.graphql) for the Type Definitions. 

## Installation

Clone repo

```Text
git clone https://github.com/LackOfMorals/conway-game-of-life.git
```

Install

```Text
cd conway-spike
npm install
```

Set connection to Neo4j / AuraDB by creating a .env file at the folder root. Replace values for VITE_GRAPHQL_URL with the URL to the graphql API and VITE_GRAPHQL_URL_API_KEY to be your API key if you're using GraphQL for Aura DB; if not, this can be left blank.

```Text
VITE_GRAPHQL_URL=
VITE_GRAPHQL_URL_API_KEY=

```

Run Conway Game of Life

```Text
npm run dev
```

## Usage

An intial grid will be shown. This can be re-sized using the slider controls. When you have the desired grid size, click on black cells to turn them green. This indicates that they are alive. Once you have the grid as you want it, select 'Start' to initiate Conway Game of Life. Cells will be changed between alive and dead by the application of these rules

- Any live cell with fewer than two live neighbours dies, as if by underpopulation.
- Any live cell with two or three live neighbours lives on to the next generation.
- Any live cell with more than three live neighbours dies, as if by overpopulation.
- Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

To stop the simulation, select 'Stop'
