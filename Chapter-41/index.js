

// let a = 10;
// let b = 20;
// ++a;
// console.log(a + b);

// //Exponentiation
// let x = 5;
// let z = Math.pow(x, 2);
// console.log(z);

// // ____Operator Precedence
// let x = 100 + 50 * 3;
// console.log(x);
// let y = (100 + 50) * 3;
// console.log(y);


// // ______Addition Assignment 
// let x = 10;
// x += 5;
// console.log(x);


// // _____Exponentition Assignment
// let x = 10;
// x **= 5;
// console.log(x);


// // _____Remainder Assginment
// let x = 19;
// x %= 10;
// console.log(x);



// // ____Addition Assignment 
// let text = "Hello";
// text += " World";
// console.log(text);



// //____Logical AND Assginment 
// let a = true;
// let b = a &&= 10;
// console.log(b);
// let x = undefined;
// let y = x &&= 10;
// console.log(y);
// let m = null;
// let n = m &&= 10;
// console.log(n);



//_____Nullish Coalescing 
// let x = 0;
// x ??= 10;
// console.log(x);
// let a = 7;
// let b = 5;
// a ??= 10;
// console.log(a);



//____________Condition Operator_________

let age = 21;
if (age >= 18) {
    console.log("Can you Vote");
}
else {
    console.log("Cann't you vote");
}

let statuts = (age >= 18) ? 'Can you vote' : 'Cannot you vote';
console.log(statuts);