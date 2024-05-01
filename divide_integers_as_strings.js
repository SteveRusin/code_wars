// https://www.codewars.com/kata/58dea43ff98a7e2124000169/solutions/javascript

// a - dividend
// b - divisor
function divideStrings(a, b) {
  const aInt = +a;
  const bInt = +b;

  if (aInt <= Number.MAX_SAFE_INTEGER && bInt <= Number.MAX_SAFE_INTEGER) {
    return [Math.floor(aInt / bInt).toString(), (aInt % bInt).toString()];
  }

  let dividend = a.split("").map((x) => +x);
  const divisor = b.split("").map((x) => +x);

  let quotients = [];
  let comp;

  const BASE_MULTIPLICATOR = [1];
  let multiplicator = BASE_MULTIPLICATOR.slice();
  let previousAssumtion;

  while (true) {
    const assumption = multiplyArrays(divisor, multiplicator);
    comp = compareArrays(assumption, dividend);

    if (comp.isBigger) {
      dividend = substractArrays(dividend, previousAssumtion);
      decrement(multiplicator);
      quotients.push(multiplicator);
      if (compareArrays(divisor, dividend).isBigger) {
        break;
      }
      multiplicator = BASE_MULTIPLICATOR.slice();
      previousAssumtion = null;
    } else if (comp.isSmaller) {
      increment(multiplicator);
      previousAssumtion = assumption;
    }
  }

  const answer = quotients.reduce((prev, curr) => addArrays(prev, curr));
  const remainder = dividend;

  return [answer.join(""), remainder.join("")];
}

const memo = {};

function multiplyArrays(arr1, arr2) {
  let res = new Array(arr1.length + arr2.length).fill(0);
  const key = arr1.join("") + arr2.join("");
  if (memo[key]) {
    return memo[key];
  }

  for (let i = arr1.length - 1; i >= 0; i--) {
    for (let j = arr2.length - 1; j >= 0; j--) {
      const product = arr1[i] * arr2[j];
      const sum = product + res[i + j + 1];
      res[i + j] += Math.floor(sum / 10);
      res[i + j + 1] = sum % 10;
    }
  }

  memo[key] = res;

  return res;
}

function addArrays(arr1, arr2) {
  alignArrays(arr1, arr2);

  let res = [];
  let curry = 0;

  for (let j = arr2.length - 1; j >= 0; j--) {
    const topDigit = arr1[j] + curry;
    const bottomDigit = arr2[j];

    let summ = topDigit + bottomDigit;

    if (summ >= 10) {
      curry = 1;
      summ -= 10;
    } else {
      curry = 0;
    }

    res.push(summ);
  }

  if (curry) {
    res.push(curry);
  }

  return res.reverse();
}

function compareArrays(arr1, arr2) {
  removeLeadingZeros(arr1);
  removeLeadingZeros(arr2);
  if (arr1.length > arr2.length) {
    return {
      isBigger: true,
      isEqual: false,
      isSmaller: false,
    };
  } else if (arr1.length < arr2.length) {
    return {
      isBigger: false,
      isEqual: false,
      isSmaller: true,
    };
  }

  const length = arr1.length;

  for (let i = 0; i < length; i++) {
    const a1 = arr1[i];
    const a2 = arr2[i];

    if (a1 === a2) {
      continue;
    }

    if (a1 > a2) {
      return {
        isBigger: true,
        isEqual: false,
        isSmaller: false,
      };
    } else {
      return {
        isBigger: false,
        isEqual: false,
        isSmaller: true,
      };
    }
  }

  return {
    isBigger: false,
    isEqual: true,
    isSmaller: false,
  };
}

function removeLeadingZeros(arr) {
  while (arr[0] === 0 && arr.length > 1) {
    arr.shift();
  }
}

