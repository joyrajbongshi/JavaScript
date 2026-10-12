
class Human{

    name  = "Joy"; // public
    weight = 50; 
    #height = 5.9; // private

    walking() {
        console.log("I am walking", this.#height);
    }
    running() {
        console.log("I am running");
    }

};

let  obj = new Human();
console.log(obj.weight);

obj.walking();