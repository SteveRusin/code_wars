import {assert} from 'chai';

function generator(sequencer, ...args) {
  return {
    next: sequencer(...args),
  };
}

function dummySeq() {
  return function() {
    return "dummy";
  };
}

function factorialSeq() {
  let i = 0;
  let fact = 1;
  return () => {
    fact *= i || 1;
    i++;
    return fact;
  }
}

function fibonacciSeq() {
  let before = 0;
  let current = 1;

  return () => {
    let next = before + current;
    before = current;
    current = next;
    return before;
  }
}

function rangeSeq(start, step) {
  start -= step;
  return () => {
    return start += step;
  }
}

function primeSeq() {
  let current = 1;
  const isPrime = (num) => {
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return true;
  }

  return () => {
    current++;
    while (!isPrime(current)) {
      current++;
    }
    return current;
  }
}

function partialSumSeq(...args) {
  let i = -1;
  let sum = 0;
  return () => {
    i++;
    if (i >= args.length) {
      throw new Error('End of sequence');
    }
    return sum += args[i];
  }
}

const Test = {
  assertEquals: assert.equal,
  assertDeepEquals: assert.deepEqual,
  expectError: (msg, fn) => {
    try {
      fn();
    } catch (e) {
      assert.equal(e.message, msg);
    }
  },
};

describe.skip("ES5 Dummy generator", function() {
  it("Test dummy generator", function() {
    var seq = generator(dummySeq);
    Test.assertEquals(seq.next(), 'dummy');
    Test.assertEquals(seq.next(), 'dummy');
    Test.assertEquals(seq.next(), 'dummy');
  });
});

describe("ES5 Simple Generators", function() {
  it("Test factorial generator", function() {
    var seq = generator(factorialSeq);
    Test.assertEquals(seq.next(), 1); // 0! = 1
    Test.assertEquals(seq.next(), 1); // 1! = 1
    Test.assertEquals(seq.next(), 2); // 2! = 2
    Test.assertEquals(seq.next(), 6); // 3! = 6
    Test.assertEquals(seq.next(), 24); // 4! = 6
  });
    
  it("Test Fibonacci generator", function() {
    var seq = generator(fibonacciSeq);
    Test.assertEquals(seq.next(), 1); // fib(0) = 1
    Test.assertEquals(seq.next(), 1); // fib(1) = 1
    Test.assertEquals(seq.next(), 2); // fib(2) = 2
    Test.assertEquals(seq.next(), 3); // fib(3) = 3
    Test.assertEquals(seq.next(), 5); // fib(4) = 5
    Test.assertEquals(seq.next(), 8); // fib(5) = 8
    Test.assertEquals(seq.next(), 13); // fib(6) = 13
  });
  
  it("Test Range generator", function() {
    var seq = generator(rangeSeq, 5, 3); // 5,8,11,14,17
    Test.assertEquals(seq.next(), 5);
    Test.assertEquals(seq.next(), 8);
    Test.assertEquals(seq.next(), 11);
    Test.assertEquals(seq.next(), 14);
  });
  
  it("Test Prime Numbers generator", function() {
    var seq = generator(primeSeq);
    Test.assertEquals(seq.next(), 2);
    Test.assertEquals(seq.next(), 3);
    Test.assertEquals(seq.next(), 5);
    Test.assertEquals(seq.next(), 7);
    Test.assertEquals(seq.next(), 11);
    Test.assertEquals(seq.next(), 13);
    Test.assertEquals(seq.next(), 17);
    Test.assertEquals(seq.next(), 19);
  });
  
  it.only("Test partial sum generator", function() {
    var seq = generator(partialSumSeq, -1, 4, 2, 5);
    Test.assertEquals(seq.next(), -1);
    Test.assertEquals(seq.next(), 3);
    Test.assertEquals(seq.next(), 5);
    Test.assertEquals(seq.next(), 10); //End of sequence
    Test.expectError('End of sequence error expected', seq.next);
  });
});
