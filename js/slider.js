function Slide(opts) {
    this.wrap = opts.dom;
    this.list = opts.list;

    this.init();
    this.renderDOM();
    this.renderTitle(this.list.length)
    this.bindDOM();
}

Slide.prototype.init = function () {
    this.radio = window.innerHeight / window.innerWidth;
    this.scaleW = window.innerWidth;
    this.index = 0;
}

Slide.prototype.loadImage = function (url) {
    return new Promise(function (reslove, reject) {
        var image = new Image();
        image.onload = function () {
            reslove(image)
        }
        image.src = url
        image.onerror = reject
    })
}

Slide.prototype.renderDOM = function () {
    var wrap = this.wrap,
        data = this.list,
        self = this,
        images = [],
        promsies = [];
    self.outer = document.createElement('ul');
    data.forEach(function (item) {
        var p = self.loadImage(item.path).then(function (image) {
            images.push(image)
        }).catch(function (err) {
            console.log(err)
        })
        promsies.push(p);
    })
    Promise.all(promsies).then(function () {
        images.forEach(function (item, index) {
            var li = document.createElement('li');
            li.style.width = window.innerWidth + 'px';
            li.style.webkitTransform = 'translate3d(' + index * self.scaleW + 'px, 0, 0)';
            if (item.height / item.width > self.radio) {
                li.innerHTML = '<img height="' + window.innerHeight + '" src="' + item.src +
                    '">';
            } else {
                li.innerHTML = '<img width="' + window.innerWidth + '" src="' + item.src +
                    '">';
            }
            self.outer.appendChild(li);
        })
        self.outer.style.cssText = 'width: ' + self.scaleW + 'px';
        wrap.style.height = window.innerHeight + 'px';
        wrap.appendChild(self.outer);
    })
}

Slide.prototype.renderTitle = function (total) {
    var titleWrap = document.createElement("div"),
        currentSpan = document.createElement("span"),
        totalSpan = document.createElement("span"),
        split = document.createElement("span");
    titleWrap.className = "title";
    currentSpan.setAttribute("id", "current");
    totalSpan.setAttribute("id", "total");

    currentSpan.innerText = 1;
    totalSpan.innerText = total;
    split.innerText = ' / '

    titleWrap.appendChild(currentSpan)
    titleWrap.appendChild(split)
    titleWrap.appendChild(totalSpan)

    this.wrap.appendChild(titleWrap);
}

Slide.prototype.goIndex = function (n) {
    var index = this.index,
        lis = this.outer.getElementsByTagName("li"),
        len = list.length,
        cidx;

    if (typeof n == "number") {
        cidx = index;
    } else if (typeof n == "string") {
        cidx = index + n * 1;
    }

    if (cidx > len - 1) {
        cidx = len - 1;
    } else if (cidx < 0) {
        cidx = 0;
    }

    this.index = cidx;
    lis[cidx].style.webkitTransition = '-webkit-transform 0.2s ease-out';
    lis[cidx - 1] && (lis[cidx - 1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
    lis[cidx + 1] && (lis[cidx + 1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

    lis[cidx].style.webkitTransform = 'translate3d(0,0,0)';
    lis[cidx - 1] && (lis[cidx - 1].style.webkitTransform = 'translate3d(-' + this.scaleW + 'px,0,0)');
    lis[cidx + 1] && (lis[cidx + 1].style.webkitTransform = 'translate3d(' + this.scaleW + 'px,0,0)');

    document.getElementById("current").innerText = cidx + 1;
}

Slide.prototype.bindDOM = function () {
    var self = this,
        outer = self.outer,
        len = self.list.legth,
        scaleW = self.scaleW;

    var startHandler = function (evt) {
        self.startTime = new Date() * 1;
        self.startX = evt.touches[0].pageX;
        self.offset = 0;

        var target = evt.target;
        while (target.nodeName != "LI" && target.nodeName != "BODY") {
            target = target.parentNode;
        }
        self.target = target;
    }
    var moveHandler = function (evt) {
        evt.preventDefault();
        self.offsetX = evt.targetTouches[0].pageX - self.startX;
        var lis = outer.getElementsByTagName('li');
        var i = self.index - 1;
        var m = i + 3;
        for (i; i < m; i++) {
            lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
            lis[i] && (lis[i].style.webkitTransform = 'translate3d(' + ((i - self.index) * self.scaleW +
                self.offsetX) + 'px, 0, 0)')
        }
    }
    var endHandler = function (evt) {
        evt.preventDefault();
        var boundary = scaleW / 6,
            endTime = new Date() * 1,
            lis = outer.getElementsByTagName('li');

        if (endTime - self.startTime > 300) {
            if (self.offsetX >= boundary) {
                self.goIndex("-1")
            } else if (self.offsetX < 0 && self.offsetX < -boundary) {
                self.goIndex("+1");
            } else {
                self.goIndex("0");
            }
        } else {
            if (self.offsetX > 50) {
                self.goIndex("-1")
            } else if (self.offsetX < -50) {
                self.goIndex("+1");
            } else {
                self.goIndex("0");
            }
        }
    }
    outer.addEventListener('touchstart', startHandler);
    outer.addEventListener('touchmove', moveHandler);
    outer.addEventListener('touchend', endHandler);
}

export default Slide