

// let firstPromise = new Promise ((resolve, reject) => {

//     // console.log("Joy");
//     // // resolve(1001);
//     // reject(new Error ("Internal Server Error"));

//     function sayName() {

//         console.log("My Name is Joy Rajbongshi");

//     }

//     setTimeout(sayName, 10000);


// });



// // asynchronous code
// function sayName() {

//     console.log("My Name is Joy Rajbongshi");

// }

// setTimeout(sayName, 10000);



let promise1 = new Promise ((resolve, reject) => {

    let success = false;
    if (success) {
        resolve('Promise Fulfilled');
    }
    else {
        reject('Promise Rejected');
    }
    
} );


promise1.then ((message) => {

    console.log("Then message is : " + message);
    
}).catch((error) => {
    console.log("Error: " + error);
})