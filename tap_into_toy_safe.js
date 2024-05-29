const CJK_START = 0x4e00;
const CJK_END = 0x9fff;
const CJK_RANGE = CJK_END - CJK_START + 1;
const chars = Array.from({ length: 20991 })
  .map((_, i) => String.fromCharCode(i + 0x4e00))
  .join("");

function crack(login) {
  const pwLen = findPasswordLength(login);
  const chunkSize = 64;
  let knownChars = "";
  const numChunks = Math.ceil(pwLen / chunkSize);

  for (let i = 0; i < numChunks; i++) {
    knownChars += findInChunk(i);
  }

  function findInChunk(chinkIndx) {
    let chunkChars = "";
    const start = chinkIndx * chunkSize;
    const end = Math.min(start + chunkSize, pwLen);
    let pointer = 0;

    while (chunkChars.length < end - start) {
      const currChar = chars[pointer];
      const reg = `.{${start}}${chunkChars}${currChar}.*`;
      if (login(reg)) {
        chunkChars += currChar;
        pointer = 0;
      } else {
        pointer++;
      }
    }

    return chunkChars;
  }

  return knownChars;
}

function findPasswordLength(login) {
  const maxLen = 2048;
  const minLen = 1024;

  for (let i = minLen; i <= maxLen; i++) {
    if (login(`.{${i}}`)) {
      return i;
    }
  }

  throw new Error("Password length not found");
}

function makeLogin(passwd) {
  return function (pw) {
    return new global.RegExp(`^${pw}$`).test(passwd);
  };
}

import { Test } from "./test_adapter.js";

describe("Internal test", function () {
  it("Maybe you should break a simple password first before attempting the challenge...", function () {
    this.timeout(10000);
    const passwd = [...Array(1536)]
      .map((_, i) => String.fromCharCode(i + 0x4e00))
      .join("");
    // console.log(passwd);

    const login = makeLogin(passwd);
    Test.assertEquals(crack(login), passwd);
  });
});
