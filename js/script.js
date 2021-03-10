const fullScreenBtn = document.querySelector('.full-screen');
const fileInput = document.querySelector('.file-input');
const effectSliders = document.querySelectorAll('.slider-box');
const resetBtn = document.querySelector('.reset');
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

fileInput.addEventListener('change', () => {
    resultImg.onload = () => {
        URL.revokeObjectURL(resultImg.src);
    }
    resultImg.src = URL.createObjectURL(fileInput.files[0]);
});

effectSliders.forEach(slider =>{
    slider.children[1].children[0].textContent = slider.children[0].children[0].value;
    slider.oninput = function(){
        slider.children[1].children[0].textContent = slider.children[0].children[0].value;
        console.log(slider.children[0].children[0]);
        updateEffects(slider.children[0].children[0]);
    }
});

resetBtn.addEventListener('click', () => {
    effectSliders.forEach(slider =>{
        let defaultValue = slider.children[0].children[0].getAttribute('value');
        slider.children[1].children[0].textContent = defaultValue;
        slider.children[0].children[0].value = defaultValue;
        updateEffects(slider.children[0].children[0]);
    });
})

function updateEffects(input){
    switch(input.getAttribute('name')){
        case '': break;
        case '': break;
        case '': break;
        case '': break;
    }
    resultImg.style.filter = "brightness(" + input.value +input.getAttribute('data-sizing')+")";
};