// /**
//  * TODO remove
//  */
//  /**
//   * Globjects
//   */
//  d3.selectAll('.globject').remove();
//
//  globjectContainer.selectAll('.globject')
//      .data(bar.pitched.globjects)
//      .enter()
//      .append('g')
//      .each(globject)
//      .each(function(d) {
//          var content = d3.select(this).select('.globject-content');
//
//          if (bar.pitched.phraseType === 'ascending') {
//              content.append('rect')
//                  .attr('width', d.width)
//                  .attr('height', globjectHeight + 10)
//                  .attr('fill', 'url(#ascending-fill)');
//          }
//
//          var lineCloud = VS.lineCloud()
//              .duration(bar.pitched.duration)
//              // TODO shape over time for each PC set, not by last set
//              .phrase(makePhrase(bar.pitched.phraseType, bar.pitched.pitch[bar.pitched.pitch.length - 1].classes))
//              .transposition('octave')
//              .curve(d3.curveCardinal)
//              .width(d.width)
//              .height(globjectHeight);
//
//          content.call(lineCloud, { n: Math.floor(bar.pitched.duration) });
//
//          content.selectAll('.line-cloud-path')
//              .attr('stroke', 'grey')
//              .attr('stroke-dasharray', bar.pitched.phraseType === 'ascending' ? '1' : 'none')
//              .attr('fill', 'none');
//      })
//      .each(function(d) {
//          var selection = d3.select(this);
//
//          var g = selection.append('g'),
//              pitch = bar.pitched.pitch,
//              text;
//
//          for (var i = 0; i < pitch.length; i++) {
//              text = g.append('text')
//                  .attr('dy', '-1.5em')
//                  .attr('x', pitch[i].time * d.width)
//                  .attr('text-anchor', textAnchor(pitch[i].time));
//
//              var set = VS.pitchClass.transpose(pitch[i].classes, transposeBy).map(function(pc) {
//                  return VS.pitchClass.format(pc, scoreSettings.pitchClasses.display, scoreSettings.pitchClasses.preference);
//              });
//              var formatted = '{' + set + '}';
//
//              text.text(formatted)
//                  .attr('class', 'pitch-class');
//          }
//
//          /**
//           * Dynamics
//           */
//          if (bar.pitched.dynamics) {
//              selection.append('g')
//                  .attr('transform', 'translate(0,' + globjectHeight + ')')
//                  .selectAll('.dynamic')
//                  .data(bar.pitched.dynamics)
//                  .enter()
//                  .append('text')
//                      .attr('class', 'dynamic')
//                      .attr('x', function(d, i) {
//                          return globjectWidth * d.time;
//                      })
//                      .attr('dy', '1em')
//                      .attr('text-anchor', function(d) {
//                          return textAnchor(d.time);
//                      })
//                      .text(function(d) {
//                          return dynamics[d.value];
//                      });
//          }
//      });
//
//  /**
//   * Duration
//   */
//  durationText.text(bar.pitched.duration + (bar.pitched.duration ? '\u2033' : ''));

 /**
  * Rest
  */
 var rest = d3.select('.rest').remove();

 if (bar.pitched.phraseType === 'rest') {
     rest = globjectContainer.append('text')
         .attr('class', 'rest');
     rest.append('tspan')
         .attr('x', globjectWidth * 0.5)
         .attr('y', (globjectHeight * 0.5) - 20)
         .text('\ue4c6');
     rest.append('tspan')
         .attr('x', globjectWidth * 0.5)
         .attr('y', globjectHeight * 0.5)
         .text('\ue4e5');
 }

 /**
  * Tempo
  */
 var tempo = bar.percussion.tempo;

 tempoText.select('.bpm').remove();

 tempoText.append('tspan')
     .attr('class', 'bpm')
     .text(' = ' + tempo);

 percussionParts
     // .transition().duration(300) // TODO fade in/out as part of event, not on start of event
     .style('opacity', tempo ? 1 : 0);
