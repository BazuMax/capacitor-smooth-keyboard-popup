import smoothscroll from 'smoothscroll-polyfill';
import { Keyboard } from '@capacitor/keyboard';

let activeElement = null;


const elementInViewport = (keyboardHeight) => (el) => {
    let top = el.offsetTop;
    let left = el.offsetLeft;
    let width = el.offsetWidth;
    let height = el.offsetHeight;

    while(el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    return (
        top >= window.pageYOffset &&
        left >= window.pageXOffset &&
        (top + height) <= (window.pageYOffset + window.innerHeight - keyboardHeight) &&
        (left + width) <= (window.pageXOffset + window.innerWidth)
    );
}

export default () => {
    smoothscroll.polyfill()
    let checkElementInViewport = null
    let defaultPadding = 0

    Keyboard.addListener('keyboardWillShow', info => {
        checkElementInViewport = elementInViewport(info.keyboardHeight)
        const pageContainer = document.querySelector('.q-page-container');
        if (pageContainer) {
            defaultPadding = pageContainer.style.paddingBottom
            pageContainer.style.paddingBottom = info.keyboardHeight + 'px';
        }
        activeElement = document.activeElement
        if (!checkElementInViewport(activeElement)) {
            document.activeElement.scrollIntoView({behavior: 'smooth'})
        }
    });
    Keyboard.addListener('keyboardWillHide', () => {
        const pageContainer = document.querySelector('.q-page-container');
        if (pageContainer) {
            pageContainer.style.paddingBottom = defaultPadding || '0px';
        }

        if (!checkElementInViewport(activeElement)) {
            (activeElement || document.activeElement).scrollIntoView({behavior: 'smooth'})
        }
    });
}
