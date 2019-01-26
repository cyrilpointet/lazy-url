
document.addEventListener("DOMContentLoaded", function(event) {
    setTimeout(()=>{
        let toto = document.createElement('img');
        toto.setAttribute('lazy-url', 'https://picsum.photos/400/420/?random');
        toto.classList.add("myImg");
        document.getElementById('test').appendChild(toto);
    }, 10000);
});
