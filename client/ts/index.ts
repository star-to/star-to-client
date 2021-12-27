function sum(a: number, b: number): number {
  return a + b;
}

const hello = "hi";
console.log(sum(2, 3), hello);

class People {
  constructor() {
    this.test();
  }

  test() {
    const a: number = 2 ** 2;

    console.log("제곱근", a);
  }
}

console.log(new People());
