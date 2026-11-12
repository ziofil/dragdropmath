/** Wrong answers for guess-first exercises: what a typical mistake leads to. Keyed by puzzle id. */
export const DECOYS: Record<string, [string, string]> = {
  // shuffle
  s1: [
    "2x", // wrote 2 + x as 2x
    "x - 2", // gave the 2 a minus when moving it
  ],
  s2: [
    "x + 12", // multiplied 3 and 4 instead of adding
    "7x", // wrote 7 next to x as 7x
  ],
  s7: [
    "y + 7", // took − 2 as + 2
    "3y", // wrote 3 next to y as 3y
  ],
  s3: [
    "7x", // added 2 and 5 instead of multiplying
    "25x", // wrote 2·5 as 25
  ],
  s8: [
    "14 - x", // took − 4 as + 4
    "6 + x", // dropped the minus on x
  ],
  s9: [
    "5ab", // added 2 and 3 instead of multiplying
    "2a + 3b", // turned the product into a sum
  ],
  s14: [
    "4y", // did 10 − 2·3 first, then multiplied by y
    "10 - 5y", // added 2 and 3 instead of multiplying
  ],
  s5: [
    "6y", // combined the numbers with the y-term
    "3y + 3", // joined the 1 onto 2y
  ],
  s15: [
    "a + 9", // took − 2 as + 2
    "5a", // wrote 5 next to a as 5a
  ],
  s16: [
    "6b + 2", // added 3 and 3 instead of multiplying
    "11b", // added 2 and 9 into the b-term
  ],
  s4: [
    "7x", // wrote 7 next to x as 7x
    "x + 6", // missed the 1
  ],
  s17: [
    "x + 5", // took 2 − 7 as + 5
    "x + 9", // took − 7 as + 7
  ],
  s18: [
    "5xy + 4", // added 3 and 2 instead of multiplying
    "6xy + 6", // took − 1 as + 1
  ],
  s10: [
    "ab + 7", // wrote a + b as ab
    "a + b + 10", // multiplied 5 and 2 instead of adding
  ],
  s6: [
    "x + 5y + 1", // added 3 and 2 instead of multiplying
    "x + 7y", // joined the 1 onto 6y
  ],
  s11: [
    "xy + 6", // wrote x + y as xy
    "x + y + 5", // missed the 1
  ],
  s19: [
    "7a + b + 1", // added 2 and 5 instead of multiplying
    "10a + b + 7", // took − 3 as + 3
  ],
  s12: [
    "5x + y + 3", // added 2 and 3 instead of multiplying
    "6x + y + 5", // took − 1 as + 1
  ],
  s20: [
    "6a + 2", // added 2 and 4 instead of multiplying
    "8a + 14", // took − 2·3 as + 6
  ],
  s13: [
    "x + 9y - 5", // added 4 and 5 instead of multiplying
    "x + 20y + 9", // took − 7 as + 7
  ],
  s21: [
    "7ab + 4c + 2", // added 2, 3 and 2 instead of multiplying
    "12ab + 4c + 8", // dropped the minus on 3
  ],
  s22: [
    "a + 5b + 3", // added 3 and 2 instead of multiplying
    "a + 6b + 5", // took − 1 as + 1
  ],
  s23: [
    "15b + 8a + 7", // dropped the minus in front of 2·a·4
    "15b - 8a + 11", // took − 2 as + 2
  ],
  s24: [
    "4a + 5b + 6c + 4", // dropped the minus on 6c
    "2a + 5b - 6c + 4", // counted only one of the 2s in a·2·2
  ],
  s25: [
    "6x + 3y - z + 8", // added 3 and 3 instead of multiplying
    "9x + 3y + z + 8", // dropped the minus on z
  ],
  s27: [
    "3a + 6b - c + 6", // added 2 and 4 instead of multiplying
    "3a + 8b - c + 5", // added 2 and 3 instead of multiplying
  ],
  s26: [
    "4x + 6y - z + 10", // added 3 and 3 instead of multiplying
    "4x + 9y + z + 10", // dropped the minus on z
  ],
  s28: [
    "5x - y + 5z + 8", // added 2 and 3 instead of multiplying
    "6x + y + 6z + 8", // dropped the minus on y
  ],
  s29: [
    "5a - b + 4c + 12", // added 2 and 3 instead of multiplying
    "6a - b + 4c + 7", // added 3 and 4 instead of multiplying
  ],
  s30: [
    "7x + y - 6z + 4", // added the numbers in each product instead of multiplying
    "10x + y + 9z + 4", // dropped the minus in front of z·3·3
  ],

  // collect
  c1: [
    "5x^2", // added the x's into x²
    "6x", // multiplied 3 and 2 instead of adding
  ],
  c2: [
    "x^2 + 4", // took x + x as x²
    "6x", // combined the number with the x-terms
  ],
  c3: [
    "6y", // combined the number with the y-terms
    "7y + 3", // took − 2y as + 2y
  ],
  c4: [
    "2a + b", // took − a as + a
    "a + b", // left out the − a
  ],
  c17: [
    "5a^2b^2", // added the ab's into a²b²
    "6ab", // multiplied 3 and 2 instead of adding
  ],
  c18: [
    "2xy + 3", // forgot the lone xy counts as 1xy
    "6xy", // combined the number with the xy-terms
  ],
  c9: [
    "6x", // added 2 and 3 instead of multiplying
    "6x^2", // took 6x + x as 6x²
  ],
  c19: [
    "2x + 3y", // took − x as + x
    "2y", // forgot the lone y counts as 1y
  ],
  c5: [
    "6x + 4", // took − 1 as + 1
    "8x", // combined the numbers with the x-terms
  ],
  c10: [
    "3x + 7", // forgot the lone x counts as 1x
    "11x", // combined the numbers with the x-terms
  ],
  c11: [
    "3a", // forgot the lone a counts as 1a
    "2a", // took + a as − a
  ],
  c6: [
    "7xy", // combined unlike terms
    "3x + 3y", // forgot the lone y counts as 1y
  ],
  c7: [
    "7x + y", // took − 3x as + 3x
    "x + 3y", // took − y as + y
  ],
  c8: [
    "2a + 4b + 5", // took − 2b as + 2b
    "4a + 5", // took − a as + a
  ],
  c12: [
    "3x + 3y", // added 4 and 2 instead of multiplying
    "5x + 2y", // forgot the lone y counts as 1y
  ],
  c13: [
    "4a + b", // took − a as + a
    "2a + 7b", // took − 3b as + 3b
  ],
  c16: [
    "2x + y + 1", // added 2 and 3 instead of multiplying
    "4x + 2y + 1", // took − x as + x
  ],
  c21: [
    "x + 2y + 6", // took − 3 as + 3
    "9x + 2y", // took − 4x as + 4x
  ],
  c20: [
    "5y", // took − y as + y
    "3y + 12", // took − 2·3 as + 6
  ],
  c14: [
    "5xy", // combined unlike terms
    "x^3 + y^2", // took x + x + x as x³
  ],
  c15: [
    "3y + 3", // forgot the lone y counts as 1y
    "4y + 7", // took − 2 as + 2
  ],
  c22: [
    "4a + 4b + 2", // took − a as + a
    "2a + 3b + 2", // took 2·b·3 as 5b (added instead of multiplying)
  ],
  c23: [
    "9x + y + 6", // dropped the minus in front of 2·x·2
    "x + y + 5", // added 3 and 2 instead of multiplying
  ],
  c24: [
    "2x + 3y + 8", // took − y as + y
    "4x + y + 8", // took − x as + x
  ],
  c27: [
    "a + 4b - c + 5", // took − b as + b
    "a + 2b + c + 5", // dropped the minus on c
  ],
  c25: [
    "3ab + 2a + 2b", // took − ab as + ab
    "ab + 4a + 2b", // took − a as + a
  ],
  c26: [
    "10x + y", // took − 5x as + 5x
    "7y", // took − 3y as + 3y
  ],
  c28: [
    "5xy + 3x", // took − 2xy as + 2xy
    "xy + 7x", // took − 2x as + 2x
  ],
  c29: [
    "5a + 2b + 8c", // took − 3c as + 3c
    "4a + 2b + 2c", // didn't count the lone a as 1a
  ],
  c30: [
    "7x^2 + 3x - 5", // took − 2x² as + 2x²
    "3x^2 + 3x + 5", // lost the minus on 5
  ],

  // distribute
  d1: [
    "ab + c", // multiplied only b by a
    "abc", // multiplied everything together
  ],
  d3: [
    "a(b + ac)", // took a out of the first term only
    "2a(b + c)", // took a out once for each term
  ],
  d4: [
    "3(x + 3y)", // took 3 out of the first term only
    "6(x + y)", // took 3 out once for each term
  ],
  d20: [
    "4a", // took 4 out and left nothing behind
    "4(a + 4)", // left the 4 inside the bracket
  ],
  d5: [
    "xy", // took x out and left nothing behind
    "x(y + x)", // took x out of the first term only
  ],
  d9: [
    "x(y + xz)", // took x out of the first term only
    "2x(y + z)", // took x out once for each term
  ],
  d19: [
    "-y + 3", // minus applied to y only
    "y - 3", // minus applied to 3 only
  ],
  d2: [
    "2x + 3", // multiplied only x by 2
    "2x + 5", // added 2 and 3 instead of multiplying
  ],
  d21: [
    "5a + 2", // multiplied only a by 5
    "5a + 7", // added 5 and 2 instead of multiplying
  ],
  d10: [
    "3x - 2", // multiplied only x by 3
    "3x + 6", // took 3·(−2) as + 6
  ],
  d6: [
    "-x - 4", // minus applied to x only
    "x + 4", // minus applied to 4 only
  ],
  d22: [
    "3y - 8", // multiplied only y by 3
    "3y + 24", // took − 12 as + 12
  ],
  d11: [
    "c", // multiplied only b by a
    "2ab + ac", // took − ab as + ab
  ],
  d12: [
    "b", // multiplied only a by 2
    "4a + 2b", // took − 2a as + 2a
  ],
  d13: [
    "2", // multiplied only y by x
    "2xy + 2x", // took − xy as + xy
  ],
  d14: [
    "-2x + 8", // minus applied to 2x only
    "2x + 2", // minus applied to 3 only
  ],
  d15: [
    "7x + 1", // multiplied only 2x by 3
    "6x + 3", // took 3·2x as 5x
  ],
  d8: [
    "x^2 - 2x + 2", // multiplied only the first term by x
    "2x", // took x·x as 2x
  ],
  d16: [
    "x^2 + x - 1", // multiplied only the first term by x
    "x^2 + 2x", // took x·(−1) as + x
  ],
  d23: [
    "0", // minus applied to a only
    "2a", // dropped the minus in front of the bracket
  ],
  d7: [
    "5x", // multiplied only the first term in each bracket
    "5x + 5", // lost the minus inside 3(x − 1)
  ],
  d17: [
    "5x - 4", // minus in front of the bracket applied to x only
    "5x + 1", // multiplied only the first term by 2
  ],
  d18: [
    "2x + 10", // took −2·3 as +6
    "2x - 5", // didn't multiply the 1 by 4
  ],
  d24: [
    "x^2 + 3x + 8", // multiplied only the first term of x(x + 2)
    "7x + 6", // took x·x as 2x
  ],
  d25: [
    "3a - b", // took −3·(−b) as −3b
    "3a + 4b", // multiplied only the first term of 2(3a + b)
  ],
  d26: [
    "x^2 - y^2", // took −y·(−y) as −y²
    "x^2 + 2xy - y^2", // treated −y(…) as +y(…)
  ],
  d27: [
    "y^2 + 10y", // took −y·4 as +4y
    "y^2 + y", // took 2y·3 as 5y (added instead of multiplying)
  ],
  d28: [
    "a^2 - 2b^2", // took −b·(−b) as −b²
    "a^2 + 2ab - 2b^2", // treated −b(…) as +b(…)
  ],
  d29: [
    "x^2 + 8x", // took −2x·1 as +2x
    "x^2 + 3x", // took 3x·2 as 5x (added instead of multiplying)
  ],
  d30: [
    "a^2 - 7a", // took −2a·(−2) as −4a
    "5a^2 - 7a", // treated −2a(…) as +2a(…)
  ],

  // brackets
  m1: [
    "x^2 + 3", // multiplied only the first term by x
    "5x", // took x·x as 2x
  ],
  m16: [
    "y^2 + 2", // multiplied only the first term by y
    "4y", // took y·y as 2y
  ],
  m2: [
    "x^2 + 2", // multiplied only firsts and lasts
    "x^2 + 3x + 3", // added 1 and 2 instead of multiplying
  ],
  m11: [
    "x^2 + 5", // multiplied only firsts and lasts
    "x^2 + 6x + 6", // added 5 and 1 instead of multiplying
  ],
  m17: [
    "2x^2 + 3", // multiplied only firsts and lasts
    "2x^2 + 3x + 3", // left out 2x·1
  ],
  m18: [
    "x^3 + 1", // multiplied only firsts and lasts
    "2x^2 + x + 1", // took x·x² as x²
  ],
  m3: [
    "x^2 - 4", // multiplied only firsts and lasts
    "x^2 + 5x - 4", // took x·(−1) as + x
  ],
  m19: [
    "2a^2 - 2", // multiplied only firsts and lasts
    "2a^2 - 5a - 2", // took 1·a as − a
  ],
  m4: [
    "2x^2 + 3", // multiplied only firsts and lasts
    "2x^2 + 6x + 3", // took 2x·3 as 5x
  ],
  m12: [
    "3x^2 - 2", // multiplied only firsts and lasts
    "3x^2 + 5x - 2", // took 3x·(−1) as + 3x
  ],
  m13: [
    "x^2 + 2", // took (+1)(−1) as + 1
    "x^2 + 2x", // took x·(−1) as + x
  ],
  m20: [
    "2", // multiplied only firsts and lasts
    "3a + 3", // added 1 and 2 instead of multiplying
  ],
  m21: [
    "a^2 + 6", // multiplied only firsts and lasts
    "a^2 + 5a + 5", // added 2 and 3 instead of multiplying
  ],
  m22: [
    "p^2 - 6", // multiplied only firsts and lasts
    "p^2 - p + 6", // took 2·(−3) as + 6
  ],
  m5: [
    "x^2 + 9", // took 3·(−3) as + 9
    "x^2 - 6x - 9", // took 3·x as − 3x
  ],
  m23: [
    "x^2 + 25", // took (−5)·5 as + 25
    "x^2 - 10", // took 5·5 as 10
  ],
  m6: [
    "x^2 + y^2", // took y·(−y) as + y²
    "x^2 - 2xy - y^2", // took y·x as − xy
  ],
  m24: [
    "a^2 - 2a - 3", // multiplied only firsts and lasts
    "a^2 + 2a - 3", // took a·(−1) as + a
  ],
  m25: [
    "2x^2 + 3x + 2", // multiplied only x² by 2
    "4x^2 + 12x + 8", // multiplied both brackets by 2
  ],
  m10: [
    "1", // squared each term
    "x + 1", // forgot to double the middle term
  ],
  m15: [
    "-1", // minus applied to x² only: x² − x² − 1
    "2x^2 - 1", // put the minus on both brackets
  ],
  m14: [
    "x^2 + 8", // multiplied only firsts and lasts
    "x^2 - 6x - 8", // took (−2)(−4) as −8
  ],
  m7: [
    "x^2 + 4", // squared each term
    "x^2 + 2x + 4", // forgot to double the middle term
  ],
  m26: [
    "4x^2 + 1", // squared each term
    "2x^2 + 4x + 1", // squared x but not the 2
  ],
  m9: [
    "a^2 + b^2", // squared each term
    "a^2 + ab + b^2", // forgot to double the middle term
  ],
  m27: [
    "x^3 - 1", // x times only the first term of x² − 1
    "x^3 + x", // took (+1)(−1) as +1
  ],
  m8: [
    "x^2 - 9", // squared each term
    "x^2 - 6x - 9", // took (−3)² as −9
  ],
  m28: [
    "x^2 - 2xy + y^2", // squared each term, then took 2xy away
    "x^2 - xy + y^2", // forgot to double the middle term
  ],
  m29: [
    "x^2 - y^2", // squared each term
    "x^2 - 2xy - y^2", // took (−y)² as −y²
  ],
  m30: [
    "x^2 + 4x + 4", // squared each term
    "x^2 + 8x + 4", // took the middle term −4x as +4x
  ],

  // balance
  b4: [
    "x = 6", // dropped the minus
    "x = -1/6", // divided −1 by 6 instead of 6 by −1
  ],
  b1: [
    "x = 13", // + 3 moved across = without flipping its sign
    "x = 10/3", // divided by 3 instead of taking it away
  ],
  b19: [
    "y = 17", // + 6 moved across = without flipping its sign
    "y = 11/6", // divided by 6 instead of taking it away
  ],
  b2: [
    "x = 6", // took 2 away instead of dividing
    "x = 16", // multiplied by 2 instead of dividing
  ],
  b3: [
    "x = -3", // − 5 moved across = without flipping its sign
    "x = 3", // did 5 − 2 instead of 2 + 5
  ],
  b5: [
    "x = 4/3", // divided by 3 instead of multiplying
    "x = 7", // added 3 instead of multiplying
  ],
  b20: [
    "a = 2/5", // divided by 5 instead of multiplying
    "a = 7", // added 5 instead of multiplying
  ],
  b9: [
    "x = 10", // + 7 moved across = without flipping its sign
    "x = 4", // did 7 − 3 instead of 3 − 7
  ],
  b10: [
    "x = 1/5", // divided 2 by 10 instead of 10 by 2
    "x = 8", // took 2 away instead of dividing
  ],
  b11: [
    "x = -5", // dropped the minus on x at the end
    "x = -9", // 7 moved across = without flipping its sign
  ],
  b21: [
    "x = 5/2", // + 1 moved across = without flipping its sign
    "x = 1", // took 2 away instead of dividing
  ],
  b22: [
    "x = 11", // + 3 moved across = without flipping its sign
    "x = 2", // divided only x by 2
  ],
  b6: [
    "x = 14/3", // + 1 moved across = without flipping its sign
    "x = 9", // took 3 away instead of dividing
  ],
  b7: [
    "x = 9/2", // multiplied only x by 2
    "x = 6", // + 2 moved across = without flipping its sign
  ],
  b12: [
    "x = 12", // + 1 moved across = without flipping its sign
    "x = 2", // divided by 2 instead of multiplying
  ],
  b13: [
    "x = -3", // − 2 moved across = without flipping its sign
    "x = 1", // divided by 3 instead of multiplying
  ],
  b14: [
    "x = 7/3", // multiplied only x by 3
    "x = 1", // − 3 moved across = without flipping its sign
  ],
  b23: [
    "x = 2", // minus in front of the bracket applied to x only
    "x = -8", // 6 moved across = without flipping its sign
  ],
  b15: [
    "x = 6", // forgot the lone x
    "x = 9", // took 3 away instead of dividing
  ],
  b16: [
    "x = 1", // − 2 moved across = without flipping its sign
    "x = -3", // combined − 2 and − 2x into − 4x
  ],
  b24: [
    "x = 19", // + 2 moved across = without flipping its sign
    "x = 5/3", // divided by 3 instead of multiplying
  ],
  b8: [
    "x = 2", // − 2 moved across = without flipping its sign
    "x = 1", // 3x moved across = without flipping its sign
  ],
  b17: [
    "x = 1", // − 4 moved across = without flipping its sign
    "x = 5/2", // x moved across = without flipping its sign
  ],
  b18: [
    "x = 2/5", // 4 moved across = without flipping its sign
    "x = 10", // 2x moved across = without flipping its sign
  ],
  b25: [
    "x = 4", // multiplied only x (not − 3) by 2
    "x = 5", // + 1 moved across = without flipping its sign
  ],
  b26: [
    "x = 3", // multiplied only 2x by 3
    "x = 1", // − 3 moved across = without flipping its sign
  ],
  b27: [
    "x = 15/2", // multiplied only 3 by 2
    "x = -1", // − 9 moved across = without flipping its sign
  ],
  b28: [
    "x = 4", // multiplied only the first term in each bracket
    "x = 14", // + 4 moved across = without flipping its sign
  ],
  b29: [
    "x = 3/2", // took −3·(−1) as −3
    "x = 2", // multiplied only x by 3
  ],
  b30: [
    "x = 3", // multiplied only x (not − 1) by 3
    "x = 1", // − 3 moved across = without flipping its sign
  ],

  // powers
  w10: [
    "6", // multiplied 2 by 3
    "9", // worked out 3² instead
  ],
  w6: [
    "x^3", // forgot the minus in the exponent
    "-x^3", // put the minus on the term instead of the exponent
  ],
  w1: [
    "x^6", // multiplied exponents instead of adding
    "x", // subtracted exponents instead of adding
  ],
  w11: [
    "x^4", // forgot that x is x¹
    "x^3", // subtracted exponents instead of adding
  ],
  w4: [
    "x^(5/2)", // divided exponents instead of subtracting
    "x^7", // added exponents instead of subtracting
  ],
  w18: [
    "y^(7/3)", // divided exponents instead of subtracting
    "y^10", // added exponents instead of subtracting
  ],
  w2: [
    "x^5", // added exponents instead of multiplying
    "x^8", // worked out 2³ for the exponent
  ],
  w19: [
    "a^7", // added exponents instead of multiplying
    "a^81", // worked out 3⁴ for the exponent
  ],
  w8: [
    "4", // took x⁰ as 0
    "x + 4", // took x⁰ as x
  ],
  w5: [
    "x^2", // subtracted exponents the wrong way round
    "x^8", // added exponents instead of subtracting
  ],
  w7: [
    "x^7", // dropped the minus on −2
    "x^-10", // multiplied exponents instead of adding
  ],
  w3: [
    "2x^3", // cubed x but not the 2
    "6x^3", // took 2³ as 2·3
  ],
  w20: [
    "3y^2", // squared y but not the 3
    "6y^2", // took 3² as 3·2
  ],
  w15: [
    "0", // took x⁰ as 0
    "x^-4", // multiplied exponents instead of adding
  ],
  w12: [
    "x^6", // forgot that x is x¹
    "x^8", // squared the lone x as well
  ],
  w13: [
    "5x^5", // added 3 and 2 instead of multiplying
    "6x^6", // multiplied exponents instead of adding
  ],
  w14: [
    "2x^6", // cubed x² but not the 2
    "8x^5", // added exponents instead of multiplying
  ],
  w21: [
    "x^3 + 3", // multiplied only the first term by x
    "x^2 + 3x", // took x·x² as x², forgetting x is x¹
  ],
  w16: [
    "x^5", // multiplied exponents 4 and 2 instead of adding
    "x^2", // divided exponents instead of subtracting
  ],
  w17: [
    "x^2·y^2", // took y²/y as y², forgetting y is y¹
    "x^2", // cancelled y with y² completely
  ],
  w9: [
    "x^5·y^2", // added exponents 2 and 3 instead of multiplying
    "x^6", // cubed x² but not y
  ],
  w22: [
    "x^6", // multiplied exponents 3 and 2 instead of adding
    "x^5 + x^3 - 1", // multiplied x³ into the first term only
  ],
  w23: [
    "-x^4", // forgot to square the 3
    "2x^4", // took 3² as 6
  ],
  w26: [
    "3x^6", // multiplied exponents 2 and 3 instead of adding
    "3x^5 + 6x^2 - 2", // multiplied 3x² into the first term only
  ],
  w24: [
    "x^3 + 1", // multiplied 2x into the first term only
    "-x^3 + 2x^2 + 2x", // took x·x² as x², forgetting x is x¹
  ],
  w25: [
    "x^2 + x", // multiplied x⁻¹ into the first term only
    "x^2", // took x⁰ as 0
  ],
  w27: [
    "x^2 - x", // took x²·x as x² (multiplied exponents)
    "x^3 - x^2 - x", // left out the x·x term
  ],
  w28: [
    "2a^2 - b^2", // took a²·a² as 2a²
    "a^4 - 2b", // took b·b as 2b
  ],
  w29: [
    "3x^4 - x", // forgot to square the 2
    "5x^4 - 1", // multiplied x into the first term only
  ],
  w30: [
    "x^4 + 9", // squared each term
    "x^4 + 3x^2 + 9", // forgot to double the middle term
  ],

  // factor
  g5: [
    "3x(x + 2)", // multiplied x and 3 instead of adding them
    "(x + 2)^2(x + 3)", // kept both copies of (x + 2)
  ],
  g10: [
    "(x + 1)(x + 2)", // lost the minus on the 2
    "-2x(x + 1)", // multiplied x and −2 instead of adding them
  ],
  g11: [
    "a(b + c + ad)", // took a out of the first two terms only
    "3a(b + c + d)", // took a out once for each term
  ],
  g18: [
    "3(x + 3y)", // took 3 out of the first term only
    "6(x + y)", // took 3 out once for each term
  ],
  g1: [
    "x(x^2 + 3)", // took x out of 3x only
    "2x(x + 3)", // took x out once for each term
  ],
  g2: [
    "2(x + 6)", // took 2 out of 2x only
    "2(x + 4)", // did 6 − 2 instead of 6 ÷ 2
  ],
  g3: [
    "x(x^2 + y)", // took x out of xy only
    "2x(x + y)", // took x out once for each term
  ],
  g12: [
    "5(x + 10)", // took 5 out of 5x only
    "5(x + 5)", // did 10 − 5 instead of 10 ÷ 5
  ],
  g13: [
    "4(x + 2)", // lost the minus on 8
    "4(x - 4)", // did 8 − 4 instead of 8 ÷ 4
  ],
  g14: [
    "x(x + 5)", // lost the minus on 5x
    "x(x^2 - 5)", // took x out of 5x only
  ],
  g20: [
    "x^3(1 + x)", // took out the higher power x³ instead of x²
    "x^2·x", // left nothing behind for the x² term, forgetting the 1
  ],
  g15: [
    "3(2x + 9)", // took 3 out of 6x only
    "3(2x + 6)", // did 9 − 3 instead of 9 ÷ 3
  ],
  g21: [
    "(x + 1)(x + 2)", // left nothing behind for (x + 1)², forgetting the + 1
    "2(x + 1)^3", // multiplied (x + 1)² and 2(x + 1) instead of adding
  ],
  g22: [
    "(x + 3)(x + 1)", // took 2x + 6 as (x + 3), losing the 2
    "2x(x + 3)", // multiplied x and 2 instead of adding them
  ],
  g23: [
    "(x - 2)(x - 5)", // lost the sign of + 5
    "5x(x - 2)", // multiplied x and 5 instead of adding them
  ],
  g4: [
    "3x(x^2 + 2)", // took 3x out of 6x only
    "3x(x + 3)", // did 6 − 3 instead of 6 ÷ 3
  ],
  g16: [
    "2x(x^2 + 2)", // took 2x out of 4x only
    "2x(x + 4)", // forgot to divide 4x by 2x
  ],
  g17: [
    "x(x + 4)", // left nothing behind for x + 4, forgetting the 1
    "(x + 4)(x - 1)", // lost the sign of the 1
  ],
  g24: [
    "(b + 2)(a + 1)", // took 3b + 6 as (b + 2), losing the 3
    "3a(b + 2)", // multiplied a and 3 instead of adding them
  ],
  g6: [
    "3x(x + 2)", // multiplied x and 3 instead of adding them
    "(x + 2)(x + 1)", // took 3x + 6 as (x + 2), losing the 3
  ],
  g7: [
    "(x - 3)(x - 2)", // lost the sign of + 2
    "2x(x - 3)", // multiplied x and 2 instead of adding them
  ],
  g9: [
    "(x - y)^2", // took out −y instead of +y
    "xy(x - y)", // multiplied x and y instead of adding them
  ],
  g25: [
    "(x + 3)(2x + 1)", // lost the minus on the 1
    "-2x(x + 3)", // multiplied 2x and −1 instead of adding them
  ],
  g8: [
    "xy(x + y)", // multiplied x and y instead of adding them
    "(x + y)(x - y)", // took out −y instead of +y
  ],
  g26: [
    "(x - 3)(x + 2)", // took out x instead of x²
    "2x^2(x - 3)", // multiplied x² and 2 instead of adding them
  ],
  g19: [
    "(x - 2)(2x - 3)", // lost the sign of + 3
    "6x(x - 2)", // multiplied 2x and 3 instead of adding them
  ],
  g27: [
    "(x + 2)(2x + 3)", // took out 2x instead of 2x²
    "6x^2(x + 2)", // multiplied 2x² and 3 instead of adding them
  ],
  g28: [
    "(2x + 1)(3x + 1)", // took the 2 out of 4x + 2 but left it behind
    "6x(2x + 1)", // multiplied 3x and 2 instead of adding them
  ],
  g29: [
    "(x + 3)(x + 2)", // dropped the common factor 2
    "8x(x + 3)", // multiplied 2x and 4 instead of adding them
  ],
  g30: [
    "(3x + 2)(x + 3)", // took out x instead of 2x
    "6x(3x + 2)", // multiplied 2x and 3 instead of adding them
  ],

  // formulas
  q1: [
    "a = Fm", // multiplied by m instead of dividing
    "a = F - m", // took m away instead of dividing
  ],
  q2: [
    "R = VI", // multiplied by I instead of dividing
    "R = I/V", // divided the wrong way round
  ],
  q3: [
    "t = ds", // multiplied by s instead of dividing
    "t = d - s", // took s away instead of dividing
  ],
  q4: [
    "x = y + c", // + c moved across = without flipping its sign
    "x = y/c", // divided by c instead of taking it away
  ],
  q5: [
    "b = a - c", // − c moved across = without flipping its sign
    "b = c - a", // swapped a and c when moving them
  ],
  q6: [
    "F = P/A", // divided by A instead of multiplying
    "F = A/P", // turned the fraction upside down
  ],
  q7: [
    "m = Ec^2", // multiplied by c² instead of dividing
    "m = E/(2c)", // took c² as 2c
  ],
  q8: [
    "t = (v + u)/a", // u moved across = without flipping its sign
    "t = v/a - u", // divided only v by a
  ],
  q9: [
    "x = (y + c)/m", // c moved across = without flipping its sign
    "x = y/m - c", // divided only y by m
  ],
  q10: [
    "a = (c + b)/2", // b moved across = without flipping its sign
    "a = c/2 - b", // divided only c by 2
  ],
  q11: [
    "h = A/(2b)", // divided by 2 instead of multiplying
    "h = 2Ab", // multiplied by b instead of dividing
  ],
  q12: [
    "v = at - u", // − u moved across = without flipping its sign
    "v = a/t + u", // divided by t instead of multiplying
  ],
  q13: [
    "a = (T - b)/2", // multiplied only a by 2
    "a = T/2 + b", // b moved across = without flipping its sign
  ],
  q14: [
    "v = I/m - u", // − u moved across = without flipping its sign
    "v = Im + u", // multiplied by m instead of dividing
  ],
  q15: [
    "R = P/V^2", // turned the fraction upside down
    "R = PV^2", // multiplied by V² instead of dividing
  ],
  q16: [
    "x = r/(pq)", // took p + q as pq
    "x = (p + q)/r", // turned the fraction upside down
  ],
  q17: [
    "P = A/(rt)", // took P out and forgot the 1 left behind
    "P = A/(1 - rt)", // lost the sign of Prt when taking P out
  ],
  q18: [
    "C = (5(F + 32))/9", // + 32 moved across = without flipping its sign
    "C = (9(F - 32))/5", // multiplied by 9/5 instead of 5/9
  ],
  q19: [
    "s = (v^2 + u^2)/(2a)", // u² moved across = without flipping its sign
    "s = 2a(v^2 - u^2)", // multiplied by 2a instead of dividing
  ],
  q20: [
    "x = b + a", // a moved across = without flipping its sign
    "x = (b - a)/3", // x moved across = without flipping its sign
  ],
  q21: [
    "x = z - y", // multiplied only x by 3
    "x = z + 3y", // 3y moved across = without flipping its sign
  ],
  q22: [
    "x = (d + b)/(a - c)", // b moved across = without flipping its sign
    "x = (d - b)/(a + c)", // cx moved across = without flipping its sign
  ],
  q23: [
    "x = 2a/3", // divided by 3 instead of multiplying
    "x = a", // − a moved across = without flipping its sign
  ],
  q24: [
    "x = 1/(k - 1)", // multiplied only x by k
    "x = k/(k + 1)", // x moved across = without flipping its sign
  ],
  q25: [
    "x = (b - 1)/(a - 2)", // multiplied only x by a
    "x = (b + a)/(a - 2)", // a moved across = without flipping its sign
  ],
  q26: [
    "x = 4a", // multiplied only x (not − a) by 2
    "x = 5a/3", // x moved across = without flipping its sign
  ],
  q27: [
    "x = 6b", // multiplied only x by 2
    "x = 3b", // − b moved across = without flipping its sign
  ],
  q28: [
    "x = c", // multiplied only x by 5
    "x = -2c", // − 5c moved across = without flipping its sign
  ],
  q29: [
    "x = 3a", // multiplied only x by 3
    "x = -a", // − 6a moved across = without flipping its sign
  ],
  q30: [
    "x = 2a", // multiplied only x by 5
    "x = 4a", // 2a moved across without flipping its sign
  ],

  // inequalities
  i3: [
    "x < -4", // didn't turn the sign round dividing by −1
    "x < 4", // dropped the minus on x
  ],
  i1: [
    "x < 13", // + 3 moved across without flipping its sign
    "x > 7", // turned the sign round for no reason
  ],
  i2: [
    "x ≥ 6", // took 2 away instead of dividing
    "x ≤ 4", // turned the sign round for no reason
  ],
  i4: [
    "x > -3", // − 5 moved across without flipping its sign
    "x < 7", // turned the sign round for no reason
  ],
  i17: [
    "y ≥ 8", // + 6 moved across without flipping its sign
    "y ≤ -4", // turned the sign round because the answer is negative
  ],
  i7: [
    "x ≥ 2/3", // divided by 3 instead of multiplying
    "x ≥ 5", // added 3 instead of multiplying
  ],
  i8: [
    "x > 7", // + 2 moved across without flipping its sign
    "x < 3", // didn't turn the sign round when swapping sides
  ],
  i18: [
    "n > 4", // didn't turn the sign round when swapping sides
    "n < 6", // took 2 away instead of dividing
  ],
  i11: [
    "x > -2", // didn't turn the sign round multiplying by −2
    "x < -1/2", // divided by 2 instead of multiplying
  ],
  i5: [
    "x ≤ -3", // didn't turn the sign round dividing by −2
    "x ≥ 3", // took 6 ÷ (−2) as 3
  ],
  i19: [
    "a < -4", // didn't turn the sign round dividing by −3
    "a > 4", // took 12 ÷ (−3) as 4
  ],
  i6: [
    "x > 2", // didn't turn the sign round dividing by −1
    "x < -4", // 3 moved across without flipping its sign
  ],
  i10: [
    "x ≥ -2", // didn't turn the sign round dividing by −1
    "x ≤ -4", // minus in front of the bracket applied to x only
  ],
  i12: [
    "x > 3", // didn't turn the sign round dividing by −2
    "x < -3", // 6 moved across without flipping its sign
  ],
  i13: [
    "x ≥ 1", // − 3 moved across without flipping its sign
    "x ≥ 6", // took 2 away instead of dividing
  ],
  i14: [
    "x ≤ 10", // + 1 moved across without flipping its sign
    "x ≤ 3/2", // divided by 2 instead of multiplying
  ],
  i20: [
    "k > 4", // − 1 moved across without flipping its sign
    "k > 3/4", // divided by 4 instead of multiplying
  ],
  i15: [
    "x < 11/3", // multiplied only x by 3
    "x < 1", // − 6 moved across without flipping its sign
  ],
  i21: [
    "y > 7/2", // multiplied only y by 2
    "y > 5", // + 2 moved across without flipping its sign
  ],
  i22: [
    "x ≤ 3", // didn't turn the sign round dividing by −3
    "x ≥ -11/3", // 10 moved across without flipping its sign
  ],
  i23: [
    "y > 1", // didn't turn the sign round dividing by −2
    "y < 2", // multiplied only 4 by 2
  ],
  i9: [
    "x < 4", // + 1 moved across without flipping its sign
    "x > 3", // didn't turn the sign round dividing by −2
  ],
  i16: [
    "x ≥ 3", // didn't turn the sign round dividing by −3
    "x ≤ 1/3", // − 4 moved across without flipping its sign
  ],
  i24: [
    "m < 9/2", // multiplied only m by 4
    "m < 7", // + 4 moved across without flipping its sign
  ],
  i25: [
    "a > 4", // didn't turn the sign round dividing by −1
    "a < 1", // multiplied only a in each bracket
  ],
  i26: [
    "x < 4", // multiplied only x by 3
    "x < 6", // + 3 moved across without flipping its sign
  ],
  i27: [
    "x ≤ 1", // didn't turn the sign round dividing by −3
    "x ≥ 7/3", // minus in front of the bracket applied to x only
  ],
  i28: [
    "n ≥ 1", // multiplied only n in each bracket
    "n ≥ -1/3", // − 5 moved across without flipping its sign
  ],
  i29: [
    "p > 2", // didn't turn the sign round dividing by −5
    "p < 8/3", // multiplied only the first term in each bracket
  ],
  i30: [
    "x > 2/3", // multiplied only the first term in each bracket
    "x > 6", // took − x as + x
  ],

  // fractions
  f1: [
    "3/8", // halved the top only
    "2/3", // took 2 off the top and the bottom instead of dividing
  ],
  f19: [
    "2/15", // divided the top only
    "1/2", // took 5 off the top and the bottom instead of dividing
  ],
  f2: [
    "3/10", // added tops and added bottoms
    "2/25", // multiplied instead of adding
  ],
  f6: [
    "x + 1", // cancelled the 2 on the bottom with the 2 in x + 2
    "x/2 + 2", // divided only x by 2
  ],
  f10: [
    "x/3", // added tops and added bottoms: (2x)/6
    "x^2/3", // took x + x as x²
  ],
  f11: [
    "3/(2x)", // added tops and added bottoms
    "3/x^2", // multiplied the bottoms
  ],
  f12: [
    "1/2", // added tops and added bottoms: 3/6
    "2/9", // multiplied instead of adding
  ],
  f13: [
    "3/16", // multiplied instead of subtracting
    "1", // added instead of subtracting
  ],
  f5: [
    "1", // put the 2 on top without changing it to thirds: 3/3
    "2/3", // multiplied instead of adding
  ],
  f20: [
    "1/3", // put the 2 on top without changing it to thirds
    "7/3", // added instead of subtracting
  ],
  f7: [
    "1/2", // divided 3 by 6 instead of 6 by 3
    "2x^2", // multiplied x by x instead of cancelling
  ],
  f9: [
    "x = 3/8", // divided by 2 instead of multiplying
    "x = 3/4", // multiplied the top and the bottom by 2
  ],
  f14: [
    "8/27", // turned 9/4 upside down as if dividing
    "11/7", // added tops and added bottoms
  ],
  f21: [
    "27/50", // turned 10/9 upside down as if dividing
    "13/14", // added tops and added bottoms
  ],
  f15: [
    "x + 4", // divided only 2x by 2
    "2x + 2", // divided only 4 by 2
  ],
  f22: [
    "2a", // cancelled term by term: a²/a + 3a/3
    "a^2", // cancelled 3a with a + 3
  ],
  f16: [
    "x = 3/8", // divided by 4 instead of multiplying
    "x = 12", // multiplied the top by 4 but forgot the bottom 2
  ],
  f8: [
    "3/8", // multiplied instead of dividing
    "3/2", // turned the first fraction upside down instead of the second
  ],
  f23: [
    "6/y", // cancelled term by term: 3y/y² + 3/y
    "3", // cancelled y along with y + 1
  ],
  f3: [
    "2/5", // added tops and added bottoms
    "1/3", // changed both to sixths without scaling the tops
  ],
  f4: [
    "2/9", // added tops and added bottoms
    "1/3", // changed 1/3 to sixths without scaling the top
  ],
  f17: [
    "1/3", // added tops and added bottoms
    "1/2", // changed 1/2 to quarters without scaling the top
  ],
  f18: [
    "(2x)/5", // added tops and added bottoms
    "x/3", // changed both to sixths without scaling the tops
  ],
  f24: [
    "1/12", // changed both to twelfths without scaling the tops
    "1/4", // scaled 2/3 by 3 instead of 4
  ],
  f25: [
    "n", // cancelled 2n − 8 with n − 4, losing the 2
    "2/n", // turned the fraction upside down
  ],
  f26: [
    "x = 9", // + 6 moved across = without flipping its sign
    "x = -7/3", // divided by 3 instead of multiplying
  ],
  f27: [
    "x = 5/2", // multiplied only the 1 by 2
    "x = 3/4", // divided by 2 instead of multiplying
  ],
  f29: [
    "k = 5/3", // cancelled k in the first term only
    "k = 7", // + 2 moved across = without flipping its sign
  ],
  f28: [
    "4/3", // multiplied only 1/2 by 2/3
    "7/6", // multiplied only the 1 by 2/3
  ],
  f30: [
    "x", // took (x + 1)² as x² + 1
    "x^2 + 2", // divided only 2x by x
  ],

  // simultaneous
  e1: [
    "x = 8; y = 3", // + 3 moved across = without flipping its sign
    "x = 5/3; y = 3", // divided by 3 instead of taking it away
  ],
  e2: [
    "x = 4; y = 10", // + 4 moved across = without flipping its sign
    "x = 4; y = 3/2", // divided by 4 instead of taking it away
  ],
  e3: [
    "x = 2; y = 16", // + 6 moved across = without flipping its sign
    "x = 2; y = 5", // took 3x as 3 + x
  ],
  e4: [
    "x = 6; y = 12", // took x + 2x as 2x
    "x = 9; y = 18", // took 3 away instead of dividing
  ],
  e5: [
    "x = 9/2; y = 9", // took x + 2x as 2x
    "x = 6; y = 12", // took 3 away instead of dividing
  ],
  e6: [
    "x = 6; y = 8", // + 2 moved across = without flipping its sign
    "x = 8; y = 10", // took x + x as x
  ],
  e7: [
    "x = 9; y = 9/2", // took 2y + y as 2y
    "x = 12; y = 6", // took 3 away instead of dividing
  ],
  e8: [
    "x = 5/3; y = 5", // took 2x + 3x as 6x
    "x = 5; y = 15", // took 5 away instead of dividing
  ],
  e9: [
    "x = 15/4; y = 15", // took x + 4x as 4x
    "x = 10; y = 40", // took 5 away instead of dividing
  ],
  e10: [
    "x = 8; y = 8/3", // took 3y + y as 3y
    "x = 12; y = 4", // took 4 away instead of dividing
  ],
  e11: [
    "x = 1; y = 4", // took 2x − x as 3x
    "x = 13; y = -8", // 5 moved across = without flipping its sign
  ],
  e12: [
    "x = -3; y = 16", // dropped the minus in −x = −3
    "x = 3; y = 16", // took −2·3 as + 6
  ],
  e13: [
    "x = 4; y = 5", // + 1 moved across = without flipping its sign
    "x = 6; y = 7", // took x + x as x
  ],
  e14: [
    "x = 3; y = 5", // took − 2 as + 2
    "x = 6; y = 4", // took 3 away instead of dividing
  ],
  e15: [
    "x = 10; y = 7", // + 3 moved across = without flipping its sign
    "x = 11; y = 8", // took y + y as y
  ],
  e16: [
    "x = 5; y = 11", // took 5 away instead of dividing
    "x = 2; y = 3", // put x = 2 into 2x + 1 as 2 + 1
  ],
  e17: [
    "x = 1; y = -1", // − 3 moved across = without flipping its sign
    "x = 6; y = 9", // took 3 away instead of dividing
  ],
  e18: [
    "x = 3; y = 4", // wrote x = y − 1: − y moved across = without flipping its sign
    "x = 5; y = 4", // + 1 moved across = without flipping its sign
  ],
  e19: [
    "x = 3; y = 7", // wrote x = y − 4: − y moved across = without flipping its sign
    "x = 11; y = 7", // + 4 moved across = without flipping its sign
  ],
  e20: [
    "a = 3; b = 6", // wrote a = b − 3: − b moved across = without flipping its sign
    "a = 9; b = 6", // + 3 moved across = without flipping its sign
  ],
  e21: [
    "x = 1; y = 6", // wrote y = 5 + x: x moved across = without flipping its sign
    "x = 1; y = 4", // took 2x − x as 3x
  ],
  e22: [
    "x = 3; y = 2", // wrote y = x − 1: − x moved across = without flipping its sign
    "x = 3; y = 4", // + 1 moved across = without flipping its sign
  ],
  e23: [
    "x = 4; y = 2", // wrote y = x − 2: − x moved across = without flipping its sign
    "x = 4; y = 6", // + 2 moved across = without flipping its sign
  ],
  e24: [
    "x = 1; y = 2", // x = 2y: divided by 2 instead of multiplying
    "x = 8; y = 4", // took 2y + 2y as 2y
  ],
  e25: [
    "x = -3; y = 8", // took −9 ÷ −3 as −3
    "x = 3; y = 8", // x moved across = without flipping its sign in x + y = 5
  ],
  e26: [
    "x = 4; y = 3", // took 2y + y as 2y
    "x = 1; y = 2", // wrote x = y − 1: − y moved across = without flipping its sign
  ],
  e27: [
    "x = 2; y = 3", // wrote x = y − 1: − y moved across = without flipping its sign
    "x = 4; y = 5", // wrote y = x + 1: x moved across = without flipping its sign
  ],
  e28: [
    "x = 6; y = 1", // minus in front of (7 − x) applied to 7 only
    "x = 3; y = 10", // x moved across = without flipping its sign in x + y = 7
  ],
  e29: [
    "x = 1; y = 2", // wrote x = y − 1: − y moved across = without flipping its sign
    "x = 3/2; y = 1/2", // 5y = 10 divided the wrong way round
  ],
  e30: [
    "x = 1; y = 1", // wrote x = 2y − 1: − 2y moved across = without flipping its sign
    "x = 25/7; y = 9/7", // multiplied only 2y (not 1) by 3
  ],

  // roots
  r2: [
    "x/2", // took the power ½ as halving
    "x^2", // took the power ½ as squaring
  ],
  r5: [
    "2√x", // added instead of multiplying
    "√(2x)", // added under one root
  ],
  r12: [
    "4", // multiplied under the root but forgot the root
    "2√2", // added instead of multiplying
  ],
  r16: [
    "2√6", // took √3 + √3 as √6
    "6", // multiplied 2√3 by √3 instead of adding
  ],
  r17: [
    "x + 1", // multiplied only the first term by √x
    "3√x", // took √x·√x as 2√x
  ],
  r1: [
    "9/2", // halved instead of taking the square root
    "81", // squared instead of taking the square root
  ],
  r13: [
    "8", // halved instead of taking the square root
    "256", // squared instead of taking the square root
  ],
  r8: [
    "x = √3", // took the root of 3 instead of squaring
    "x = 6", // doubled 3 instead of squaring it
  ],
  r9: [
    "x = √5", // took the root of 5 instead of squaring
    "x = 10", // doubled 5 instead of squaring it
  ],
  r7: [
    "x^4", // ignored the root
    "4√x", // multiplied by 4 instead of raising to the power 4
  ],
  r6: [
    "x^2", // ignored the root
    "2x", // took the root of x² as 2x
  ],
  r18: [
    "xy", // took the root of x² but dropped the root on y
    "x^2√y", // forgot the root of x²
  ],
  r10: [
    "x^4", // ignored the root
    "x", // took the root as undoing the whole power
  ],
  r3: [
    "4√x", // took √4 as 4
    "2x", // forgot the root of x
  ],
  r14: [
    "9√x", // took √9 as 9
    "3x", // forgot the root of x
  ],
  r19: [
    "x + 1", // took (+1)(−1) as + 1
    "x - 2√x - 1", // took 1·√x as − √x
  ],
  r20: [
    "x^2√x", // forgot the root of x²
    "(x^3)/2", // halved instead of taking the root
  ],
  r11: [
    "x = 18", // squared √x but not the 2
    "x = 16", // took 2 away instead of dividing
  ],
  r4: [
    "4√3", // took √4 as 4
    "2√6", // split 12 as 2·6 and took √2 as 2
  ],
  r15: [
    "4√2", // took √4 as 4
    "4", // halved instead of taking the square root
  ],
  r21: [
    "x + 1", // squared each term
    "x + √x + 1", // forgot to double the middle term
  ],
  r22: [
    "5√x", // took √4 as 4
    "√(5x)", // added under the root
  ],
  r23: [
    "x = 6", // forgot to square the 2
    "x = 8", // took away 4 instead of dividing
  ],
  r24: [
    "4x", // took √4 as 4
    "2x^2", // forgot the root of x²
  ],
  r25: [
    "x = 0", // divided by 2 instead of multiplying
    "x = 7", // doubled 4 instead of squaring it
  ],
  r26: [
    "√15", // added under the root
    "5√3", // took √12 as 4√3, forgetting the root of 4
  ],
  r27: [
    "x = 1/2", // doubled 3 instead of squaring it
    "x = 7", // + 5 moved across = without flipping its sign
  ],
  r28: [
    "x = 19", // squared √(x − 1) but not the 2
    "x = 8", // − 1 moved across = without flipping its sign
  ],
  r29: [
    "2x^2√2", // forgot the root of x²
    "4x√2", // took √8 as 4√2, forgetting the root of 4
  ],
  r30: [
    "x = 2/3", // took √(9x²) as 9x, forgetting the root of 9
    "x = 12", // squared only the right side
  ],

  // explog
  l2: [
    "ex", // took e^ln(x) as e times x
    "ln(x)", // cancelled the e but kept the ln
  ],
  l3: [
    "2ln(x)", // pulled the 2 out as if it were a power
    "ln(2)·ln(x)", // multiplied the logs instead of adding them
  ],
  l4: [
    "(ln(x))^3", // put the power on the ln
    "ln(3) + ln(x)", // took x³ as 3x
  ],
  l5: [
    "ln(a + b)", // added inside the ln
    "ln(a)·ln(b)", // multiplied the logs instead of adding them
  ],
  l19: [
    "ln(p - q)", // subtracted inside the ln
    "ln(p)/ln(q)", // divided the logs instead of subtracting them
  ],
  l8: [
    "x = e^5", // raised e to 5 instead of taking ln
    "x = 5/e", // divided by e instead of taking ln
  ],
  l20: [
    "t = 5/2", // divided by 2 instead of taking the log
    "t = log_5(2)", // swapped the base and the number
  ],
  l9: [
    "x = ln(2)", // took ln again instead of raising e
    "x = 2e", // multiplied by e instead of raising e
  ],
  l12: [
    "√(ln(x))", // put the root on the ln
    "2ln(x)", // took the root as the power 2
  ],
  l15: [
    "1", // took ln(1) as 1
    "e", // took ln(1) as e¹
  ],
  l6: [
    "ln(2xy)", // took 2ln(x) as ln(2x)
    "ln(x^2 + y)", // added inside the ln
  ],
  l10: [
    "x = ln(7/2)", // divided by 2 inside the ln
    "x = 2ln(7)", // multiplied by 2 instead of dividing
  ],
  l13: [
    "3", // divided the logs instead of subtracting them
    "ln(x^3 - x)", // subtracted inside the ln
  ],
  l16: [
    "ln(x^2 + x)", // added inside the ln
    "2ln(x)", // multiplied exponents 2 and 1 instead of adding
  ],
  l1: [
    "1", // cancelled ln and e^x down to 1
    "ln(x)", // cancelled the e but kept the ln
  ],
  l18: [
    "3e", // took ln(e³) as 3e, forgetting ln(e) = 1
    "1", // cancelled ln and e^3 down to 1
  ],
  l21: [
    "y = 6", // took 2³ as 2·3
    "y = 9", // worked out 3² instead
  ],
  l17: [
    "x = ln(5) + 1", // + 1 moved across = without flipping its sign
    "x = ln(4)", // took 1 away before taking ln
  ],
  l14: [
    "x/2", // cancelled e and ln, leaving ½ as halving
    "x^2", // took the power ½ as 2
  ],
  l7: [
    "4", // divided 8 by 2
    "256", // worked out 2⁸
  ],
  l22: [
    "a = 8/3", // forgot to take ln of 8
    "a = ln(8/3)", // divided by 3 inside the ln
  ],
  l23: [
    "x = e^2", // took ln(x/e) as ln(x)/ln(e)
    "x = 2e", // dropped the ln without raising e
  ],
  l24: [
    "x = 36", // took 2³ as 2·3
    "x = 16", // doubled 8 instead of squaring it
  ],
  l11: [
    "x = 9", // took ln(x) + ln(3) as ln(x + 3)
    "x = 36", // multiplied by 3 instead of dividing
  ],
  l25: [
    "n = 1", // took log_3(9) as 9/3
    "n = 1/3", // forgot to raise 3 to the power 3
  ],
  l26: [
    "x = 9", // divided 27 by 3 instead of taking the log
    "x = log_6(54)", // took 2·3^x as 6^x
  ],
  l27: [
    "x = 4", // added exponents x and 2 instead of multiplying
    "x = 5", // halved 64 instead of taking its square root
  ],
  l28: [
    "y = 5/3", // multiplied exponents y and 3 instead of adding
    "y = 8", // + 3 moved across = without flipping its sign
  ],
  l29: [
    "x = 1", // − 1 moved across = without flipping its sign
    "x = 5/2", // took 8 as 2^4 (8 ÷ 2)
  ],
  l30: [
    "x = 4", // forgot the square: 2^x = 16
    "x = 3", // halved 16 instead of taking its square root
  ],
};
