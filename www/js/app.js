// Constants
var COUNTDOWN = 10 * 1000;
var MAX_QUESTION_VALUE = 3;

// jQuery refs
var $sections;
var $home_screen;
var $question_screen;
var $game_screen;
var $round_summary_screen;
var $challenge_friend_screen;
var $jplayer;

var $quick_play_button;
var $start_quest_button;
var $challenge_friend_button;
var $back_to_start_button;
var $back_to_summary_button;
var $story_title;
var $game_buttons;

// Game state
var current_question = null;
var current_score = 0;
var current_question_value = 0;
var countdown_timer = null;

// Index
crossroads.addRoute('', function() {
    clear_screen();
    $home_screen.show();
});

// Quest
crossroads.addRoute('quest', function() {
    clear_screen();
    $quest_screen.show();
});

// Turn
crossroads.addRoute('game', function() {
    clear_screen();

    current_question = QUESTIONS[0];

    $story_title.text(current_question.title);

    for (var i = 0; i < 4; i++) {
        var choice = current_question.choices[i];

        $($game_buttons[i]).text(choice);
    }

    current_question_value = MAX_QUESTION_VALUE;

    $game_screen.show();

    // See audio playing for more turn setup
    play_audio("audio/20090115_atc_13.mp3");
});

// Round over
crossroads.addRoute('round-summary', function() {
    clear_screen();
    $round_summary_screen.show();
});

// Challenge
crossroads.addRoute('challenge-friend', function() {
    clear_screen();
    $challenge_friend_screen.show();
});

// Utils
function parse_hash(new_hash, old_hash) {
    crossroads.parse(new_hash);
}

function clear_screen() {
    $jplayer.jPlayer("stop");
    $sections.hide();
}

function play_audio(filename) {
    $jplayer.jPlayer("setMedia", {
        mp3: filename
    }).jPlayer("play");
}

function audio_playing() {
    countdown_timer = setTimeout(countdown_over, COUNTDOWN);
}

function countdown_over() {
    current_question_value -= 1;

    if (current_question_value > 0) {
        console.log("Max points now: " + current_question_value);

        countdown_timer = setTimeout(countdown_over, COUNTDOWN);
    } else {
        console.log("Turn over, you lose");

        countdown_timer = null;
    }
}

function choice_clicked() {
    // Right answer
    if ($(this).text() == current_question.answer) {
        if (countdown_timer) {
            clearTimeout(countdown_timer);
            countdown_timer = null;
        }

        hasher.setHash("round-summary");
    // Wrong answer
    } else {
        clearTimeout(countdown_timer);
        countdown_over();
    }
}

function audio_ended() {
    // TODO: prompt to go to next question
}

$(function() {
    // jQuery refs
    $sections = $("section");
    $home_screen = $("#home-screen");
    $game_screen = $("#game-screen");
    $quest_screen = $("#quest-screen");
    $round_summary_screen = $("#round-summary-screen");
    $challenge_friend_screen = $("#challenge-friend-screen");

    $quick_play_button = $("#quick-play");
    $start_quest_button = $("#start-quest");
    $challenge_friend_button = $("#challenge-friend");
    $back_to_start_button = $("#back-to-start");
    $back_to_summary_button = $("#back-to-summary");
    $story_title = $("#story-title");
    $game_buttons = $("#game-buttons button");

    // Routing events 
    $quick_play_button.click(function() {
        hasher.setHash("game");
    });

    $start_quest_button.click(function() {
        hasher.setHash("quest");
    });

    $challenge_friend_button.click(function() {
        hasher.setHash("challenge-friend");
    });

    $back_to_start_button.click(function() {
        hasher.setHash("");
    });

    $back_to_summary_button.click(function() {
        hasher.setHash("round-summary");
    });
    
    // Gameplay events
    $game_buttons.click(choice_clicked);

    // Audio setup
    $jplayer = $("#pop-audio");

    $jplayer.jPlayer({
        supplied: "mp3"
    });

    // Audio events
    $jplayer.bind($.jPlayer.event.play, audio_playing);
    $jplayer.bind($.jPlayer.event.ended, audio_ended);

    // Start routing
    hasher.initialized.add(parse_hash);
    hasher.changed.add(parse_hash);

    hasher.prependHash = "";

    hasher.init();
});

