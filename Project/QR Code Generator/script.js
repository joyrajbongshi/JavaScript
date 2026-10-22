let imgBox = document.getElementById("imgbox");
let qrImage = document.getElementById("qrImage");
let qrText = document.getElementById("qrText");

function generateQR() {
    if (qrText.value.trim() === "") {
        alert("Please enter some text or a URL");
        return;
    }

    qrImage.src = "";

    let data = encodeURIComponent(qrText.value.trim());

    qrImage.onload = function () {
        imgBox.classList.add("show-img");
    };

    qrImage.onerror = function () {
        imgBox.classList.remove("show-img");
        alert("Failed to generate QR code. Please check your internet connection.");
    };

    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
}
