// TODO create timed events, log to console as tests to get pace down

function addTrash(n) {
    for (var i = 0; i < n; i++) {
        var type = VS.getItem(["embers", "crackle", "blaze", "scrape"]);
        trash.push({
            active: true,
            size: VS.getRandExcl(25, 75),
            type: type
        });
    }
    updateTrash();
}
function removeTrash(n) {
    for (var i = 0; i < n; i++) {
        trash.pop();
    }
    updateTrash();
}

// function fireCycle() {
//     var cycle = [];
//
//     // always start with fire
//     cycle.push("fire");
//
//     // 0–3 bangs
//     var bangs = ["bang", "bang", "bang"];
//     // var nBangs = Math.floor(VS.getRandExcl(0,4));
//     var nBangs = VS.getWeightedItem([0, 1, 2, 3], [15, 50, 15, 10]);
//     cycle.push(bangs.splice(0, nBangs));
//
//     // end with one or none of:
//     var end = ["fire", "multi-fire", "embers"];
//     var endIndex = VS.getWeightedItem([-1, 0, 1, 2], [25, 25, 25, 25]);
//     if (endIndex !== -1) {
//         cycle.push(end[endIndex]);
//     }
//
//     return cycle;
// }
