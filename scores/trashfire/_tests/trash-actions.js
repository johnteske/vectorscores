const path = require("path");
const { loadDomThenTest } = require(path.resolve(".", "bin/js/tape-setup"));

loadDomThenTest(
  "trashfire",
  "_site/scores/trashfire/index.html",
  (t, window) => {
    const { addTrash, removeTrash, emptyTrash, copyTrash } = window;

    const trashes1 = [
      [1, 2],
      [1, 2, 3],
    ];
    const newTrashes1 = addTrash(trashes1, 4, (d) => d);
    t.deepEquals(
      newTrashes1,
      [
        [1, 2],
        [1, 2, 3],
        [1, 2, 3, 4],
      ],
      "addTrash should push a copy of the last bar with an element added"
    );

    const trashes2 = [
      [1, 2],
      [1, 2, 3],
    ];
    const newTrashes2 = removeTrash(trashes2);
    t.deepEquals(
      newTrashes2,
      [
        [1, 2],
        [1, 2, 3],
        [2, 3],
      ],
      "removeTrash should push a copy of the last bar with the first element removed"
    );

    const trashes3 = [
      [1, 2],
      [1, 2, 3],
    ];
    const newTrashes3 = emptyTrash(trashes3);
    t.deepEquals(
      newTrashes3,
      [[1, 2], [1, 2, 3], []],
      "emptyTrash should push an empty array"
    );

    const trashes4 = [
      [1, 2],
      [1, 2, 3],
    ];
    const newTrashes4 = copyTrash(trashes4);
    t.deepEquals(
      newTrashes4,
      [
        [1, 2],
        [1, 2, 3],
        [1, 2, 3],
      ],
      "copyTrash should push a copy of the last bar"
    );

    t.end();
  }
);
