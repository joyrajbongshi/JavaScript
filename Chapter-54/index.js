

// //code 1 
 
// const t1 = performance.now();

// for (let i = 1; i <= 100; i++) {
//     let para = document.createElement('p');
//     para.textContent = "Text is Para " +  i;
        // 100 reflow and 100 repraint for this below line
//     document.body.appendChild(para);
// }

// const t2 = performance.now();


// console.log("total time by code 1 : " + (t2 - t1));


// // code2

// const t3 = performance.now();

// let mydiv = document.createElement('div');

// for (let i = 1; i <= 100; i++) {
//     let para = document.createElement('p');
//     para.textContent = "This is Para " + i;
        // 1reflow and 1 repraint for this below line 
//     mydiv.appendChild(para);
// }

// document.body.appendChild(mydiv);

// const t4  = performance.now();

// console.log("total time by code 2 : " + (t4 - t3));





// Best Code

let fragment = document.createDocumentFragment();

for (let i = 1; i <= 100; i++) {
    let para = document.createElement('p');
    para.textContent = "This is Para " + i;
    // no reflow and no repraint for this below line 
    fragment.appendChild(para);
}

document.body.appendChild(fragment);