import {
  polynomialProduct,
  polynomialToString,
  parsePolynomial,
  simplifyPolynomial,
  multiplyPolynomials,
} from "./index.js";

import { assert } from "chai";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputs = [];

for (let i = 1; i < 6; i++) {
// for (let i = 1; i < 2; i++) {
  const largeInput1_1 = readFileSync(__dirname + `/input${i}_1.txt`, "utf-8");
  const largeInput1_2 = readFileSync(__dirname + `/input${i}_2.txt`, "utf-8");

  inputs.push([largeInput1_1, largeInput1_2]);
}

function run() {
  console.time("large inputs");
  inputs.forEach(([input1, input2], i) => {
    console.time(`Running test ${i + 1}`);
    polynomialProduct(input1, input2);
    console.timeEnd(`Running test ${i + 1}`);
  });
  console.timeEnd("large inputs");
}

global.run = run;
run()
console.log('ready');

// setTimeout(() => {}, 999999);
