import {Keyboard} from '@capacitor/keyboard';

let activeElement = null;

const elementInViewport = (keyboardHeight) => (el) => {
    if (el === null) return false;

    let top = el.offsetTop;
    let left = el.offsetLeft;
    let width = el.offsetWidth;
    let height = el.offsetHeight;

    while (el.offsetParent) {
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

const isPaneDescendant = (el) => {
    const pane = document.querySelector('.cupertino-pane')
    if (el === null) return false;
    let node = el.parentNode;
    while (node != null) {
        if (node == pane) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

export default () => {
    let footer = null;
    let checkElementInViewport = null
    let defaultPadding = 0

    Keyboard.addListener('keyboardWillShow', info => {
        checkElementInViewport = elementInViewport(info.keyboardHeight)
        footer = document.querySelector('.q-footer');
        if (footer) {
            footer.style.transition = 'opacity .4s';
            footer.style.opacity = '0'
        }

        if (document.activeElement)
            activeElement = document.activeElement

        const isPane = isPaneDescendant(activeElement);


        const pageContainer = document.querySelector('#q-app');
        if (pageContainer && !isPane) {
            defaultPadding = pageContainer.style.paddingBottom
            pageContainer.style.paddingBottom = info.keyboardHeight + 'px';
        }

        if (document.activeElement) {
            activeElement = document.activeElement

            if (isPane) return
            if (!checkElementInViewport(activeElement)) {
                document.activeElement.scrollIntoView({behavior: 'smooth'})
            }
        }
    });
    Keyboard.addListener('keyboardWillHide', () => {
        if (footer) {
            footer.style.opacity = 'unset'
            console.log(footer.style.display)
        }

        const pageContainer = document.querySelector('#q-app');
        if (pageContainer) {
            pageContainer.style.paddingBottom = '0px';
        }

        if (activeElement) {
            if (isPaneDescendant(activeElement)) return
            if (!checkElementInViewport(activeElement)) {
                (activeElement || document.activeElement).scrollIntoView({behavior: 'smooth'})
            }
        }
    });
}
