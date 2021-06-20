import { Keyboard } from '@capacitor/keyboard';

let activeElement = null;

export default () => {
    let footer = null;
    Keyboard.addListener('keyboardWillShow', info => {
        footer = document.querySelector('.q-footer');
        footer.style.transition = 'opacity .4s';
        footer.style.opacity = '0'
        console.log(footer.style.display)
        activeElement = document.activeElement
        document.activeElement.scrollIntoView({behavior: 'smooth'})
    });
    Keyboard.addListener('keyboardWillHide', () => {
        if (footer) {
            footer.style.opacity = 'unset'
            console.log(footer.style.display)
        }

        (activeElement || document.activeElement).scrollIntoView({behavior: 'smooth'})
    });
}
