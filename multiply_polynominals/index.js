/**
 * @typedef {Object} PolynomialElement
 * @property {number} coef
 * @property {string} var
 * @property {number} pow
 */

/**
 * @param {string} poly1
 * @param {string} poly2
 * @returns {string}
 */
function polynomialProduct(poly1, poly2) {
  const left = parsePolynomial(poly1);
  const right = parsePolynomial(poly2);
  const multiplied = multiplyPolynomials(left, right);

  return polynomialToString(multiplied);
}

/**
 * @param {PolynomialElement[]} poly1
 * @param {PolynomialElement[]} poly2
 * @returns {PolynomialElement[]}
 */
function multiplyPolynomials(poly1, poly2) {
  const result = new Map();
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const coef = poly1[i].coef * poly2[j].coef;
      const pow = poly1[i].pow + poly2[j].pow;
      const varName = poly1[i].var || poly2[j].var;

      const key = `${pow}-${varName}`;
      if (result.has(key)) {
        result.set(key, {
          coef: result.get(key).coef + coef,
          pow,
          var: varName,
        });
      } else {
        result.set(key, { coef, pow, var: varName });
      }
    }
  }

  return simplifyPolynomial(Array.from(result.values()));
}


/**
 * @param {PolynomialElement[]} poly
 * @returns {string}
 */
function polynomialToString(poly) {
  const strPoly = poly.reduce((acc, el) => {
    if (el.coef === 0) {
      return acc;
    }

    let str = "";

    if (el.coef < 0) {
      str += "-";
    } else {
      str += "+";
    }

    if (el.pow > 0 && Math.abs(el.coef) !== 1) {
      str += Math.abs(el.coef);
    } else if (el.pow === 0) {
      str += Math.abs(el.coef);
    }

    if (el.pow > 0) {
      str += el.var;

      if (el.pow > 1) {
        str += `^${el.pow}`;
      }
    }

    return acc + str;
  }, "");

  const res = strPoly[0] === "+" ? strPoly.slice(1) : strPoly;

  return res || "0";
}

/**
 * @param {PolynomialElement[]} poly
 * @returns {PolynomialElement[]}
 */
function simplifyPolynomial(poly) {
  const result = [];
  const grouped = poly.reduce((acc, el) => {
    const key = el.pow + el.var;
    if (!acc[key]) {
      acc[key] = { coef: 0, pow: el.pow, var: el.var };
    }
    acc[key].coef += el.coef;
    return acc;
  }, {});

  for (const key in grouped) {
    result.push(grouped[key]);
  }

  return result.sort((a, b) => b.pow - a.pow);
}

/**
 * @param {string} poly
 * @returns {PolynomialElement[]}
 */
function parsePolynomial(poly) {
  const regexp = /([+-])?(\d*)?([a-zA-Z])?(\^(\d+))?/g;
  poly = poly.replace(/\s/g, "");
  const parsed = [];
  let varName = "";
  while (true) {
    const res = regexp.exec(poly);
    if (!res[0]) {
      break;
    }
    const sign = res[1] === "-" ? -1 : 1;

    const el = {
      coef: (res[2] ? parseInt(res[2]) : 1) * sign,
      var: res[3],
      pow: res[5] ? parseInt(res[5]) : 0,
    };

    if (el.pow === 0 && el.var) {
      el.pow = 1;
    }

    if (el.var) {
      varName = el.var;
    }
    parsed.push(el);
  }

  parsed.forEach((el) => {
    el.var = varName;
  });

  return parsed.sort((a, b) => b.pow - a.pow);
}

export {
  polynomialProduct,
  parsePolynomial,
  multiplyPolynomials,
  polynomialToString,
  simplifyPolynomial,
};
