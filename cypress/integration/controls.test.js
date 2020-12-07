/// <reference types="cypress" />

const controlStates = {
  playing: 4, // 0100,
  firstStep: 3, // 0011,
  step: 15, // 1111,
  lastStep: 13, // 1101
};

const controlMap = [
  { key: "back", flag: 8 },
  { key: "stop", flag: 4 },
  { key: "fwd", flag: 2 },
];

context("VS.control", () => {
  function assertControlState(name, controlState) {
    cy.window().then((win) => {
      const { VS } = win;

      let result = controlMap.reduce(function (mask, pair) {
        return !VS.control[pair.key].disabled ? mask | pair.flag : mask;
      }, 0);

      result |= VS.control.play.classList.contains("pause") ? 0 : 1;

      //return result
      assert.equal(result, controlState, name);
    });
  }
  function assertPointerPosition(name, position) {
    cy.window().then((win) => {
      const { VS } = win;
      assert.equal(+VS.control.pointer.value, position, name);
    });
  }

  beforeEach(() => {
    cy.visit("localhost:8081/tutorial");
  });

  it("sets expected control state on UI interaction", () => {
    // on load
    assertControlState(
      "show controls matching firstStep state on load",
      controlStates.firstStep
    );
    assertPointerPosition("show pointer at 0 on load", 0);

    cy.get("#score-play").click();
    assertControlState(
      "show controls matching playing state after clicking play",
      controlStates.playing
    );

    cy.get("#score-play").click();
    assertControlState(
      "show controls matching firstStep state when paused on first score event",
      controlStates.firstStep
    );

    cy.get("#score-fwd").click();
    assertControlState(
      "show controls matching step state after clicking forward",
      controlStates.step
    );
    assertPointerPosition("show pointer at 1 after clicking forward", 1);

    cy.get("#score-stop").click();
    assertControlState(
      "show controls matching step firstStep after clicking stop",
      controlStates.firstStep
    );
    assertPointerPosition("show pointer at 0 after clicking stop", 0);
  });
});

//loadDomThenTest('VS.control keyboard control', htmlPath, (t, window) => {
//    const { VS } = window
//
//    function makeKeydownEvent(eventObject) {
//        return () => {
//            const keydownEvent = new window.KeyboardEvent('keydown', eventObject)
//            window.document.dispatchEvent(keydownEvent)
//        }
//    }
//
//    const hitLeftArrow = makeKeydownEvent({ key: 'ArrowLeft' })
//    const hitSpacebar = makeKeydownEvent({ key: ' ' })
//    const hitEscape = makeKeydownEvent({ key: 'Escape' })
//    const hitRightArrow = makeKeydownEvent({ key: 'ArrowRight' })
//
//    hitSpacebar()
//    t.equal(VS.score.isPlaying(), true, 'should play score after hitting spacebar')
//
//    hitRightArrow()
//    t.equal(+VS.control.pointer.value, 0, 'should not change pointer at hitting right arrow while playing')
//
//    // Pause
//    hitSpacebar()
//    t.equal(VS.score.isPlaying(), false, 'should pause score after hitting spacebar again')
//
//    hitRightArrow()
//    hitRightArrow()
//    t.equal(+VS.control.pointer.value, 2, 'should show pointer at 2 after hitting right arrow twice')
//
//    hitLeftArrow()
//    t.equal(+VS.control.pointer.value, 1, 'should show pointer at 1 after hitting left arrow')
//
//    hitSpacebar()
//    hitEscape()
//    t.equal(VS.score.isPlaying(), false, 'should pause score after hitting spacebar again')
//    t.equal(+VS.control.pointer.value, 0, 'should show pointer at 0 after hitting escape key')
//
//    t.end()
//})
