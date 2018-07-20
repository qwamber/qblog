require('../style/master.less');
require('../style/index.less');
let noRestrictionsIconSource = require('../res/index/no-restrictions-icon.png');
let beautifulIconSource = require('../res/index/beautiful-icon.png');
let openSourceIconSource = require('../res/index/open-source-icon.png');

/**
 * Is called when the body loads. Initializes the page.
 */
window.onLoadInit = function onLoadBodyInit() {
    console.log(noRestrictionsIconSource);
    document.getElementById(
        'no-restrictions-icon',
    ).src = noRestrictionsIconSource;
    document.getElementById('open-source-icon').src = openSourceIconSource;
    document.getElementById('beautiful-icon').src = beautifulIconSource;
};
