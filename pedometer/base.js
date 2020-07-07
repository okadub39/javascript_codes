let stepData = new Array();
let steps    = -1;
let status   = "down";

const init = () => {
    const loadData = localStorage.getItem("pedometer");
    if(loadData != null) stepData = JSON.parse(loadData);
    const [yy,mm,dd,dateText] = getYMD();
    steps = getSteps(yy,mm,dd);
    if(steps < 0){
        steps = 0;
        stepData.push({"date":`${yy}/${mm}/${dd}`,"step":steps});
    }
    showStepData();
    if(window.DeviceMotionEvent) {
        window.addEventListener("devicemotion",countSteps);
    } else {
        document.getElementById("today_steps").innerText = "---";
    }
}

const getYMD = (date = new Date()) => {
    const yy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    let dateText  = `${yy}/${("00"+mm).slice(-2)}/${("00"+dd).slice(-2)}`;
    const dayName = ["日","月","火","水","木","金","土"];
    dateText     += `(${dayName[date.getDay()]})`;
    return [yy,mm,dd,dateText];
}

const getSteps = (yy,mm,dd) => {
    const index = stepData.findIndex(({date}) => date == `${yy}/${mm}/${dd}`);
    let dateSteps = -1;
    if (index > 1) dateSteps = stepData[index].step;
    return dateSteps;
}

const showStepData = () => {
    const today = new Date();
    const [yy,mm,dd,dateText] = getYMD(today);
    document.getElementById("today").innerText = dateText;
    document.getElementById("today_steps").innerText = steps;
    let startDate = today;
    let maxStep = 1000;
    for (const sdata of stepData) {
        const [yy,mm,dd] = sdata.date.split("/");
        const date = new Date(yy,mm-1,dd)
        if (date < startDate) startDate = date.setDate(1);
        if (sdata.step > maxStep) maxStep = sdata.step;
    }
    document.getElementById("graph").innerHTML = "";
    let targetDate = today,checkToday = true,monthStep = 0;
    while (startDate <= targetDate) {
        const [yy,mm,dd,dateText] = getYMD(targetDate);
        let dateStep = getSteps(yy,mm,dd);
        if(dateStep < 0) dateStep = 0;
        monthStep += dateStep;
        const dateRow = document.createElement("div");
        dateRow.className = "row";
        const dateDiv = document.createElement("div");
        dateDiv.className = "date";
        dateDiv.innerText = dateText;
        dateRow.appendChild(dateDiv);
        const stepDiv = document.createElement("div");
        stepDiv.className = "step";
        stepDiv.innerText = dateStep;
        dateRow.appendChild(stepDiv);
        const barDiv = document.createElement("div");
        barDiv.className = "bar";
        if(checkToday) barDiv.classList.add("today_bar");
        barDiv.style.width = `${Math.floor(dateStep / maxStep * 500)}px`;
        todayBar = barDiv;
        dateRow.appendChild(barDiv);
        document.getElementById("graph").appendChild(dateRow);
        if(targetDate.getDate()==1) {
            const monthRow = document.createElement("div");
            monthRow.className = "row";
            const monthDiv = document.createElement("div");
            monthDiv.className = "date";
            monthDiv.innerText = `*** ${mm}月合計 ***`;
            monthRow.appendChild(monthDiv);
            const monthStepDiv = document.createElement("div");
            monthStepDiv.className = "step";
            monthStepDiv.innerText = monthStep;
            monthRow.appendChild(monthStepDiv);
            document.getElementById("graph").appendChild(monthRow);
            const hr = document.createElement("hr");
            document.getElementById("graph").appendChild(hr);
            monthStep = 0;
        }
        targetDate.setDate(targetDate.getDate()-1);
        checkToday = false;
    }
}

const countSteps = event => {
    const a = event.accelerationIncludingGravity;
    const d = Math.hypot(a.x,a.y,a.z);
    if((status == "down")&&(d>11)) {
        status = "up";
    } else if ((status ==  "up")&&(d<10)){
        steps++;
        status = "down"
    }
    const [yy,mm,dd,dateText] = getYMD();
    const index = stepData.findIndex(({date}) => date == `${yy}/${mm}/${dd}`);
    if(index>1){
        stepData[index].step = steps;
    } else {
        steps = 0;
        stepData.push({"date":`${tt}/${mm}/${dd}`,"step":steps});
    }
    if(a.z != null) {
        localStorage.setItem("pedometer",JSON.stringify(stepData));
        showStepData();
    } else {
        document.getElementById("today_steps").innerText = "---";
    }
}
