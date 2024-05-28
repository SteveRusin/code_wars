import { assert } from "chai";

const regions = ["qwertyuiop", "asdfghjkl", "zxcvbnm,."];
const regionsUpper = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM<>"];

function encrypt(text, key) {
  return crypt(text, key, 1);
}

function decrypt(text, key) {
  return crypt(text, key, -1);
}

function crypt(text, key, direction) {
  const move = key
    .toString()
    .padStart(3, "0")
    .split("")
    .map((x) => parseInt(x) * direction);
  let encrypted = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isUpper =
      char === "," || char === "." ? false : char === char.toUpperCase();
    const region = isUpper ? regionsUpper : regions;
    const regionIndex = region.findIndex((region) => region.includes(char));

    if (regionIndex === -1) {
      encrypted += char;
      continue;
    }

    const encryptTable = region[regionIndex];
    const charIndex = encryptTable.indexOf(char);
    const newIndex = (charIndex + move[regionIndex] + encryptTable.length) % encryptTable.length;
    encrypted += encryptTable[newIndex];
  }

  return encrypted;
}

const Test = {
  assertEquals: (a, b) => assert.strictEqual(a, b),
};

describe("Solution", function () {
  it("EncryptExampleTests", function () {
    Test.assertEquals(encrypt("A", 111), "S");
    Test.assertEquals(encrypt("Abc", 212), "Smb");
    Test.assertEquals(encrypt("Wave", 0), "Wave"); // -> 000
    Test.assertEquals(encrypt("Wave", 345), "Tg.y");
    Test.assertEquals(encrypt("Ball", 134), ">fdd");
    Test.assertEquals(encrypt("Ball", 444), ">gff");

    Test.assertEquals(encrypt("This is a test.", 348), "Iaqh qh g iyhi,");
    Test.assertEquals(
      encrypt(
        "Do the kata Kobayashi Maru Test. Endless fun and excitement when finding a solution.",
        583,
      ),
      "Sr pgi jlpl Jr,lqlage Zlow Piapc I.skiaa dw. l.s ibnepizi.p ugi. de.se.f l arkwper.c",
    );
  });

  it.only("DecryptExampleTests", function () {
    Test.assertEquals(decrypt("S", 111), "A");
    Test.assertEquals(decrypt("Smb", 212), "Abc");
    Test.assertEquals(decrypt("Wave", 0), "Wave"); // -> 000
    Test.assertEquals(decrypt("Tg.y", 345), "Wave");
    Test.assertEquals(decrypt(">fdd", 134), "Ball");
    Test.assertEquals(decrypt(">gff", 444), "Ball");

    Test.assertEquals(decrypt("Iaqh qh g iyhi,", 348), "This is a test.");
    Test.assertEquals(
      decrypt(
        "Sr pgi jlpl Jr,lqlage Zlow Piapc I.skiaa dw. l.s ibnepizi.p ugi. de.se.f l arkwper.c",
        583,
      ),
      "Do the kata Kobayashi Maru Test. Endless fun and excitement when finding a solution.",
    );
  });
});
