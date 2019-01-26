require('intersection-observer');

if (NodeList.prototype.forEach === undefined) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

class LazyUrl {
    constructor() {
        this.observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                let element = entry.target;
                if (entry.intersectionRatio > 0 && element.getAttribute('src') === null) {
                    element.setAttribute('src', element.getAttribute('lazy-url'));
                    element.removeAttribute('lazy-url');
                    this.unobserve(element);
                }
                if (entry.intersectionRatio > 0 && element.getAttribute('src') !== null) {
                    element.removeAttribute('lazy-url');
                    this.unobserve(element);
                }
            })
        }, {
            threshold: [0.01]
        });
        this.bodyObserver = new MutationObserver((domChanges) => {
            this.domChanges(domChanges)
        });
        this.bodyObserver.observe(document.body, {
            subtree: true,
            childList: true
        });
        this.start();
    }

    domChanges(domChanges) {
        let that = this;
        domChanges.forEach(function (mutation) {
            mutation.addedNodes.forEach(element => {
                if (element.nodeType === 1 && element.getAttribute('lazy-url')) {
                    that.start();
                }
            })
        });
    }

    start() {
        this.observer.disconnect();
        document.querySelectorAll('[lazy-url]').forEach((el) => {
            if (typeof (el.getAttribute('src')) !== 'string') {
                if (el.getAttribute('lazy-color')) {
                    el.style.backgroundColor = el.getAttribute('lazy-color');
                }
                this.observer.observe(el);
            }
        });
        console.log('coucou !!!');
    }

    stop() {
        this.observer.disconnect();
    }
    refresh() {
        this.observer.start();
    }
}

lazyUrl = new LazyUrl();
