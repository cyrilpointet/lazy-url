require('intersection-observer');

if (NodeList.prototype.forEach === undefined) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

class LazyUrl {
    constructor(attibuteNameImg, attibuteNameColor) {
        this.attibuteNameImg = typeof(attibuteNameImg) === 'string' ? attibuteNameImg:'lazy-url';
        this.attibuteNameColor = typeof(attibuteNameColor) === 'string' ? attibuteNameColor:'lazy-color';
        this.observer = new IntersectionObserver((entries) => {
            this.intersectionEvent(entries)
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
        console.log(this.attibuteNameImg);
        this.start();
    }

    intersectionEvent(entries) {
        entries.forEach(entry => {
            let element = entry.target;
            if (entry.intersectionRatio > 0 && element.getAttribute('src') === null) {
                element.setAttribute('src', element.getAttribute(this.attibuteNameImg));
                element.removeAttribute(this.attibuteNameImg);
                this.observer.unobserve(element);
            }
            if (entry.intersectionRatio > 0 && element.getAttribute('src') !== null) {
                element.removeAttribute(this.attibuteNameImg);
                this.observer.unobserve(element);
            }
        })
    }

    domChanges(domChanges) {
        let that = this;
        domChanges.forEach(function (mutation) {
            mutation.addedNodes.forEach(element => {
                if (element.nodeType === 1 && element.getAttribute(that.attibuteNameImg)) {
                    that.start();
                }
            })
        });
    }

    start() {
        this.observer.disconnect();
        document.querySelectorAll(`[${this.attibuteNameImg}]`).forEach((el) => {
            if (typeof (el.getAttribute('src')) !== 'string') {
                if (el.getAttribute(this.attibuteNameColor)) {
                    el.style.backgroundColor = el.getAttribute(this.attibuteNameColor);
                }
                this.observer.observe(el);
            }
        });
    }

    stop() {
        this.observer.disconnect();
    }
    refresh() {
        this.observer.start();
    }
}

lazyUrl = new LazyUrl();
