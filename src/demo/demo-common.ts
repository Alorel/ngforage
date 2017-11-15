import 'reflect-metadata';
import 'zone.js';

const style = document.createElement('style');
// tslint:disable-next-line:no-var-requires
style.innerHTML = require('./demo.scss');
document.body.appendChild(style);
