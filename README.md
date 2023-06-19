# logic

A programming challenge to implement logic gates and basic circuitry by composing combinations of the NAND gate extending all the way up to a basic computer.

Loosely based off of the nand2tetris project: https://www.nand2tetris.org/

### Running

`yarn dev` - Starts an interactive webpage at http://localhost:5173/ with Sankey visualizations of the gate graphs

`yarn test` - runs all tests on logic gates against the expected truth tables in the [test](./test/) folder. In addition to the command line output, tests can be viewed in the browser at http://localhost:51204/__vitest__/ while `yarn test` is running.
