const fullScreenBtn = document.querySelector('.full-screen');
const resetBtn = document.querySelector('.btn-reset');
const saveBtn = document.querySelector('.btn-save');
const nextImgBtn = document.querySelector('.btn-next-img');
const fileInput = document.querySelector('.file-input');

const effectSliders = document.querySelectorAll('.slider-box');
const resultImg = document.querySelector('.result-img');

fullScreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

document.addEventListener('fullscreenchange', () => {
    document.querySelector('.expand-icon').classList.toggle('hidden-icon');
    document.querySelector('.compress-icon').classList.toggle('hidden-icon');
    fullScreenBtn.classList.toggle('btn-selected');
});

nextImgBtn.addEventListener('click', () => {
    const imgNamesArray = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg',
        '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg',
        '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg',
        '19.jpg', '20.jpg'];

    let currentImgNumber = imgNamesArray.indexOf(resultImg.src.split('/').pop());
    let newImgName = (currentImgNumber >= 0 && currentImgNumber < imgNamesArray.length - 1) ?
        imgNamesArray[currentImgNumber + 1] : imgNamesArray[0];

    let currentDate = new Date();
    let hour = currentDate.getHours();
    let timeOfDay = '';

    if (hour < 6) {
        timeOfDay = 'night';
    } else if (hour < 12) {
        timeOfDay = 'morning';
    } else if (hour < 18) {
        timeOfDay = 'day';
    } else if (hour < 24) {
        timeOfDay = 'evening';
    }

    resultImg.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${newImgName}`;
})



resetBtn.addEventListener('click', () => {
    effectSliders.forEach(slider => {
        let defaultValue = slider.children[0].children[0].getAttribute('value');
        slider.children[1].children[0].textContent = defaultValue;
        slider.children[0].children[0].value = defaultValue;
        updateEffects(slider.children[0].children[0]);
    });
});

saveBtn.addEventListener('click', () => {
    let img = new Image();
    img.src = resultImg.src;

    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    let ctx = canvas.getContext('2d');
    ctx.filter = resultImg.style.filter;

    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        let link = document.createElement('a');
        link.setAttribute('download', localStorage.getItem('loadedImgName'));
        link.setAttribute('href', canvas.toDataURL("image/png"));
        link.click();
    };
});

fileInput.addEventListener('change', () => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        let fileName = fileInput.files[0].name.split('.')[0];
        localStorage.setItem('loadedImg', reader.result);
        localStorage.setItem('loadedImgName', fileName);
    });
    reader.readAsDataURL(fileInput.files[0]);
    reader.onload = () => {
        resultImg.setAttribute('src', localStorage.getItem('loadedImg'));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const loadedImgDataUrl = localStorage.getItem('loadedImg');
    if (loadedImgDataUrl) {
        resultImg.setAttribute('src', loadedImgDataUrl);
    }
    else {
        localStorage.setItem('loadedImg', resultImg.src);
        localStorage.setItem('loadedImgName', 'testImg');
    }
});

effectSliders.forEach(slider => {
    slider.children[1].children[0].textContent = slider.children[0].children[0].value;
    slider.oninput = function () {
        slider.children[1].children[0].textContent = slider.children[0].children[0].value;
        updateEffects(slider.children[0].children[0]);
    };
});

function updateEffects(input) {
    if (!resultImg.style.filter.includes(input.getAttribute('name'))) {
        resultImg.style.filter = resultImg.style.filter + " " + input.getAttribute('name') + "(" + input.value + input.getAttribute('data-sizing') + ")";
    }
    else {
        let imgFilters = resultImg.style.filter.split(' ');
        for (let i = 0; i < imgFilters.length; i++) {
            if (imgFilters[i].includes(input.getAttribute('name')) == true) {
                imgFilters[i] = input.getAttribute('name') + "(" + input.value + input.getAttribute('data-sizing') + ")";
            }
        }
        resultImg.style.filter = imgFilters.join(' ');
    }
};


