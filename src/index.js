require('intersection-observer');

if (NodeList.prototype.forEach === undefined) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

let observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        let element = entry.target;
        if (entry.intersectionRatio > 0 && element.getAttribute('src') === null) {
            element.setAttribute('src', element.getAttribute('lazy-url'));
            observer.unobserve(element);
        }
        if (entry.intersectionRatio > 0 && element.getAttribute('src') !== null) {
            observer.unobserve(element);
        }
    })
}, {
    threshold: [0.01]
});

let lazyElements = document.querySelectorAll('[lazy-url]');
lazyElements.forEach((el) => {
    if (typeof(el.getAttribute('src')) !== 'string') {
        if (el.getAttribute('lazy-color')) {
            el.style.backgroundColor = el.getAttribute('lazy-color');
        }
        observer.observe(el);
    }
})
