import { Keyboard } from '@capacitor/keyboard';

let activeElement = null;

const isPaneDescendant = (el) => {
    const pane = document.querySelector('.cupertino-pane')
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
    Keyboard.addListener('keyboardWillShow', info => {
        footer = document.querySelector('.q-footer');
        if (footer) {
            footer.style.transition = 'opacity .4s';
            footer.style.opacity = '0'
        }

        activeElement = document.activeElement
        if (isPaneDescendant(activeElement)) return
        document.activeElement.scrollIntoView({behavior: 'smooth'})
    });
    Keyboard.addListener('keyboardWillHide', () => {
        if (footer) {
            footer.style.opacity = 'unset'
            console.log(footer.style.display)
        }

        if (isPaneDescendant(activeElement)) return
        (activeElement || document.activeElement).scrollIntoView({behavior: 'smooth'})
    });
}
