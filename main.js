class handler {
    constructor($container) {
        this.$container = $container;
        this.files = [];
        this.imgs = [];
        this.init();
    }
    init() {
        this.$container.addEventListener('dragover', () => {
            event.preventDefault();
        });
        this.$container.addEventListener('drop', () => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            this.files.push(file);
            this.handlerFile(file);
        });
        this.$container.addEventListener('change', () => {
            const file = event.target.files[0];
            this.handlerFile(file);
        });
    }
    handlerFile(file) {
        if (file.type.split('/')[0] !== 'image') {
            alert('You should choose an image file');
            return;
        }
        this.readImg(file);
    }
    readImg(file) {
        const reader = new FileReader(file);
        reader.addEventListener('load', () => {
            const imgData = event.target.result;
            this.renderImg(imgData);
        });
        reader.readAsDataURL(file);
    }
    renderImg(imgData) {
        const cvs = document.createElement('canvas'),
            ctx = cvs.getContext('2d'),
            img = new Image();
        img.src = imgData;
        img.addEventListener('load', () => {
            const newImgData = this.compressImg(img, cvs, 800, 'image/jpeg'),
                resultImg = new Image();
            resultImg.src = newImgData;
            this.imgs.push(resultImg);
            resultImg.addEventListener('load', () => {
                ctx.drawImage(resultImg, 0, 0)
                document.body.appendChild(cvs);
                console.log(this.files, this.imgs);
            });
        });
    }
    compressImg(img, cvs, maxWidth, type) {
        let width = img.naturalWidth,
            height = img.naturalHeight;
        const imgRatio = width / height;
        if (width > maxWidth) {
            width = maxWidth;
            height = width / imgRatio;
        }
        cvs.width = width;
        cvs.height = height;
        //把大图片画到一个小画布
        cvs.getContext('2d').drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, width, height);
        //图片质量进行适当压缩
        const quality = width >= 1500 ? 0.5 : width > 600 ? 0.6 : 1,
            newImageData = cvs.toDataURL(type, quality);
        //导出图片为base64
        return newImageData;
    }

}