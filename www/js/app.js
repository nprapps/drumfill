// Index
var index_page = crossroads.addRoute('', function() {
});

// Quest
var quest_page = crossroads.addRoute('quest', function() {
});

// Turn
var turn_page = crossroads.addRoute('turn', function() {
    var $player = $("#pop-audio");

    $player.jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: "audio/20090115_atc_13.mp3"
            }).jPlayer("pause");
        },
        swfPath: "js",
        supplied: "mp3"
    });

    // associate jPlayer with Popcorn
    var popcorn = Popcorn('#jp_audio_0');
});

// Round over
var round_over_page = crossroads.addRoute('round-over', function() {
});

// Challenge
var challenge_page = crossroads.addRoute('challenge', function() {
});

function parse_hash(new_hash, old_hash) {
    crossroads.parse(new_hash);
}

function clear_page() {
    console.log("Clearing the page");
}

crossroads.routed.add(console.log, console);
crossroads.routed.add(function() {
    clear_page();
});

hasher.initialized.add(parse_hash);
hasher.changed.add(parse_hash);
hasher.init();

