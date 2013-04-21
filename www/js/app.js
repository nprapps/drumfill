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
var $game_score;
var $turn_number;
var $turn_count;

// Game state
var current_turn = 0;
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

    current_turn = 0;
    $turn_count.text(QUESTIONS.length);

    next_turn();

    $game_screen.show();
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

function shuffle(in_array) {
    var i = in_array.length;
    var j;
    var tempi;
    var tempj;

    if (i === 0) {
        return false;
    }
  
    while (--i) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        tempi = in_array[i];
        tempj = in_array[j];
        in_array[i] = tempj;
        in_array[j] = tempi;
    }
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
    $game_buttons.show();
    countdown_timer = setTimeout(countdown_over, COUNTDOWN);
}

function countdown_over($hide_button) {
    current_question_value -= 1;

    if (current_question_value > 0) {
        console.log("Max points now: " + current_question_value);

        // Hide the clicked button
        if ($hide_button) {
            $hide_button.hide();
        // Hide a random button
        } else {
            var $wrong_buttons = [];

            for (i in $game_buttons) {
                $button = $game_buttons.eq(i);
                if ($button.is(":visible") && $button.text() !=current_question.answer) {
                    $wrong_buttons.push($button);
                }
            }

            shuffle($wrong_buttons);

            $wrong_buttons[0].hide();
        }

        countdown_timer = setTimeout(countdown_over, COUNTDOWN);
    } else {
        $game_buttons.hide();
        countdown_timer = null;

        next_turn();
    }
}

function choice_clicked() {
    // Right answer
    if ($(this).text() == current_question.answer) {
        clearTimeout(countdown_timer);
        countdown_timer = null;

        current_score += current_question_value;
        $game_score.text(current_score);

        next_turn();
    // Wrong answer
    } else {
        clearTimeout(countdown_timer);
        countdown_over($(this));
    }
}

function next_turn() {
    current_turn += 1;

    if (current_turn <= QUESTIONS.length) {
        $turn_number.text(current_turn);
        current_question = QUESTIONS[current_turn - 1];

        $story_title.text(current_question.title);

        // Shallow copy
        choices = current_question.choices.slice(0);
        shuffle(choices);

        for (var i = 0; i < 4; i++) {
            var choice = choices[i];

            $($game_buttons[i]).text(choice);
        }

        // Don't show buttons until audio starts playing
        $game_buttons.hide();

        current_question_value = MAX_QUESTION_VALUE;

        // See audio playing for more turn setup
        play_audio("audio/20090115_atc_13.mp3");
    } else {
        hasher.setHash("round-summary");
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
    $game_score = $("#game-score .score");
    $turn_number = $("#turn-number");
    $turn_count = $("#turn-count");

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

    $jplayer.jPlayer("mute", true);

    // Audio events
    $jplayer.bind($.jPlayer.event.play, audio_playing);
    $jplayer.bind($.jPlayer.event.ended, audio_ended);

    // Start routing
    hasher.initialized.add(parse_hash);
    hasher.changed.add(parse_hash);

    hasher.prependHash = "";

    hasher.init();
});

