// Constants
var COUNTDOWN = 10 * 1000;
var COUNTDOWN_INTERVAL = COUNTDOWN / 200;
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
var $begin_quest_button;
var $challenge_friend_button;
var $back_to_start_button;
var $back_to_summary_button;
var $next_turn_button;
var $finish_round_button;
var $play_again_button;

var $turn_mode;
var $after_turn_mode;
var $question;
var $answer;
var $points_won;
var $story_title;
var $story_program;
var $story_date;
var $game_buttons;
var $game_score;
var $max_score;
var $turn_number;
var $turn_count;
var $point_explanations;
var $top_points;
var $mid_points;
var $low_points;
var $no_points;
var $no_points_times_up;
var $countdown_bar;
var $countdown_bar_progress;
var $countdown_lives;

// Game state
var current_turn = 0;
var current_question = null;
var current_score = 0;
var current_question_value = 0;
var countdown_timer = null;
var countdown_start = null;

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
    current_score = 0;
    $turn_count.text(QUESTIONS.length);
    $max_score.text(QUESTIONS.length * MAX_QUESTION_VALUE)

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
    countdown_start = Date.now();
    countdown_timer = setTimeout(countdown_interval_over, COUNTDOWN_INTERVAL);
}

function countdown_interval_over() {
    var now = Date.now();
    var elapsed = now - countdown_start;

    if (elapsed > COUNTDOWN) {
        countdown_over();
    } else {
        var pct = elapsed / COUNTDOWN * 100;
        $countdown_bar_progress.width(pct + "%");

        countdown_timer = setTimeout(countdown_interval_over, COUNTDOWN_INTERVAL);
    }
}

function countdown_over($hide_button) {
    current_question_value -= 1;

    if (current_question_value > 0) {
        // Hide the clicked button
        if ($hide_button) {
            $hide_button.addClass('btn-invalid');
            // Hide a random button
        } else {
            var $wrong_buttons = [];
            var $num_buttons = $game_buttons.length;

            for (var i = 0; i < $num_buttons; i++) {
                $button = $game_buttons.eq(i);
                if (($button.hasClass('btn-invalid') == false) && ($button.text() !=current_question.answer)) {
                    $wrong_buttons.push($button);
                }
            }
            shuffle($wrong_buttons);
            $wrong_buttons[0].addClass('btn-invalid');
        }

        reset_countdown_bar();

        countdown_start = Date.now();
        countdown_timer = setTimeout(countdown_interval_over, COUNTDOWN_INTERVAL);
    } else {
        $game_buttons.hide();
        countdown_timer = null;

        score_points()

        $turn_mode.hide();
        $after_turn_mode.show();
    }
}

function reset_countdown_bar() {
   $countdown_bar.removeClass("top-progress mid-progress low-progress");
    $countdown_bar_progress.width("0%");

    $countdown_lives.removeClass("icon-star-empty");
    $countdown_lives.addClass("icon-star");
 
    if (current_question_value == 3) {
        $countdown_bar.addClass("top-progress");
    } else if (current_question_value == 2) {
        $countdown_bar.addClass("mid-progress");
        $countdown_lives.slice(0, 1).removeClass("icon-star").addClass("icon-star-empty");
    } else if (current_question_value == 1) {
        $countdown_bar.addClass("low-progress");
        $countdown_lives.slice(0, 2).removeClass("icon-star").addClass("icon-star-empty");
    }
}

function choice_clicked() {
    if ($(this).hasClass('btn-invalid')) {
        return;
    }
    // Right answer
    if ($(this).text() == current_question.answer) {
        clearTimeout(countdown_timer);
        countdown_timer = null;

        score_points()

        $turn_mode.hide();
        $after_turn_mode.show();
    // Wrong answer
    } else {
        clearTimeout(countdown_timer);
        countdown_over($(this));
    }
}

function score_points() {
    current_score += current_question_value;
    $points_won.text(current_question_value);
    $game_score.text(current_score);

    $point_explanations.hide();

    if (current_question_value == 3) {
        $top_points.show();
    } else if (current_question_value == 2) {
        $mid_points.show();
    } else if (current_question_value == 1) {
        $low_points.show();
    } else {
        $no_points.show();
    }
    
    var at_end = current_turn == QUESTIONS.length;

    $next_turn_button.toggle(!at_end);
    $finish_round_button.toggle(at_end);
}

function next_turn() {
    current_turn += 1;
    $game_buttons.removeClass('btn-invalid');

    if (current_turn <= QUESTIONS.length) {
        $turn_number.text(current_turn);
        current_question = QUESTIONS[current_turn - 1];

        $after_turn_mode.hide();
        $turn_mode.show();

        $question.text(current_question.question);
        $answer.text(current_question.answer);
        $story_title.text(current_question.title);
        $story_program.text(current_question.program);
        $story_date.text(current_question.date);

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
        reset_countdown_bar();

        // See audio playing for more turn setup
        play_audio("audio/" + current_question.audio);
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
    $begin_quest_button = $("#begin-quest");
    $challenge_friend_button = $("#challenge-friend");
    $back_to_start_button = $("#back-to-start");
    $back_to_summary_button = $("#back-to-summary");
    $next_turn_button = $("#next-turn");
    $finish_round_button = $("#finish-round");
    $play_again_button = $("#play-again");

    $turn_mode = $("#turn-mode");
    $after_turn_mode = $("#after-turn-mode");
    $question = $("#question");
    $answer = $("#correct-answer .answer");
    $points_won = $("#points-won");
    $story_title = $("#story-title");
    $story_program = $("#story-program");
    $story_date = $("#story-date");
    $game_buttons = $("#game-buttons button");
    $game_score = $(".score");
    $max_score = $(".max-score");
    $turn_number = $("#turn-number");
    $turn_count = $("#turn-count");
    $point_explanations = $(".point-explanation");
    $top_points = $("#top-points");
    $mid_points = $("#mid-points");
    $low_points = $("#low-points");
    $no_points = $("#no-points");
    $no_points_times_up = $("#no-points-times_up");
    $countdown_bar = $("#countdown-bar");
    $countdown_bar_progress = $("#countdown-bar-progress");
    $countdown_lives = $("#countdown-lives i");

    // Routing events 
    $quick_play_button.click(function() {
        hasher.setHash("game");
    });

    $start_quest_button.click(function() {
        hasher.setHash("quest");
    });
    
    $begin_quest_button.click(function() {
        hasher.setHash("game");
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

    $play_again_button.click(function() {
        hasher.setHash("game");
    });

    $next_turn_button.click(next_turn);
    $finish_round_button.click(next_turn);
    
    // Gameplay events
    $game_buttons.click(choice_clicked);

    // Audio setup
    $jplayer = $("#pop-audio");

    $jplayer.jPlayer({
        supplied: "mp3"
    });

    //$jplayer.jPlayer("mute", true);

    // Audio events
    $jplayer.bind($.jPlayer.event.play, audio_playing);
    $jplayer.bind($.jPlayer.event.ended, audio_ended);

    // Start routing
    hasher.initialized.add(parse_hash);
    hasher.changed.add(parse_hash);

    hasher.prependHash = "";

    hasher.init();
});

