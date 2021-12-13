let progress = document.querySelector('#progressBar');
let volume = document.querySelector('#volumeBar');
let control = document.querySelector('#controlPlay')
let player = document.querySelector('#audioPlayer');
let cdHTML = document.querySelector('#cd');
let playlistHtml = document.querySelector('#playlist');
let currentSongHTML = document.querySelector('#currentSong');
let next = document.querySelector('#controlNext');
let preview = document.querySelector('#controlPreview');
let totalTimeHTML = document.querySelector('#totalTime');
let currentTime = document.querySelector('#currentTime');
let muteHTML = document.querySelector('#mute');
let canvasHTML = document.querySelector('#canvas');
let color = document.querySelector('#colorBar');
let cssHTML = document.querySelector('#css');
let visuelHTML = document.querySelector('#visuel');
let styleHTML = document.querySelector('#styleBar');
let styleScript = document.querySelector('#style');


///////FONCTION ACTIVE

//////son suivant
function nextSong(jsonObj) {
    let currentSong = player.src;
    let val = 0;
    for (let index = 0; index < jsonObj.length; index++) {
        //////traitement des string pour comparer dans mon if 
        let currentSongSplit = currentSong.split("/", 6);
        let jsonObjSplit = (jsonObj[index].src).split("/", 4);
        ////////initialisation chanson suivante
        if (currentSongSplit[5] == jsonObjSplit[2]) {
            if (index + 1 != jsonObj.length) {
                val = index + 1;
            }
            let plusOneSong = jsonObj[val];
            changeSourceAudio(plusOneSong.src);
            changeimageCD(plusOneSong.pochette);
            changeCurrentSong(plusOneSong.titre);
            changeCurrentAlbum(plusOneSong.visuel)
            visu();
            player.play();
        }
    }
}

//////son précédent
function previousSong(jsonObj) {
    let currentSong = player.src;
    let end = jsonObj.length - 1;
    let val = end;
    if (player.currentTime < 10) {
        for (let index = 0; index < jsonObj.length; index++) {
            //////traitement des string pour comparer dans mon if 
            let currentSongSplit = currentSong.split("/", 6);
            let jsonObjSplit = (jsonObj[index].src).split("/", 4);
            ////////initialisation chanson suivante
            if (currentSongSplit[5] == jsonObjSplit[2]) {
                if (index != 0) {
                    val = index - 1;
                }
                let minusOneSong = jsonObj[val];
                changeSourceAudio(minusOneSong.src);
                changeimageCD(minusOneSong.pochette)
                changeCurrentSong(minusOneSong.titre)
                changeCurrentAlbum(minusOneSong.visuel)
                visu();
                player.play();
            }
        }
    } else {
        player.currentTime = 0;
    }

}

/////////CD TOURNE
function turn() {
    cd.classList.add("cdTurn");
}
function stopTurn() {
    cd.classList.remove("cdTurn")
}

///////PLAY PAUSE
function play() {
    if (player.paused) {
        visu();
        control.className = "fas fa-pause";
        turn();
    } else {
        player.pause();
        control.className = "fas fa-play";
        stopTurn();
    }
}

//////CHANGEMENT DE SOURCES
function changeSourceAudio(src) {
    player.src = src;
}
function changeimageCD(src) {
    cdHTML.src = src;
}
function changeCurrentSong(src) {
    currentSongHTML.textContent = src;
}
function changeCurrentAlbum(src) {
    visuelHTML.src = "./album/" + src;
}


/////////TEMPS AUDIO
function updateProgress(player) {
    let duration = player.duration;    // Durée totale
    let time = player.currentTime; // Temps écoulé
    let fraction = time / duration;
    let percent = Math.ceil(fraction * 100);
    progress.value = percent;
    progress.textContent = percent + '%';
}

/////////REGLER LE TEMPS
function updateTime(player, value) {
    let timeSet = (value / 100) * player.duration;
    player.currentTime = timeSet;
}

////////verif fin de chanson
function catchEnd(jsonObj) {
    if (player.currentTime == player.duration) {

        nextSong(jsonObj);
    }
}

///////////REGLER LE VOLUME
function updateVolume(player, value) {
    let volumeSet = value / 100;
    player.volume = volumeSet;
}

/////mute
function mute() {
    if (volume.value > 0) {
        updateVolume(player, volume.value = 0);
        muteHTML.className = "mute fas fa-volume-mute ";
    } else {
        updateVolume(player, volume.value = 50);
        muteHTML.className = "mute fas fa-volume-up";
    }

}
//////////////////////////FONCTIONS PASSIVES