function alignArrays(arr1, arr2) {
  if (arr1.length === arr2.length) {
    return;
  }

  const length = Math.max(arr1.length, arr2.length);
  if (arr1.length < length) {
    const diff = length - arr1.length;
    arr1.unshift(...Array.from({ length: diff }).fill(0));
  } else {
    const diff = length - arr2.length;
    arr2.unshift(...Array.from({ length: diff }).fill(0));
  }
}

function substractArrays(arr1, arr2) {
  let borrow = 0;
  let res = new Array(arr1.length).fill(0);

  const lengthDiff = arr1.length - arr2.length;
  for (let j = arr1.length - 1; j >= 0; j--) {
    const topDigit = arr1[j] - borrow;
    const bottomDigit = arr2[j - lengthDiff] || 0;

    let substraction = topDigit - bottomDigit;

    if (substraction < 0) {
      substraction += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }

    res[j] = substraction;
  }

  return res;
}

function increment(arr) {
  if (arr.length === 0) {
    arr.push(1);
    return;
  }

  const lastInx = arr.length - 1;
  const last = arr[lastInx];
  if (last === 9) {
    arr[lastInx] = 1;
    arr.push(0);
  } else {
    arr[lastInx] += 1;
  }
}

function decrement(arr) {
  if (arr.length === 0) {
    return;
  }

  if (arr.length === 1 && arr[0] === 0) {
    throw new Error("can't decrement 0");
  }

  const lastInx = arr.length - 1;
  const last = arr[lastInx];
  if (last === 0) {
    arr.pop();
    arr[lastInx - 1] = 9;
  } else {
    arr[lastInx] -= 1;
  }
}

let a =
  "513155301607988253764688779235506523108943489100389444354983530458327101112472048671364954627229180826300000000";
let b = "828079343473593841747438952009580119683120947898565227868816996037730";

let expected = `Expected:
  [
  '619693397320388508981564939477371618158732',
  '237889962178432442801596973238331942430538476348584255362264099041640'
]`;

a =
  "74974963296390227518034425168261879147179412223193476969817983977920624472225778840960509506850318444143903011577514963032000879000000";
b = "3877099233712817521602900360586255710147665802669377645432300000";

const tests = [
  ["1001", "39"],
  ["111", "32"],
  [
    "74974963296390227518034425168261879147179412223193476969817983977920624472225778840960509506850318444143903011577514963032000879000000",
    "3877099233712817521602900360586255710147665802669377645432300000",
  ],
  [
    "513155301607988253764688779235506523108943489100389444354983530458327101112472048671364954627229180826300000000",
    "828079343473593841747438952009580119683120947898565227868816996037730",
  ],
  [
    "7497496329639022751803442516826187914717941222319347696981798397792062447222577884096050950685031844414390301157751496303200087900000",
    "3877099233712817521602900360586255710147665802669377645432300000",
  ],
  [
    "7497496329639022751803442516826187914717941222319347696981798397792062447222577884096050950685031844414390301157751496303200087902000",
    "3877099233712817521602900362586255710127665802669377645432300000",
  ],
  [
    "513155301607988253763688779235506523108943429100389444354983530458327101112472048671364954627229180826300000050",
    "828079343473593841747438952009580119683120997898565227868816996037730",
  ],
  [
    "7497496329639022751803442516826187914717941222319347696981798397792062447222577884096050950685031844414390301157751496303200087902000",
    "3877099233712817521602900362586255710127665802669377645432300000",
  ],
  [
    "7497496329639022751803442516826187914717941222319347696981798397792062447222577884096050950685031844414390301157751496303200087902000",
    "3877099233712817521602900362586255710127665802669377645432300000",
  ],
  [
    "7497496329639022751803442516826187914717941222319347696981798397792062447222577884096050950685031844414390301157751496303200087902000",
    "3877099233712817521602900362586255710127665802669377645432300000",
  ],
];
globalThis.run = () => {
  console.time("divideStrings");
  tests.forEach(([a, b], i) => {
  console.time(i);
    console.log(divideStrings(a, b));
  console.timeEnd(i);
  });
  console.timeEnd("divideStrings");
};
run();
