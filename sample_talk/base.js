var scenario;
var index = 0;

function init() {
    var h = window.innerHeight - 150;
    scenario = {
        "title":"Self_introduction","end":"win",
            "scene":[
                {
                    "id":"01",
                    "text":"Hello!! My name is john smith.<br/>What do you want me to know?",
                    "select":[
                        {
                            "text":"Career","id":"career_01"
                        },
                        {
                            "text":"hobby","id":"hobby_01"
                        },
                        {
                            "text":"What's your ideal woman/man?","id":"like_01"
                        }
                    ]
                },
                {
                    "id":"career_01",
                    "text":"I am WEB Engineer.<br />I have portfolio site.and github , codepen",
                    "select":[
                        {
                            "text":"portfolio site","id":"career_02"
                        },
                        {
                            "text":"github","id":"career_03"
                        },
                        {
                            "text":"codepen","id":"career_04"
                        }
                    ]
                },
                {
                    "id":"career_02",
                    "text":"This site is my portfolio site. <br /> https://profile.nuevo.jp <br />If you want see,please contact me.",
                    "select":[
                        {
                            "text":"BACK","id":"career_01"
                        }
                    ]
                },
                {
                    "id":"career_03",
                    "text":"My Github Page. <br /> https://github.com/okadub39 <br />If you want see,please contact me.",
                    "select":[
                        {
                            "text":"BACK","id":"career_01"
                        }
                    ]
                },
                {
                    "id":"career_04",
                    "text":"My Code Pen. <br /> https://codepen.io/okada-web/ <br />If you want see,please contact me.",
                    "select":[
                        {
                            "text":"BACK","id":"career_01"
                        }
                    ]
                },
                {
                    "id":"hobby_01",
                    "text":"I love music,football,movie,anime.<br />Which do you want to know?",
                    "select":[
                        {
                            "text":"music","id":"hobby_02"
                        },
                        {
                            "text":"football","id":"hobby_03"
                        },
                        {
                            "text":"anime","id":"hobby_04"
                        }
                    ]
                },
                {
                    "id":"hobby_02",
                    "text":"I like UK Rock,Bosanova,house music.<br />The Stone Roses,OASIS,Radiohead,NIRVANA etc",
                    "select":[
                        {
                            "text":"BACK","id":"hobby_01"
                        }
                    ]
                },
                {
                    "id":"hobby_03",
                    "text":"My Favorite Football Club is FC BARCELONA!!",
                    "select":[
                        {
                            "text":"BACK","id":"hobby_01"
                        }
                    ]
                },
                {
                    "id":"hobby_04",
                    "text":"I like Japanese animation.Clanado,Toradora,Kimetsu no yaiba.",
                    "select":[
                        {
                            "text":"BACK","id":"hobby_01"
                        }
                    ]
                },
                {
                    "id":"like_01",
                    "text":"Please see mirror.<br />he in mirror is my favorite man/woman.",
                    "select":[
                        {
                            "text":"BACK","id":"01"
                        }
                    ]
                }
            ]
    };
    document.getElementById("game").style.height = h + "px";
    document.getElementById("start").disable = true;
}

function loadScenario(e) {
    var reader = new FileReader();
    reader.onload = function() {
        scenario = JSON.parse(reader.result);
        console.log(scenario);
        initScenario();
        document.getElementById("start").disable = false;
    };
    reader.readAsText(e.files[0]);
}

function initScenario() {
    document.getElementById("title").innerHTML = "【" + scenario.title + "】";
    document.getElementById("game").innerHTML = "";
    index = 0;
    setScene();
}

function setScene() {
    var scene = document.createElement("div");
    scene.innerHTML = scenario.scene[index].text;
    document.getElementById("game").appendChild(scene);

    var cnt = scenario.scene[index].select.length;
    if(cnt > 0) {
        var question = document.createElement("div");
        question.id = "question";
        question.className = "select";
        question.innerHTML = "> Please SELECT";

        var selectList = document.createElement("ol");
        for (var i=0; i<cnt; i++){
            var select = document.createElement("li");
            select.id = scenario.scene[index].select[i].id;
            select.innerHTML = scenario.scene[index].select[i].text;
            select.onclick = action;
            selectList.appendChild(select);
        }
        question.appendChild(selectList);
        document.getElementById("game").appendChild(question);

        var height = document.getElementById("game").scrollHeight;
        document.getElementById("game").scrollTop = height;
    } else {
        var end = document.createElement("div");
        end.className = "red";
        if(scenario.scene[index].id == scenario.end) {
            end.innerHTML = "CLEAR!";
        } else {
            end.innerHTML = "GAME OVER!";
        }
        document.getElementById("game").appendChild(end);
    }
}

function action(event) {
    var question = document.getElementById("question");
    question.innerHTML = ">" + event.target.innerHTML;
    question.removeAttribute("id");
    for (var i = 0; i < scenario.scene.length; i++) {
        if(scenario.scene[i].id == event.target.id) {
            index = i;
            break;
        }
    }
    setScene();
}
