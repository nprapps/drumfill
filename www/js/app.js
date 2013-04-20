var $sections;
var $home_screen;
var $question_screen;
var $game_screen;
var $round_summary_screen;
var $challenge_friend_screen;
var $jplayer;

// Index
crossroads.addRoute('', function() {
    $home_screen.show();
});

// Quest
crossroads.addRoute('quest', function() {
    $quest_screen.show();
});

// Turn
crossroads.addRoute('game', function() {
    $game_screen.show();
    play_audio("audio/20090115_atc_13.mp3");
});

// Round over
crossroads.addRoute('round-summary', function() {
    $round_summary_screen.show();
});

// Challenge
crossroads.addRoute('challenge-friend', function() {
    $challenge_friend_screen.show();
});

function parse_hash(new_hash, old_hash) {
    crossroads.parse(new_hash);
}

function clear_screen() {
    $sections.hide();
}

function play_audio(filename) {
    $jplayer.jPlayer("setMedia", {
        mp3: filename
    }).jPlayer("play");
}

crossroads.routed.add(console.log, console);
crossroads.routed.add(function() {
    clear_screen();
});

hasher.initialized.add(parse_hash);
hasher.changed.add(parse_hash);

$(function() {
    $home_screen = $("#home-screen");
    $game_screen = $("#game-screen");
    $quest_screen = $("#quest-screen");
    $round_summary_screen = $("#round-summary-screen");
    $challenge_friend_screen = $("#challenge-friend-screen");

    $jplayer = $("#pop-audio");

    $jplayer.jPlayer({
        supplied: "mp3"
    });

    var popcorn = Popcorn('#jp_audio_0');

    hasher.init();
});

