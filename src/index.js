require('intersection-observer');

class Toto {
    constructor(options = {}) {
        this.attibuteNameSrc = options.attibuteNameSrc && typeof(options.attibuteNameSrc) === 'string' ? options.attibuteNameSrc : 'lazy-url';
        this.attibuteNameBGImage = options.attibuteNameBGImage && typeof(options.attibuteNameBGImage) === 'string' ? options.attibuteNameBGImage : 'lazy-background';
        this.attibuteNameColor = options.attibuteNameColor && typeof(options.attibuteNameColor) === 'string' ? options.attibuteNameColor : 'lazy-color';

        this.observerSrc = new IntersectionObserver((entries) => {
            this.intersectionEventSrc(entries)
        }, {
            threshold: [0.01]
        });

        this.observerBGImage = new IntersectionObserver((entries) => {
            this.intersectionEventBGImage(entries)
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

    intersectionEventSrc(entries) {
        [...entries].forEach(entry => {
            let element = entry.target;
            if (entry.intersectionRatio > 0 && element.getAttribute(this.attibuteNameSrc) !== null && element.getAttribute('src') === null) {
                element.setAttribute('src', element.getAttribute(this.attibuteNameSrc));
                element.removeAttribute(this.attibuteNameSrc);
                this.observerSrc.unobserve(element);
            }
            else  if (entry.intersectionRatio > 0 && element.getAttribute('src') !== null) {
                element.removeAttribute(this.attibuteNameSrc);
                this.observerSrc.unobserve(element);
            }
        })
    }

    intersectionEventBGImage(entries) {
        [...entries].forEach(entry => {
            let element = entry.target;
            if (entry.intersectionRatio > 0 && element.getAttribute(this.attibuteNameBGImage) !== null) {
                element.style.backgroundImage = 'url(' + element.getAttribute(this.attibuteNameBGImage) + ')';
                element.removeAttribute(this.attibuteNameBGImage);
                this.observerBGImage.unobserve(element);
            }
            else if (entry.intersectionRatio > 0 && element.getAttribute(this.attibuteNameBGImage) === null) {
                element.removeAttribute(this.attibuteNameSrc);
                this.observerBGImage.unobserve(element);
            }
        })
    }

    domChanges(domChanges) {
        let that = this;
        [...domChanges].forEach(function (mutation) {
            [...mutation.addedNodes].forEach(element => {
                if (element.nodeType === 1 && (element.getAttribute(that.attibuteNameSrc) || element.getAttribute(that.attibuteNameBGImage))) {
                    that.start();
                }
            })
        });
    }

    start() {
        this.observerSrc.disconnect();
        this.observerBGImage.disconnect();
        [...document.querySelectorAll(`[${this.attibuteNameSrc}]`)].forEach((el) => {
            if (typeof (el.getAttribute('src')) !== 'string') {
                if (el.getAttribute(this.attibuteNameColor)) {
                    el.style.backgroundColor = el.getAttribute(this.attibuteNameColor);
                    el.removeAttribute(this.attibuteNameColor);
                }
                this.observerSrc.observe(el);
            }
        });
        [...document.querySelectorAll(`[${this.attibuteNameBGImage}]`)].forEach((el) => {
            if (typeof (el.getAttribute('src')) !== 'string') {
                if (el.getAttribute(this.attibuteNameBGImage)) {
                    el.style.backgroundColor = el.getAttribute(this.attibuteNameColor);
                    el.removeAttribute(this.attibuteNameColor);
                }
                this.observerBGImage.observe(el);
            }
        });
    }

    stop() {
        this.observerSrc.disconnect();
        this.observerBGImage.disconnect();
    }
    refresh() {
        this.observerSrc.start();
    }
}

let toto = new Toto();
