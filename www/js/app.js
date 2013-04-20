$(function() {
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
