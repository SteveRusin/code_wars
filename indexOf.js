import { assert } from "chai";

String.prototype.indexOf = function (searchValue, fromIndex = 0) {
  if (typeof searchValue === "string") {
    for (let i = fromIndex; i < this.length; i++) {
      if (this.slice(i, i + searchValue.length) === searchValue) {
        return i;
      }
    }
  } else if (searchValue instanceof RegExp) {
    const re = new RegExp(
      searchValue.source,
      "g" +
        (searchValue.ignoreCase ? "i" : "") +
        (searchValue.multiLine ? "m" : ""),
    );
    re.lastIndex = fromIndex;
    const res = re.exec(this);
    if (!res) return -1;
    return re.lastIndex - res[0].length;
  }

  return -1;
};

String.prototype.lastIndexOf = function (searchValue, fromIndex = this.length) {
  if (typeof searchValue === "string") {
    for (let i = fromIndex; i >= 0; i--) {
      if (this.slice(i, i + searchValue.length) === searchValue) {
        return i;
      }
    }
  } else if (searchValue instanceof RegExp) {
    // Test.assertEquals("abcba".lastIndexOf(/a?bc|cb/, 2), 2);
    const re = new RegExp(
      searchValue.source,
      "g" +
        (searchValue.ignoreCase ? "i" : "") +
        (searchValue.multiLine ? "m" : ""),
    );
    let lastIndex = fromIndex;
    while (lastIndex > 0) {
      re.lastIndex = lastIndex;
      const res = re.exec(this);
      if (res) {
        const match = re.lastIndex - res[0].length;

        if (match <= fromIndex) {
          return match;
        }
      }
      lastIndex--;
    }
  }

  return -1;
};

const Test = {
  assertEquals: assert.strictEqual,
};

describe("Tests", () => {
  it("test", () => {
    // Test.assertEquals("abcba".indexOf("b"), 1);
    // Test.assertEquals("abcba".indexOf("b", 2), 3);
    // Test.assertEquals("abcba".indexOf("d"), -1);
    //
    // Test.assertEquals("abcba".indexOf(/bc|cb/), 1);
    // Test.assertEquals("abcba".indexOf(/bc|cb/, 2), 2);
    // Test.assertEquals("abcba".indexOf(/d/), -1);
    //
    // Test.assertEquals("abcba".lastIndexOf("b"), 3);
    // Test.assertEquals("abcba".lastIndexOf(/bc|cb/), 2);
    // Test.assertEquals("abcba".lastIndexOf(/b/, 2), 1);
    // Test.assertEquals("abcba".lastIndexOf(/a?bc|cb/), 2);
    Test.assertEquals("abcba".lastIndexOf(/a?bc|cb/, 2), 2);
    // Test.assertEquals("abcba".lastIndexOf(/b/, 2), 1);
    //
    // Test.assertEquals("abcba".indexOf(/^c/, 2), -1);
    // Test.assertEquals("abcba".indexOf(/bc|cb/), 1);
  });
});