/////////Affichage playlist
function playlist(jsonObj) {
    for (let index = 0; index < jsonObj.length; index++) {
        changeSourceAudio(jsonObj[0].src);
        changeCurrentSong(jsonObj[0].titre)
        changeimageCD(jsonObj[0].pochette);
        changeCurrentAlbum(jsonObj[0].visuel);
        const element = jsonObj[index];
        let titreEtAuteur = document.createElement("li");
        titreEtAuteur.textContent = element.titre + "  --  " + element.auteur;
        titreEtAuteur.addEventListener("click", e => {
            changeSourceAudio(element.src);
            changeCurrentSong(element.titre)
            changeimageCD(element.pochette)
            changeCurrentAlbum(element.visuel)
            play();
        })
        playlistHtml.appendChild(titreEtAuteur);
    }
}

/////////Affichage durée totale
function showDuration() {
    let totalTime = player.duration;
    let calc = parseInt(totalTime / 60);
    let calcSplit = parseInt(totalTime % 60);
    if (calc == isNaN && calcSplit == isNaN) {
        let total = "--mn--sec";
        totalTimeHTML.textContent = total;
    } else {

        let total = calc + "mn" + calcSplit + "sec";
        totalTimeHTML.textContent = total;
    }
}

/////////Affichage durée en cours
function currentDuration() {
    let totalTime = player.currentTime;
    let calc = parseInt(totalTime / 60);
    let calcSplit = parseInt(totalTime % 60);
    let total = calc + "mn" + calcSplit + "sec";
    currentTime.textContent = total;
}



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
            let testStyle = styleHTML.value;
            if (testStyle == 1) {
                let testColor = color.value;
                if (testColor < 50) {
                    let r = changeColor / 2 + barHeight + (25 * (i / bufferLength));
                    let g = 256 - volume.value;
                    let b = changeColor;
                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                    x += barWidth + 2;
                } else {
                    let r = changeColor / 2 + barHeight + (25 * (i / bufferLength));
                    let g = 0 + volume.value;
                    let b = changeColor + 100;
                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                    x += barWidth + 2;
                }
            } else {
                let testColor = color.value;
                if (testColor < 50) {
                    let r = changeColor / 2 + barHeight + (25 * (i / bufferLength));
                    let g = 256 - volume.value;
                    let b = changeColor;
                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillRect(x, HEIGHT - barHeight, 10, 10);
                    x += barWidth + 2;
                } else {
                    let r = changeColor / 2 + barHeight + (25 * (i / bufferLength));
                    let g = 0 + volume.value;
                    let b = changeColor + 100;
                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillRect(x, HEIGHT - barHeight, 10, 10);
                    x += barWidth + 2;
                }
            }
        }

    }
    player.play();
    renderFrame();
};

//////LISTENER

////////REGLER TEMPS
progress.addEventListener('input', (e) => {
    updateTime(player, progress.value)
});

//////REGLER LE VOLUME
volume.addEventListener('input', (e) => {
    updateVolume(player, volume.value)
});

//////REGLER LE VOLUME
volume.addEventListener('input', (e) => {
    let changeColor = color.value;
    return changeColor;
});


//////TEST VOLUME A ZERO
volume.addEventListener('input', (e) => {
    if (volume.value == 0) {
        muteHTML.className = "mute fas fa-volume-mute "
    } else {
        muteHTML.className = "mute fas fa-volume-up "
    }
});

//////TEST COULEUR
color.addEventListener('input', (e) => {

    if (color.value < 50) {
        cssHTML.href = "style.css"
    } else {
        cssHTML.href = "style2.css"
    }
});

// //////TEST STYLE
// styleHTML.addEventListener('input', (e) => {

//     if (styleHTML.value < 2) {
//         style.src = "visuUn.js"
//         console.log("test");
//     } else {
//         style.src = "visuDeux.js"
//         console.log("test");
//     }
// });

///////////MUTE
muteHTML.addEventListener('click', (e) => {
    mute();
});

///////PLAY PAUSE
control.addEventListener('click', (e) => {
    play();
});

///////RECUP DURATION
player.addEventListener('timeupdate', (e) => {
    showDuration(); currentDuration(); updateProgress(player);
});

///////AUTO NEXT
player.addEventListener('timeupdate', (e) => {
    if (player.ended) {
        next.click();
    }
});

//////FETCH
fetch("pistes.json").then(response => {
    return response.json()
}).then(response => {
    playlist(response.playlist);
    next.addEventListener("click", e => {
        nextSong(response.playlist);
    })
    preview.addEventListener("click", e => {
        previousSong(response.playlist);
    })
});

//////sprectoragramme de fond



