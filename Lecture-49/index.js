
let src = {

    first_name : "Joy",
    weight : 80,
    height : 1.75

};

// console.log(obj);

// obj.color = "White";

// console.log(obj);


// spread cloning

// let dest = {...src}; // //obj cloning

// src.age = 90; // update cloning

// console.log("src : ", src);

// console.log("dest : ", dest);


// assgin cloning
// let dest = Object.assign({}, src);

// src.age = 90; // update cloning
// console.log("src : ", src);
// console.log("dest : ", dest);


let src1 = {

    last_name : "rajbongshi",
    degree : "BSc in CSE"

};

let dest = Object.assign({}, src, src1);

console.log("src : ", src);
console.log("src : ", src1);
console.log("dest : ", dest);