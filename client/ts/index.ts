function sum(c:number, d:number):number{
    return c+d;
}


const hello:string = "hi";
console.log(sum(2,3), hello)


class People {
    constructor() {
      this.test();
      this.test();
      this.test();
    }
  
    test() {
      const a: number = 2 ** 2;
  
      console.log(a);
    }
  }


console.log(new People())

export {sum}
