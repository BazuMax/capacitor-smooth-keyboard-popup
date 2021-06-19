import smoothscroll from 'smoothscroll-polyfill';
import commonLogic from './common-logic'

export default (context) => {
    smoothscroll.polyfill();
    commonLogic(context)
}
