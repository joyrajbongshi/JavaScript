
// fpara = addEventListener('click', function() {

//     let fpara = document.getElementById('fpara');
//     fpara.textContent = "Hello Joy";

// });



// // good practice
// function changeText () {

//     let fpara = document.getElementById('fpara');
//     fpara.textContent = "Hello Joy";

// }

// fpara = addEventListener('click', changeText);
// // fpara = removeEventListenerEventListener('click', changeText);

let anchorElement = document.getElementById('fanchor');

anchorElement.addEventListener('click', function(event) {
    
    event.preventDefault();
    anchorElement.textContent = "click done";


});