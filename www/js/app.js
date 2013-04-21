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
    $game_screen.show();
// sorry -- for my sanity    play_audio("audio/20090115_atc_13.mp3");
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

hasher.initialized.add(parse_hash);
hasher.changed.add(parse_hash);

hasher.prependHash = "";

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

    // Event handlers
    $quick_play_button.click(function() {
        hasher.setHash("game");
    });

    $start_quest_button.click(function() {
        hasher.setHash("quest");
    });

    // temp
    $("#game-buttons button").click(function() {
        hasher.setHash("round-summary");
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

    // Audio
    $jplayer = $("#pop-audio");

    $jplayer.jPlayer({
        supplied: "mp3"
    });

    var popcorn = Popcorn('#jp_audio_0');

    // Start routing
    hasher.init();
});

