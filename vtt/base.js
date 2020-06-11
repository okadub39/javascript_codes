var video,textTrack;
var cnt = 0;

function init(){
    video = document.getElementById("video");
    textTrack = video.addTextTrack("subtitles");
    textTrack.mode = "showing";
    document.getElementById("add").disabled = true;
}

function loadVideo(e) {
    video.src = URL.createObjectURL(e.files[0]);
    video.ontimeupdate = function() {
        document.getElementById("time").innerText = getTime();
        document.getElementById("secTime").innerText = video.currentTime;
    }
    document.getElementById("add").disabled = false;
}

function getTime(){
    var hh = Math.floor(video.currentTime/3600);
    var mm = Math.floor((video.currentTime - hh * 3600)/60);
    var ss = (video.currentTime - hh * 3600 - mm * 60).toFixed(3);
    return ("00" + hh).slice(-2) + ":" + ("00"+mm).slice(-2)+":"+("00"+ss).slice(-6);
}

function setTime(n) {
    document.getElementById("time_" + n).innerText = getTime();
    document.getElementById("secTime_" + n).innerText = video.currentTime;
}

function addVTT(){
    var startTime = document.getElementById("time_0").innerText;
    var startSecTime = document.getElementById("secTime_0").innerText;
    var endTime = document.getElementById("time_1").innerText;
    var endSecTime = document.getElementById("secTime_1").innerText;
    var vttTime = startTime + "-->" + endTime;
    var vttText = document.getElementById("text").value;
    if((startTime < endTime)&&(vttText != "")) {
        var vtt = document.createElement("div");
        vtt.id = "vtt_" + cnt;
        var del = document.createElement("button");
        del.innerText = "delete";
        del.onclick = deleteVTT;
        vtt.append(del);
        var data = document.createElement("span");
        data.innerHTML = vttTime + "¥n" + vttText;
        vtt.append(data);
        document.getElementById("list").appendChild(vtt);

        var cue = new VTTCue(startSecTime,endSecTime,vttText);
        cue.id = "cue_" + cnt;
        textTrack.addCue(cue);
        cnt++;

        document.getElementById("time_0").innerText = "--:--:--.---";
        document.getElementById("secTime_0").innerText = "";
        document.getElementById("time_1").innerText = "--:--:--.---";
        document.getElementById("secTime_1").innerText = "";
        document.getElementById("text").value = "";

    }
}

function deleteVTT(event) {
    var vtt = event.target.parentElement;
    var id = vtt.id.split("_")[1];
    for (var i=0; i<textTrack.cues.length; i++){
        if(textTrack.cues[i].id.split("_")[1] == id) {
            textTrack.removeCue(textTrack.cues[i]);
        }
    }
    document.getElementById("list").removeChild(vtt);
}


function saveVTT() {
    var vtts = document.getElementById("list").children;
    var vttData = "WEBVTT¥n¥n";
    for (var i = 0; i < vtts.length; i++) {
        vttData += replaceHTML(vtts[i].children[1].innerHTML);
        vttData += "¥n¥n";
    }
    var blob = new Blob([vttData],{type:"text/vtt"});
    var filename = window.prompt("input file name","movie.vtt");
    if(filename != null) {
        if(window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob,filename);
        } else {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
}

function replaceHTML(text){
    var outText = text;
    outText = outText.replace(/(&lt;)/g,"<");
    outText = outText.replace(/(&gt;)/g,">");
    outText = outText.replace(/(&quot;)/g,'"');
    outText = outText.replace(/(&#39;)/g,"'");
    outText = outText.replace(/(&amp;)/g,"&");
    return outText;
}




