function reverseString(str) {
    var newString = "";
    for (var i = str.length - 1; i >= 0; i--) {
        if(str[i] !== '1') {
            newString += str[i];        
        }
    }
    let last = str.charAt(str.length - 1)
    return newString+last;
}
console.log(reverseString('NEGIE1'));