"use strict";

module.exports = {
  isPositionValid,
  nextPosition,
  moveRover,
  runRover,
};

const _ = require("lodash");

function runRover(commandsString, position, map) {
  // discard unknown commands
  const commands = _.chain(commandsString)
	.split("")
	.filter(isKnownCommand)
	.value();
  // execute commands lists with a cool little reduction :)
  // could probably think of something cleaner with more time
  const result = _.reduce(commands, ({current: [ok, position], positions}, command) => {
    const next = moveRover(command, position, map);
    return {
      current: next,
      positions: [...positions, next],
    };
  }, {
    current: [true, position],
    positions: [],
  });
  return result.positions;
}

function isKnownCommand(command) {
  return Boolean(COMMANDS[command]);
}

function moveRover(command, position, map) {
  // execute one command on rover
  // returns command success and current position

  const next = nextPosition(command, position);
  const nextIsValid = isPositionValid(next, map);
  return nextIsValid ?
    [true, next] :
    [false, position];
}

function isPositionValid({x, y}, {width, height}) {
  // Simple rectangle boundaries check
  return (
    x >=0 && x <= width &&
      y >=0 && y <= height
  );
}

// calculate next position without a care in the world
function nextPosition(command, position) {
  return COMMANDS[command](position);
}

const DIRECTIONS = ["N", "E", "S", "W"];

// rotate moves just rotate index in DIRECTIONS list, with wrap around.
const COMMANDS = {
  L({x, y, direction}) {
    const currentDirectionIndex = _.indexOf(DIRECTIONS, direction);
    return {
      x, y,
      direction: _.nth(DIRECTIONS, (currentDirectionIndex - 1) % DIRECTIONS.length),
    };
  },
  R({x, y, direction}) {
    const currentDirectionIndex = _.indexOf(DIRECTIONS, direction);
    return {
      x, y,
      direction: _.nth(DIRECTIONS, (currentDirectionIndex + 1) % DIRECTIONS.length),
    };
  },
  A(position) {
    const {direction} = position;
    return ADVANCES[direction](position);
  },
};

// Advance moves... would be much simpler with some vector support lib/functions.
// but I keep it simple and dirty for this POC.
const ADVANCES = {
  N({x, y, direction}) {
    return {
      x, y: y + 1, direction,
    };
  },
  E({x, y, direction}) {
    return {
      x: x + 1, y, direction,
    };
  },
  S({x, y, direction}) {
    return {
      x, y: y - 1, direction,
    };
  },
  W({x, y, direction}) {
    return {
      x: x - 1, y, direction,
    };
  },
};
