"use strict";

const _ = require("lodash");
const {expect} = require("chai");

const {
  isPositionValid,
  nextPosition,
  moveRover,
  runRover,
} = require("../src/rover.js");

describe("rover", function () {
  describe("isPositionValid", function() {
    _.each([
      {
	desc: "initial position, bottom left",
	map: {width: 5, height: 5 },
	position: { x: 0, y: 0 },
	isValid: true,
      },
      {
	desc: "bottom right",
	map: {width: 5, height: 5 },
	position: { x: 5, y: 0 },
	isValid: true,
      },
      {
	desc: "top right",
	map: {width: 5, height: 5 },
	position: { x: 5, y: 5 },
	isValid: true,
      },
      {
	desc: "top left",
	map: {width: 5, height: 5 },
	position: { x: 0, y: 5 },
	isValid: true,
      },
      {
	desc: "somewhere in the middle",
	map: {width: 5, height: 5 },
	position: { x: 2, y: 3 },
	isValid: true,
      },
      {
	desc: "outside bottom",
	map: {width: 5, height: 5 },
	position: { x: 2, y: -1 },
	isValid: false,
      },
      {
	desc: "outside right",
	map: {width: 5, height: 5 },
	position: { x: 6, y: 1 },
	isValid: false,
      },
      {
	desc: "outside top",
	map: {width: 5, height: 5 },
	position: { x: 3, y: 6 },
	isValid: false,
      },
      {
	desc: "outside left",
	map: {width: 5, height: 5 },
	position: { x: -1, y: 3 },
	isValid: false,
      },
      {
	desc: "outside top right",
	map: {width: 5, height: 5 },
	position: { x: 6, y: 6 },
	isValid: false,
      },
      {
	desc: "invalid map width",
	map: {width: -5, height: 5 },
	position: { x: 0, y: 0 },
	isValid: false,
      },
      {
	desc: "invalid map height",
	map: {width: 5, height: -5 },
	position: { x: 0, y: 0 },
	isValid: false,
      },
    ], ({desc, map, position, isValid}) => {
      it(`should check if <position> is valid on <map>, ${desc}`, function () {
	expect(isPositionValid(position, map)).to.equal(isValid);
      });
    });
  });

  describe("nextPosition", function() {
    _.each([
      {
	desc: "rotate left N->W",
	command: "L",
	position: {x:0, y: 0, direction: "N"},
	result: {x:0, y: 0, direction: "W"},
      },
      {
	desc: "rotate left W->S",
	command: "L",
	position: {x:0, y: 0, direction: "W"},
	result: {x:0, y: 0, direction: "S"},
      },
      {
	desc: "rotate left S->E",
	command: "L",
	position: {x:0, y: 0, direction: "S"},
	result: {x:0, y: 0, direction: "E"},
      },
      {
	desc: "rotate left E->N",
	command: "L",
	position: {x:0, y: 0, direction: "E"},
	result: {x:0, y: 0, direction: "N"},
      },
      {
	desc: "rotate right N->E",
	command: "R",
	position: {x:0, y: 0, direction: "N"},
	result: {x:0, y: 0, direction: "E"},
      },
      {
	desc: "rotate right E->S",
	command: "R",
	position: {x:0, y: 0, direction: "E"},
	result: {x:0, y: 0, direction: "S"},
      },
      {
	desc: "rotate right S->W",
	command: "R",
	position: {x:0, y: 0, direction: "S"},
	result: {x:0, y: 0, direction: "W"},
      },
      {
	desc: "rotate right W->N",
	command: "R",
	position: {x:0, y: 0, direction: "W"},
	result: {x:0, y: 0, direction: "N"},
      },
      {
	desc: "advance N",
	command: "A",
	position: {x:0, y: 0, direction: "N"},
	result: {x:0, y: 1, direction: "N"},
      },
      {
	desc: "advance E",
	command: "A",
	position: {x:0, y: 0, direction: "E"},
	result: {x:1, y: 0, direction: "E"},
      },
      {
	desc: "advance S",
	command: "A",
	position: {x:0, y: 0, direction: "S"},
	result: {x:0, y: -1, direction: "S"},
      },
      {
	desc: "advance W",
	command: "A",
	position: {x:0, y: 0, direction: "W"},
	result: {x:-1, y: 0, direction: "W"},
      },
    ], ({desc, command, position, result}) => {
      it(`should move <position> according to <command>, ${desc}`, function () {
	expect(nextPosition(command, position)).to.deep.equal(result);
      });
    });
  });

  describe("moveRover", function() {
    _.each([
      {
	desc: "initial position, advance",
	map: {width: 5, height: 5 },
	position: { x: 0, y: 0, direction: "N"},
	command: "A",
	result: [true, { x: 0, y: 1, direction: "N"}],
      },
      {
	desc: "initial position, rotate left",
	map: {width: 5, height: 5 },
	position: { x: 0, y: 0, direction: "N"},
	command: "L",
	result: [true, { x: 0, y: 0, direction: "W"}],
      },
      {
	desc: "initial position, rotate right",
	map: {width: 5, height: 5 },
	position: { x: 0, y: 0, direction: "N"},
	command: "R",
	result: [true, { x: 0, y: 0, direction: "E"}],
      },
      {
	desc: "move to bottom edge",
	map: {width: 5, height: 5 },
	position: { x: 3, y: 1, direction: "S"},
	command: "A",
	result: [true, { x: 3, y: 0, direction: "S"}],
      },
      {
	desc: "stop at bottom edge",
	map: {width: 5, height: 5 },
	position: { x: 3, y: 0, direction: "S"},
	command: "A",
	result: [false, { x: 3, y: 0, direction: "S"}],
      },
      {
	desc: "move to right edge",
	map: {width: 5, height: 5 },
	position: { x: 4, y: 2, direction: "E"},
	command: "A",
	result: [true, { x: 5, y: 2, direction: "E"}],
      },
      {
	desc: "stop at right edge",
	map: {width: 5, height: 5 },
	position: { x: 5, y: 2, direction: "E"},
	command: "A",
	result: [false, { x: 5, y: 2, direction: "E"}],
      },
      {
	desc: "move to top edge",
	map: {width: 5, height: 5 },
	position: { x: 4, y: 4, direction: "N"},
	command: "A",
	result: [true, { x: 4, y: 5, direction: "N"}],
      },
      {
	desc: "stop at top edge",
	map: {width: 5, height: 5 },
	position: { x: 4, y: 5, direction: "N"},
	command: "A",
	result: [false, { x: 4, y: 5, direction: "N"}],
      },
      {
	desc: "move to left edge",
	map: {width: 5, height: 5 },
	position: { x: 1, y: 1, direction: "W"},
	command: "A",
	result: [true, { x: 0, y: 1, direction: "W"}],
      },
      {
	desc: "stop at left edge",
	map: {width: 5, height: 5 },
	position: { x: 0, y: 1, direction: "W"},
	command: "A",
	result: [false, { x: 0, y: 1, direction: "W"}],
      },
    ], ({desc, map, position, command, result}) => {
      it(`should move rover if next position is valid, ${desc}`, function () {
	expect(moveRover(command, position, map)).to.deep.equal(result);
      });
    });
  });
  
  describe("runRover", function() {
    _.each([
      {
      	desc: "initial position, advance",
      	map: {width: 5, height: 5 },
      	position: { x: 0, y: 0, direction: "N"},
      	commands: "A",
      	result: [
      	  [true, { x: 0, y: 1, direction: "N"}],
      	],
      },
      {
	desc: "initial position, move to top edge",
	map: {width: 5, height: 5 },
	position: { x: 0, y: 0, direction: "N"},
	commands: "AAAAAA",
	result: [
	  [true, { x: 0, y: 1, direction: "N"}],
	  [true, { x: 0, y: 2, direction: "N"}],
	  [true, { x: 0, y: 3, direction: "N"}],
	  [true, { x: 0, y: 4, direction: "N"}],
	  [true, { x: 0, y: 5, direction: "N"}],
	  [false, { x: 0, y: 5, direction: "N"}],
	],
      },
      {
	desc: "initial position, move to right edge",
	map: {width: 5, height: 5 },
	position: { x: 0, y: 0, direction: "N"},
	commands: "RAAAAAA",
	result: [
	  [true, { x: 0, y: 0, direction: "E"}],
	  [true, { x: 1, y: 0, direction: "E"}],
	  [true, { x: 2, y: 0, direction: "E"}],
	  [true, { x: 3, y: 0, direction: "E"}],
	  [true, { x: 4, y: 0, direction: "E"}],
	  [true, { x: 5, y: 0, direction: "E"}],
	  [false, { x: 5, y: 0, direction: "E"}],
	],
      },
      {
	desc: "initial position, move to left edge",
	map: {width: 5, height: 5 },
	position: { x: 0, y: 0, direction: "N"},
	commands: "RALALAA",
	result: [
	  [true, { x: 0, y: 0, direction: "E"}],
	  [true, { x: 1, y: 0, direction: "E"}],
	  [true, { x: 1, y: 0, direction: "N"}],
	  [true, { x: 1, y: 1, direction: "N"}],
	  [true, { x: 1, y: 1, direction: "W"}],
	  [true, { x: 0, y: 1, direction: "W"}],
	  [false, { x: 0, y: 1, direction: "W"}],
	],
      },
      {
	desc: "initial position, move to bottom edge",
	map: {width: 5, height: 5 },
	position: { x: 0, y: 0, direction: "N"},
	commands: "ARARAA",
	result: [
	  [true, { x: 0, y: 1, direction: "N"}],
	  [true, { x: 0, y: 1, direction: "E"}],
	  [true, { x: 1, y: 1, direction: "E"}],
	  [true, { x: 1, y: 1, direction: "S"}],
	  [true, { x: 1, y: 0, direction: "S"}],
	  [false, { x: 1, y: 0, direction: "S"}],
	],
      },
      // okay so I choose to ignore unknown commands
      // but we could also return [false, position] just like an invalid move
      {
	desc: "ignores unknown commands",
	map: {width: 5, height: 5 },
	position: { x: 0, y: 0, direction: "N"},
	commands: "AR2#AR$YUAA",
	result: [
	  [true, { x: 0, y: 1, direction: "N"}],
	  [true, { x: 0, y: 1, direction: "E"}],
	  [true, { x: 1, y: 1, direction: "E"}],
	  [true, { x: 1, y: 1, direction: "S"}],
	  [true, { x: 1, y: 0, direction: "S"}],
	  [false, { x: 1, y: 0, direction: "S"}],
	],
      },
    ], ({desc, map, position, commands, result}) => {
      it(`should execute commands and return list of rover positions, ${desc}`, function () {
	expect(runRover(commands, position, map)).to.deep.equal(result);
      });
    });
  });
});
