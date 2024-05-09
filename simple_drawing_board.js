function Canvas(width, height) {
  if (width < 1 || height < 1) {
    throw new Error("Out of bounds");
  }
  const board = Array.from({ length: height }, () => Array(width).fill(" "));

  this.draw = (x1, y1, x2, y2) => {
    checkBounds(x1, y1);
    checkBounds(x2, y2);

    for (let i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) {
      for (let j = Math.min(y1, y2); j <= Math.max(y1, y2); j++) {
        if (i === x1 || i === x2 || j === y1 || j === y2) {
          board[j][i] = "x";
        }
      }
    }

    return this;
  };

  this.fill = (x, y, ch) => {
    checkBounds(x, y);
    if (board[y][x] === " ") {
      board[y][x] = ch;
      if (x > 0) this.fill(x - 1, y, ch);
      if (x < width - 1) this.fill(x + 1, y, ch);
      if (y > 0) this.fill(x, y - 1, ch);
      if (y < height - 1) this.fill(x, y + 1, ch);
    }

    return this;
  };

  this.drawCanvas = () => {
    const canvas = board.reduce((acc, row) => {
      return acc + "|" + row.join("") + "|\n";
    }, "");
    const border = "-".repeat(width + 2);

    return border + "\n" + canvas + border;
  };

  function checkBounds(x, y) {
    if (!(x >= 0 && x <= width && y >= 0 && y <= height)) {
      throw new Error("Out of bounds");
    }
  }
}

import { assert } from "chai";

const assertEquals = assert.strictEqual;

describe("Solution", function () {
  it("draw lines", function () {
    let c = new Canvas(5, 5);
    c.draw(0, 2, 4, 2).draw(2, 0, 2, 4);
    const res = c.drawCanvas();
    const exp = "-------\n|  x  |\n|  x  |\n|xxxxx|\n|  x  |\n|  x  |\n-------";
    console.log(res);
    console.log(exp);
    assertEquals(res, exp);
  });

  it("draw rectangle", function () {
    let c = new Canvas(7, 7);
    c.draw(1, 1, 5, 4);
    const res = c.drawCanvas();
    const exp =
      "---------\n|       |\n| xxxxx |\n| x   x |\n| x   x |\n| xxxxx |\n|       |\n|       |\n---------";
    console.log(res);
    console.log(exp);
    assertEquals(res, exp);
  });

  it("fill rectangle", function () {
    let c = new Canvas(7, 7);
    let actual = c.draw(1, 1, 5, 4).fill(3, 3, "o");
    const res = c.drawCanvas();
    const exp =
      "---------\n|       |\n| xxxxx |\n| xooox |\n| xooox |\n| xxxxx |\n|       |\n|       |\n---------";
    console.log(res);
    console.log(exp);
    assertEquals(res, exp);
  });
});
