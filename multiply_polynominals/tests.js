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

describe("Sample", function () {
  it("should correctly convert a polynomial to a string", function () {
    const input = [
      {
        run: true,
        input: [
          {
            coef: 1,
            var: "u",
            pow: 2,
          },
          {
            coef: 2,
            var: "u",
            pow: 1,
          },
          {
            coef: 1,
            var: "u",
            pow: 0,
          },
        ],
        expected: "u^2+2u+1",
      },
      {
        run: true,
        expected: "3x^3-x^2",
        input: [
          {
            coef: 3,
            var: "x",
            pow: 3,
          },
          {
            coef: -1,
            var: "x",
            pow: 2,
          },
        ],
      },
      {
        run: true,
        input: [
          {
            coef: 8,
            var: "y",
            pow: 1,
          },
          {
            coef: -8,
            var: "y",
            pow: 0,
          },
        ],
        expected: "8y-8",
      },
    ];

    input
      .filter((e) => e.run)
      .forEach(({ input, expected }) => {
        assert.strictEqual(polynomialToString(input), expected);
      });
  });
  it("should correctly parse the input", function () {
    const t = [
      {
        input: "u^2 +2u+1",
        expected: [
          {
            coef: 1,
            var: "u",
            pow: 2,
          },
          {
            coef: 2,
            var: "u",
            pow: 1,
          },
          {
            coef: 1,
            var: "u",
            pow: 0,
          },
        ],
      },
      {
        input: "u^2 -2u-1",
        expected: [
          {
            coef: 1,
            var: "u",
            pow: 2,
          },
          {
            coef: -2,
            var: "u",
            pow: 1,
          },
          {
            coef: -1,
            var: "u",
            pow: 0,
          },
        ],
      },
      {
        input: "0",
        expected: [
          {
            coef: 0,
            var: "",
            pow: 0,
          },
        ],
      },
      {
        input: "3v^5+v^4+3v^3-1",
        expected: [
          {
            coef: 3,
            var: "v",
            pow: 5,
          },
          {
            coef: 1,
            var: "v",
            pow: 4,
          },
          {
            coef: 3,
            var: "v",
            pow: 3,
          },
          {
            coef: -1,
            var: "v",
            pow: 0,
          },
        ],
      },
      {
        run: true,
        input: "x^2",
        expected: [
          {
            coef: 1,
            var: "x",
            pow: 2,
          },
        ],
      },
      {
        run: true,
        input: "3x - 1",
        expected: [
          {
            coef: 3,
            var: "x",
            pow: 1,
          },
          {
            coef: -1,
            var: "x",
            pow: 0,
          },
        ],
      },
    ];
    t.filter((e) => e.run).forEach(({ input, expected }) => {
      assert.deepEqual(parsePolynomial(input), expected);
    });
  });
  it("should correctly multiply two polynomials", function () {
    const t = [
      {
        poly1: [
          {
            coef: 2,
            var: "",
            pow: 0,
          },
        ],
        poly2: [
          {
            coef: 4,
            var: "y",
            pow: 1,
          },
          {
            coef: -4,
            var: "",
            pow: 0,
          },
        ],
        expected: [
          {
            coef: 8,
            var: "y",
            pow: 1,
          },
          {
            coef: -8,
            var: "",
            pow: 0,
          },
        ],
      },
      {
        poly1: [
          {
            coef: 1,
            var: "u",
            pow: 2,
          },
          {
            coef: 2,
            var: "u",
            pow: 1,
          },
          {
            coef: 1,
            var: "u",
            pow: 0,
          },
        ],
        poly2: [
          {
            coef: 1,
            var: "u",
            pow: 1,
          },
          {
            coef: 1,
            var: "u",
            pow: 0,
          },
        ],
        expected: [
          {
            coef: 1,
            var: "u",
            pow: 3,
          },
          {
            coef: 3,
            var: "u",
            pow: 2,
          },
          {
            coef: 3,
            var: "u",
            pow: 1,
          },
          {
            coef: 1,
            var: "u",
            pow: 0,
          },
        ],
      },
      {
        poly1: [
          {
            coef: 1,
            var: "x",
            pow: 2,
          },
        ],
        poly2: [
          {
            coef: 3,
            var: "x",
            pow: 1,
          },
          {
            coef: -1,
            var: "x",
            pow: 0,
          },
        ],
        expected: [
          {
            coef: 3,
            var: "x",
            pow: 3,
          },
          {
            coef: -1,
            var: "x",
            pow: 2,
          },
        ],
      },
      // polynomialProduct("0", "2 - x"),
      // "0",
      {
        run: true,
        poly1: [
          {
            coef: 0,
            var: "",
            pow: 0,
          },
        ],
        poly2: [
          {
            coef: 2,
            var: "x",
            pow: 0,
          },
          {
            coef: -1,
            var: "x",
            pow: 0,
          },
        ],
        expected: [
          {
            coef: 0,
            var: "x",
            pow: 0,
          },
        ],
      },
    ];
    t.filter((e) => e.run)
      .filter((e) => e.run)
      .forEach(({ poly1, poly2, expected }) => {
        assert.deepEqual(multiplyPolynomials(poly1, poly2), expected);
      });
  });
  it("should correctly simplify a polynomial", function () {
    const poly = [
      { coef: 1, pow: 3, var: "u" },
      { coef: 1, pow: 2, var: "u" },
      { coef: 2, pow: 2, var: "u" },
      { coef: 2, pow: 1, var: "u" },
      { coef: 1, pow: 1, var: "u" },
      { coef: 1, pow: 0, var: "u" },
    ];
    const expected = [
      { coef: 1, pow: 3, var: "u" },
      { coef: 3, pow: 2, var: "u" },
      { coef: 3, pow: 1, var: "u" },
      { coef: 1, pow: 0, var: "u" },
    ];

    assert.deepEqual(simplifyPolynomial(poly), expected);
  });
  it("main tests", function () {
    assert.strictEqual(
      polynomialProduct("u^2 + 2u+1", "u + 1"),
      "u^3+3u^2+3u+1",
      "Testing: u^2 + 2u+1 and u + 1",
    );
    assert.strictEqual(
      polynomialProduct("x^2", "3x - 1"),
      "3x^3-x^2",
      "Testing: x^2 and 3x - 1",
    );
    assert.strictEqual(
      polynomialProduct("2", "4y - 4"),
      "8y-8",
      "Testing: 2 and 4y - 4",
    );
    assert.strictEqual(
      polynomialProduct("-4r^2 + 1", "-1"),
      "4r^2-1",
      "Testing: -4r^2 + 1 and -1",
    );
    assert.strictEqual(
      polynomialProduct("1", "p^3"),
      "p^3",
      "Testing: 1 and p^3",
    );
    assert.strictEqual(polynomialProduct("1", "-1"), "-1", "Testing: 1 and -1");
    assert.strictEqual(
      polynomialProduct("0", "2 - x"),
      "0",
      "Testing: 0 and 2 - x",
    );
    assert.strictEqual(polynomialProduct("-1", "0"), "0", "Testing: -1 and 0");
    assert.strictEqual(
      polynomialProduct("v^2 - 1+3v^3", "1+v^2"),
      "3v^5+v^4+3v^3-1",
      "Testing: v^2 - 1+3v^3 and 1+v^2",
    );
  });

  xit("large tests", function () {
    this.timeout(15_000);

    const inputs = [];

    for (let i = 1; i < 6; i++) {
      const largeInput1_1 = readFileSync(
        __dirname + `/input${i}_1.txt`,
        "utf-8",
      );
      const largeInput1_2 = readFileSync(
        __dirname + `/input${i}_2.txt`,
        "utf-8",
      );

      inputs.push([largeInput1_1, largeInput1_2]);
    }

    console.time("large inputs");
    inputs.forEach(([input1, input2], i) => {
      console.time(`Running test ${i + 1}`);
      polynomialProduct(input1, input2);
      console.timeEnd(`Running test ${i + 1}`);
    });
    console.timeEnd("large inputs");
  });
});
