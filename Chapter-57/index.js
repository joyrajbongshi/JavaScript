
async function getData() {

    setTimeout(function() {

        console.log("I am inside set timeout block");

    }, 3000);
    
}

let output = getData();

// await 