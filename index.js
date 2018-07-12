import Slider from './js/slider'

var list = [{
    path: './img/1.jpg'
}, {
    path: './img/2.jpg'
}, {
    path: './img/3.jpg'
}, {
    path: './img/4.gif'
}, {
    path: './img/5.jpg'
}, {
    path: './img/6.jpg'
}, {
    path: './img/7.jpg'
}];

new Slider({
    'dom': document.getElementById('canvas'),
    'list': list
})