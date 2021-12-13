///////Visuel
function visu() {
    let context = new AudioContext();
    let src = context.createMediaElementSource(player);
    let analyser = context.createAnalyser();
    let canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let ctx = canvas.getContext("2d");
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 256;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    let WIDTH = canvas.width;
    let HEIGHT = canvas.height;
    let barWidth = (WIDTH / bufferLength);
    let barHeight;
    let x = 0;
    function renderFrame() {
        requestAnimationFrame(renderFrame);
        x = 0;
        let changeColor = color.value;
        analyser.getByteFrequencyData(dataArray);
        ctx.fillStyle = "#1d1c1c";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            let testColor = color.value;
            if (testColor < 50) {
                let r = changeColor / 2 + barHeight + (25 * (i / bufferLength));
                let g = 256 - volume.value;
                let b = changeColor;
                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(x, HEIGHT - barHeight , 10, 10);
                x += barWidth +3 ;
            } else {
                let r = changeColor / 2 + barHeight + (25 * (i / bufferLength));
                let g = 0 + volume.value;
                let b = changeColor + 100;
                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(x, HEIGHT - barHeight , 10, 10);
                x += barWidth +3;
            }
        }
    }
    player.play();
    renderFrame();
};
