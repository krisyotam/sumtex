let TIMEOUT_SECONDS = 180;
let TIMEOUT_STRING = "three minutes";
let secondsRemaining = TIMEOUT_SECONDS;

let gameTimer;
let oldVal;
let problemNumber = 0;
let problemPoints = 0;
let currentScore = 0;
let numCorrect = 0;
let problemsOrder;
let debug = false;
let lastTarget = '';
let mobile = false;
let showShadow = false;
let skippedProblems = [];
let showSkipped = false;

function mobileCheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayLaTeXInBody() {
    renderMathInElement(document.body, {
        options: {
            throwOnError: false,
            display: false
        }
    });
}

// A simple timer
function displayTime(secs) {
    let minutes = Math.floor(secs / 60) % 60;
    let seconds = secs % 60;
    let displayText = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
    $("#timer").text(displayText);
}

function displayInfiniteTime() {
    katex.render(`\\infty`, $("#timer")[0]);
}

function startTimer(onTimeoutFunc) {
    secondsRemaining = TIMEOUT_SECONDS;
    gameTimer = setInterval(function() {
        secondsRemaining--;
        displayTime(secondsRemaining);
        if (secondsRemaining == 0) {
            clearInterval(timer);
            onTimeoutFunc();
        }
    }, 1000);
}

function toggleShowSkipped() {
  $("#skipped-problems").toggle();
  showSkipped = !showSkipped;
  $("#show-skipped-button").text(showSkipped ? "Hide Skipped" : "Show Skipped");
}

function showIntro() {
    $("#game-window").hide();
    $("#ending-window").hide();
    $("#intro-window").show();
    $("#score-submission").show();

    let introText =  "This is a math game to test your problem-solving skills. <br/> <br/>" +
                     " Solve as many math problems as you can in " + TIMEOUT_STRING + " (timed game), or play an untimed game (zen mode)!";
    $("#intro-text").html(introText);

    if (mobileCheck()) {
      $("#hint-list").prepend("<li><span style=\"color:red\"><b>Consider switching to a desktop browser</b></span></li>")
      mobile = true;
    }

    displayLaTeXInBody();
    $("#container").show();
}

function endGame() {
    clearTimeout(gameTimer);

    $("#intro-window").hide();
    $("#game-window").hide();
    $("#ending-window").show();
    displayLaTeXInBody();

    let problemsText = numCorrect + ((numCorrect == 1) ? " problem" : " problems");
    let endingText = "You finished " + problemsText + " for a total score of " + currentScore;
    $("#ending-text").text(endingText);
    
    // Load initial leaderboard
    loadLeaderboard('today');
    
    skippedProblems.forEach(idx => {
      let target = problems[problemsOrder[idx % problems.length]];
      let problemId = 'skipProblem' + idx;
      let solutionId = 'skipSolution' + idx;
      let skippedProblemsHtml = `
        <p class="problem-header"><span class="title">${target.title}</span></p>
        <p><strong>Problem:</strong></p>
        <div class="latex">
          <div id="${problemId}"></div>
        </div>
        <br>
        <p><strong>Solution:</strong></p>
        <div class="latex">
          <div id="${solutionId}"></div>
        </div>
        <br><br>
      `;
        $("#skipped-problems").append(skippedProblemsHtml);

        katex.render(target.latex, $("#" + problemId)[0], {
            throwOnError: false,
            displayMode: true
        });
        
        katex.render(target.solution, $("#" + solutionId)[0], {
            throwOnError: false,
            displayMode: true
        });
    });
    displayLaTeXInBody();

    $("#skipped-problems").hide()
    $("#show-skipped-button").text("Show Skipped");
    showSkipped = false;
    if (skippedProblems.length > 0) {
      $("#show-skipped-message").show();
      $("#show-skipped-button").show();
    } else {
      $("#show-skipped-message").hide();
      $("#show-skipped-button").hide();
    }
}


function startGame(useTimer) {
    problemNumber = 0;
    currentScore = 0;
    numCorrect = 0;
    oldVal = "";
    problemsOrder = [...Array(problems.length).keys()];
    shuffleArray(problemsOrder);
    skippedProblems = [];

    $("#intro-window").hide();
    $("#ending-window").hide();
    $("#game-window").show();
    $("#skipped-problems").html("");
    $("#skipped-problems").hide();

    displayLaTeXInBody();

    $("#score").text(0);

    if (useTimer) {
        displayTime(TIMEOUT_SECONDS);

        // Reset and start the timer
        loadProblem();
        startTimer(function() {
            endGame();
        });
    } else {
        displayInfiniteTime();
        loadProblem();
    }
}

function loadProblem() {
    // clear current work
    $('#out').empty();
    $('#user-input').val('');
    $('#hint-container').hide();
    $('#hint-button').show();

    // reset styling
    $('#out').parent().removeClass("correct");
    $('#user-input').prop("disabled", false);
    if (!mobile) {
      $('#user-input').focus();
    }

    // load problem
    let target = problems[problemsOrder[problemNumber % problems.length]];
    if (debug) {
      target = problems[problemNumber + 179];
    }
    problemNumber += 1;

    // Store current problem for checking answer
    window.currentProblem = target;

    // load problem text
    let problemText = "Problem " + problemNumber + ": " + target.title;
    $("#problem-title").text(problemText);
    problemPoints = Math.ceil(target.latex.length / 10.0);
    let pointsText = "(" + problemPoints + ((problemPoints == 1) ? " point)" : " points)");
    $("#problem-points").text(pointsText);

    displayLaTeXInBody();

    // load problem body (show the problem, not the solution)
    katex.render(target.latex, $("#target")[0], {
        throwOnError: false,
        displayMode: true
    });

    oldVal = "";
};

