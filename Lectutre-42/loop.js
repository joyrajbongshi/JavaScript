
// for (let i = 1; i <= 5; i++) {
//     console.log(i, " ");
// }
// console.log();


const cars = ["BMW", "Volvo", "Saab", "Ford"];
let len = cars.length;

let i = 0;

let text = "";
for (; i < len; ) {
  text += cars[i] + " ";
  i++;
}
console.log(text);