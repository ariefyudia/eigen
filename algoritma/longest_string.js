const sentence = "Saya sangat senang mengerjakan soal algoritma";

function longest(sentence) {
    const data = sentence.split(" ");
    return data.sort(function (a, b) {
        return b.length - a.length;
    })[0];
}
console.log(longest(sentence));