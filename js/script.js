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
    const pathToImg = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
    const imgNamesArray = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg',
        '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg',
        '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg',
        '19.jpg', '20.jpg'];

    const currentImgNumber = imgNamesArray.indexOf(resultImg.src.split('/').pop());
    const newImgName = (currentImgNumber >= 0 && currentImgNumber < imgNamesArray.length - 1) ? 
                    imgNamesArray[currentImgNumber + 1] : imgNamesArray[0];

    const currentDate = new Date();
    const hour = currentDate.getHours();
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
    
    resultImg.src = `${pathToImg}${timeOfDay}/${newImgName}`;
});

function updateEffects(input) {
    if (!resultImg.style.filter.includes(input.getAttribute('name'))) {
        resultImg.style.filter = `${resultImg.style.filter} ${input.getAttribute('name')}(${input.value}${input.getAttribute('data-sizing')})`;
    }
    else {
        let imgFilters = resultImg.style.filter.split(' ');
        for (let i = 0; i < imgFilters.length; i++) {
            if (imgFilters[i].includes(input.getAttribute('name')) == true) {
                imgFilters[i] = `${input.getAttribute('name')}(${input.value}${input.getAttribute('data-sizing')})`;
            }
        }
        resultImg.style.filter = imgFilters.join(' ');
    }
};

resetBtn.addEventListener('click', () => {
    effectSliders.forEach(slider => {
        const defaultValue = slider.children[0].children[0].getAttribute('value');
        slider.children[1].children[0].textContent = defaultValue;
        slider.children[0].children[0].value = defaultValue;
        updateEffects(slider.children[0].children[0]);
    });
});

saveBtn.addEventListener('click', () => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = resultImg.src;
    img.style.filter = resultImg.style.filter;

    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        //calculate blur
        const imgFilters = img.style.filter.split(' ');
        const blurFilter = imgFilters.find(effect => effect.includes('blur'));
        if (blurFilter) {
            const currentBlurValue = blurFilter.replace('blur(', '').replace('px)', '');
            let imgSizeDifference = 1;
            if(img.width >= img.height) {
                imgSizeDifference = img.width / resultImg.width;
            } else {
                imgSizeDifference = img.height / resultImg.height;
            }

            const finalBlurValue = Math.round(currentBlurValue * imgSizeDifference);
            img.style.filter = img.style.filter.replace(blurFilter, `blur(${finalBlurValue}px)`);
        }

        ctx.filter = img.style.filter;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let link = document.createElement('a');
        link.download = 'editedImage';
        link.href = canvas.toDataURL("image/png");
        link.click();
        link.delete;
    };
});

fileInput.addEventListener('change', () => {
    if (!fileInput.files[0]) return;

    const imgFile = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        resultImg.setAttribute('src', reader.result);
    };

    reader.readAsDataURL(imgFile);
    fileInput.value = '';
});

effectSliders.forEach(slider => {
    slider.oninput = function () {
        slider.children[1].children[0].textContent = slider.children[0].children[0].value;
        updateEffects(slider.children[0].children[0]);
    };
});
