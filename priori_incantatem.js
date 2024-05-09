const MAX_PRIOR_SPELLS = 3;
class Wand {
  static addSpell(wand, sName) {
    wand.spellHistory.unshift(sName);
    wand.spellHistory.length = Math.min(
      wand.spellHistory.length,
      MAX_PRIOR_SPELLS,
    );
  }

  static fnWrapper(wand, fn, fnName) {
    Wand.addSpell(wand, fnName);
    return fn.call(wand.proxy);
  }

  spellHistory = [];
  proxy = new Proxy(this, {
    get(target, prop) {
      const original = target[prop];
      if (typeof original === "function" && prop !== "prioriIncantatem") {
        return Wand.fnWrapper.bind(null, target, original, prop);
      }

      return original;
    },
    set(target, prop, value) {
      Reflect.set(target, prop, value);
      return true;
    },
    getPrototypeOf() {
      return Wand.prototype;
    },
  });

  constructor(spells = {}) {
    Object.assign(this, spells);
    return this.proxy;
  }

  prioriIncantatem() {
    const copy = this.spellHistory.slice();
    Wand.addSpell(this, "prioriIncantatem");
    return copy;
  }

  deletrius() {
    this.spellHistory.length = 0;
    this.spellHistory.push("deletrius");
  }
}

import { assert } from "chai";

const Test = {
  assertEquals: assert.strictEqual,
  expect: assert.isOk,
  assertSimilar: assert.deepStrictEqual,
};

describe("The Wand constructor", function () {
  it("should return an instance of the Wand class", function () {
    Test.expect(new Wand() instanceof Wand);
  });

  it("should correctly add spells to a wand", function () {
    const w = new Wand({
      peskipiksiPesternomi: function () {},
    });
    Test.assertEquals(typeof w.peskipiksiPesternomi, "function");
  });
});

describe("The prioriIncantatem method", function () {
  it("should naively work", function () {
    const w = new Wand({
      expelliarmus: function () {},
      alohomora: function () {},
      avadaKedavra: function () {},
    });

    w.alohomora();
    w.expelliarmus;
    w.avadaKedavra();

    Test.assertSimilar(w.prioriIncantatem(), ["avadaKedavra", "alohomora"]);
  });

  it("attach methods", () => {
    const w = new Wand({
      expelliarmus: function () {},
      alohomora: function () {},
      avadaKedavra: function () {},
    });

    w.newMethod = function () {};
    w.newMethod();

    Test.assertSimilar(w.prioriIncantatem(), ["newMethod"]);
  });
  it("max spells", () => {
    const w = new Wand({
      alohomora: function () {
        console.log("unlocked!");
      },
      lumos: function () {
        console.log("let there be light!");
      },
      wingardiumLeviosa: function () {
        console.log("levitation!");
      },
    });

    w.wingardiumLeviosa(); // logs 'levitation!'
    w.alohomora(); // logs 'unlocked!'
    w.lumos(); // logs 'let there be light!'

    w.prioriIncantatem();

    Test.assertSimilar(w.prioriIncantatem(), [
      "prioriIncantatem",
      "lumos",
      "alohomora",
    ]);
  });

  it("Should call methods ", () => {
    const w = new Wand({
      alohomora: function () {
        console.log("unlocked!");
      },
      lumos: function () {
        this.alohomora();
      },
    });

    w.lumos();

    Test.assertSimilar(w.prioriIncantatem(), ["alohomora", "lumos"]);
  });

  it("should work for methods up the prototype chain as well ", () => {
    const w = new Wand({
      lumos: function () {
        this.alohomora();
      },
    });

    Wand.prototype.alohomora = function () {
      console.log("unlocked!");
    };
    console.log("calling");

    w.lumos();

    Test.assertSimilar(w.prioriIncantatem(), ["alohomora", "lumos"]);
  });

  it.only("Should call methods on prototype", () => {
    const w = new Wand({});

    w.toString();

    Test.assertSimilar(w.prioriIncantatem(), ["toString"]);
  });
});
