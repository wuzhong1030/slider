import Slider from './js/slider'
import './style/style.css'

var list = [{
    path: './static/1.png'
}, {
    path: './static/2.jpg'
}, {
    path: './static/3.jpg'
}, {
    path: './static/4.gif'
}, {
    path: './static/5.jpg'
}, {
    path: './static/6.jpg'
}, {
    path: './static/7.jpg'
}];

new Slider({
    'dom': document.getElementById('canvas'),
    'list': list
})