if (VS.page.footer) {

    VS.control = (function () {

        function ScoreControl(id, fn) {
            this.element = document.getElementById(id);
            this.element.onclick = fn;
        }
        ScoreControl.prototype.enable = function() {
            this.element.className = "enabled";
        };
        ScoreControl.prototype.disable = function() {
            this.element.className = "disabled";
        };

        var play = new ScoreControl("score-play", VS.score.playPause);
        play.setPlay = function(){ this.element.textContent = "\u25b9"; };
        play.setPause = function(){ this.element.textContent = "\u2016"; };

        return {
            play: play,
            stop: new ScoreControl("score-stop", VS.score.stop),
            fwd: new ScoreControl("score-fwd", function(){ stepPointer(1); }),
            back: new ScoreControl("score-back", function(){ stepPointer(-1); }),
            pointer: new ScoreControl("score-pointer", VS.score.pause),
            updateStepButtons: function() {
                if(VS.score.pointer === 0) {
                    this.back.disable();
                    this.fwd.enable();
                } else if(VS.score.pointer === (VS.score.getLength() - 1)) {
                    this.back.enable();
                    this.fwd.disable();
                } else {
                    this.back.enable();
                    this.fwd.enable();
                }
            }
        };

    })();

    VS.control.play.enable();
    VS.control.fwd.enable();
}

function updatePointer(ndex){ // score, control
    VS.score.pointer = ndex;
    VS.control.pointer.element.value = ndex;
}

function stepPointer(num){ // score, control
    if(!VS.score.playing) { // don't allow skip while playing, for now
        updatePointer(Math.min(Math.max(VS.score.pointer + num, 0), VS.score.getLength() - 1));
        VS.control.updateStepButtons();
    }
}