function normalize(input) {
  normalizations.forEach(
    rule => input = input.replace(rule["rule"], rule["replacement"])
  );
  return input;
}

function updatePreview() {
    let currentVal = normalize($("#user-input").val());
    if (currentVal == oldVal) {
        return; // check to prevent multiple simultaneous triggers
    }

    oldVal = currentVal;
    // Update the preview
    katex.render(currentVal, $("#out")[0], {
        throwOnError: false,
        displayMode: true
    });
}

function checkAnswer() {
    let userAnswer = normalize($("#user-input").val().trim());
    let correctAnswer = normalize(window.currentProblem.solution);
    
    console.log("User answer:", userAnswer);
    console.log("Correct answer:", correctAnswer);
    
    if (userAnswer === correctAnswer) {
        // Correct answer!
        currentScore += problemPoints;
        numCorrect += 1;

        // Styling changes
        $('#out').parent().addClass("correct");
        $('#user-input').prop("disabled", true);
        $("#score").text(currentScore);
        $('#check-answer-button').text("Correct! ✓");
        $('#check-answer-button').prop("disabled", true);
        $('#hint-button').hide();

        // Load new problem after a delay
        setTimeout(() => {
            $('#check-answer-button').text("Check Answer");
            $('#check-answer-button').prop("disabled", false);
            loadProblem();
        }, 2000);
    } else {
        // Wrong answer
        $('#out').parent().removeClass("correct");
        $('#check-answer-button').text("Try Again");
        setTimeout(() => {
            $('#check-answer-button').text("Check Answer");
        }, 1000);
    }
}

function showHint() {
    if (window.currentProblem && window.currentProblem.hint) {
        katex.render(window.currentProblem.hint, $("#hint-display")[0], {
            throwOnError: false,
            displayMode: false
        });
        $('#hint-container').show();
        $('#hint-button').hide();
        
        // Reduce points for using hint
        problemPoints = Math.max(1, Math.floor(problemPoints * 0.5));
        let pointsText = "(" + problemPoints + ((problemPoints == 1) ? " point)" : " points)");
        $("#problem-points").text(pointsText);
    }
}

// Helper function to escape HTML special characters
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Leaderboard functions
async function submitScore(name, score) {
    try {
        await db.collection('leaderboard').add({
            name: name.trim(),
            score: score,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        loadLeaderboard('today'); // Refresh leaderboard after submission
    } catch (error) {
        console.error("Error submitting score:", error);
    }
}

async function loadLeaderboard(timeRange) {
    const leaderboardList = $("#leaderboard-list");
    leaderboardList.empty();
    
    try {
        let query = db.collection('leaderboard');
        
        // Add time constraints based on selected range
        const now = new Date();
        if (timeRange === 'today') {
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            query = query.where('timestamp', '>=', startOfDay);
        } else if (timeRange === 'month') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            query = query.where('timestamp', '>=', startOfMonth);
        }
        
        const snapshot = await query.orderBy('score', 'desc').limit(10).get();
        
        if (snapshot.empty) {
            leaderboardList.append('<p>No scores yet!</p>');
            return;
        }
        
        let rank = 1;
        snapshot.forEach((doc) => {
            const data = doc.data();
            const scoreEntry = `
                <div class="leaderboard-entry" style="margin: 5px 0;">
                    <span class="rank">#${rank}</span>
                    <span class="name">${escapeHtml(data.name)}</span>
                    <span class="score">${data.score} points</span>
                </div>
            `;
            leaderboardList.append(scoreEntry);
            rank++;
        });
    } catch (error) {
        console.error("Error loading leaderboard:", error);
        leaderboardList.append('<p>Error loading leaderboard</p>');
    }
}

// Start by showing the intro.
$(document).ready(function() {
    // Handlers
    $("#start-button-timed").click(function() {
        startGame(true);
    });

    $("#start-button-untimed").click(function() {
        startGame(false);
    });

    $("#reset-button-timed").click(function() {
        startGame(true);
    });

    $("#reset-button-untimed").click(function() {
        startGame(false);
    });

    $("#skip-button").click(function() {
        skippedProblems.push(problemNumber - 1);
        loadProblem();
    });

    $("#show-skipped-button").click(function() {
      toggleShowSkipped();
    })

    $("#end-game-button").click(function() {
        endGame();
    });

    $("#user-input").on("change keyup paste", function() {
        updatePreview()
    });

    $("#check-answer-button").click(function() {
        checkAnswer();
    });

    $("#hint-button").click(function() {
        showHint();
    });

    // Allow Enter key to check answer
    $("#user-input").keydown(function(e) {
        if (e.which == 13 && e.ctrlKey) { // Ctrl+Enter to check answer
            checkAnswer();
        }
    });

    // Leaderboard handlers
    $("#submit-score").click(function() {
        const playerName = $("#player-name").val().trim();
        if (playerName.length === 0) {
            alert("Please enter your name");
            return;
        }
        if (playerName.length > 30) {
            alert("Name must be 30 characters or less");
            return;
        }
        
        submitScore(playerName, currentScore);
        $("#score-submission").hide();
    });
    
    $("#today-scores, #month-scores, #all-time-scores").click(function() {
        const timeRange = $(this).attr('id').replace('-scores', '');
        
        // Update active button
        $(".leaderboard-controls .latex-button").removeClass('active');
        $(this).addClass('active');
        
        loadLeaderboard(timeRange);
    });
    
    $("#play-again-button").click(function() {
        showIntro();
    });
    
    showIntro();
});
