//for efficiency i'm just going to store everything as keycodes, but you can run it throough ../keyboard/KeyCode.js to get the nice names
//also it isn't a constant :(
let keyMaps = localStorage.getItem('keys');
export default keyMaps = keyMaps ? JSON.parse(keyMaps) : {
    'Up':{'codes':[38,73]},
    'Down':{'codes':[40,75]},
    'Left':{'codes':[37,74]},
    'Right':{'codes':[39,76]},
    'Z':{'codes':[90],'fireOnce':true},
    'Solid Brush':{'codes':[65]},
    'Scenery Brush':{'codes':[83]},
    'Solid Line':{'codes':[81]},
    'Scenery Line':{'codes':[87]},
    'Eraser':{'codes':[69]},
    'Toggle Grid Snapping':{'codes':[71]},
    'Target':{'codes':[1108]},
    'Checkpoint':{'codes':[1091]},
    'Boost':{'codes':[1090]},
    'Gravity':{'codes':[1095]},
    'Bomb':{'codes':[1103]},
    'Slow-Motion':{'codes':[1107]},
    'Start Position':{'codes':[80]},
    'Pause':{'codes':[32]},
    'Restart':{'codes':[13]},
    'Cancel Checkpoint':{'codes':[8],'repeat':true},
    'Switch Bike':{'codes':[322]},
    'Focus ghost':{'codes':[327]},
    'Camera':{'codes':[82]},
    'Toggle Fullscreen':{'codes':[70]},
    'Undo':{'codes':[77],'repeat':true},
    'Redo':{'codes':[78],'repeat':true},
}