module.exports = (data) =>
  `<footer id="score-footer"><!--
--><button id="score-back" class="score-button" title="Step score pointer -1">
        <svg viewBox="0 0 128 128" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="back">
                <path d="M87.6339768,2.29522716 C87.6339768,2.29522716 88.3049233,3.45724886 89.1309373,4.8878341 L141.567017,95.7026202 C142.393765,97.1344775 141.722084,98.2952272 140.070056,98.2952272 L35.1978974,98.2952272" transform="translate(87.634006, 51.054823) scale(-1, 1) rotate(-30.000000) translate(-87.634006, -51.054823) "></path>
            </g>
        </svg>
    </button><!--
 --><button id="score-play" class="score-button" title="Play/pause score">
        <svg viewBox="0 0 128 128" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="play">
                <path d="M62.7434149,18.1198759 C63.5701633,16.6880186 64.9113219,16.6892907 65.7373358,18.1198759 L118.173415,108.934662 C119.000164,110.366519 118.328483,111.527269 116.676455,111.527269 L11.804296,111.527269 C10.1507991,111.527269 9.48132156,110.365247 10.3073355,108.934662 L62.7434149,18.1198759 Z" transform="translate(64.240405, 64.286864) rotate(90.000000) translate(-64.240405, -64.286864) "></path>
            </g>
            <g id="pause">
                <path d="M85,10 L85,118.57"></path>
                <path d="M43,10 L43,118.57"></path>
            </g>
        </svg>
    </button><!--
 --><button id="score-stop" class="score-button" title="Stop score">
        <svg viewBox="0 0 128 128" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="stop">
                <rect x="17" y="17" width="94.4800034" height="94.4800034" rx="3"></rect>
            </g>
        </svg>
    </button><!--
 --><button id="score-fwd" class="score-button" title="Step score pointer +1">
        <svg viewBox="0 0 128 128" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="fwd">
                <path d="M41.6339768,2.29522716 C41.6339768,2.29522716 42.3049233,3.45724886 43.1309373,4.8878341 L95.5670167,95.7026202 C96.3937651,97.1344775 95.7220841,98.2952272 94.0700562,98.2952272 L-10.8021026,98.2952272" transform="translate(41.634006, 51.054823) rotate(-30.000000) translate(-41.634006, -51.054823) "></path>
            </g>
        </svg>
    </button><!--
 --><input id="score-pointer" type="number" value="0" pattern="\d*" readonly="true" title="Score pointer" /><!-- step="1" --><!--
 -->${
   data.options || data.options_file
     ? `<button id="score-options-open" class="score-button" title="Score options">
         <svg viewBox="0 0 128 128" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
             <g id="score-options-icon">
                 <path d="M17,10 L17,118.57"></path>
                 <path d="M1.25,25.75 L32.75,25.75"></path>

                 <path d="M64.24,10 L64.24,118.57"></path>
                 <path d="M48.49,102.82 L79.99,102.82"></path>

                 <path d="M111.48,10 L111.48,118.57"></path>
                 <path d="M95.73,64.285 L127.23,64.285"></path>
             </g>
         </svg>
    </button>`
     : ""
 }
</footer>`;
