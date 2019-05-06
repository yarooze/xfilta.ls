// ==UserScript==
// @name        Select Filta X
// namespace    https://github.com/yarooze/xfilta.ls
// @version     0.0.1
// @description Filters options in the select element
// @author      Yarooze
// icon         https://github.com/yarooze/xfilta.ls/raw/master/Icon.png
// updateURL    https://github.com/yarooze/xfilta.ls/raw/master/xfilta.meta.js
// downloadURL  https://github.com/yarooze/xfilta.ls/raw/master/xfilta.user.js
// @match       *://*/*
// @grant       none
// @noframes
// ==/UserScript==
(function() {
    'use strict';

    var XFILTA = {
        findFrames: function (el, cb) {
            setTimeout(function () {
                if (!el) {
                    console.log('No frames. Stop.');
                    return;
                }

                el.oncontextmenu = function(e) {
                    var element = e.target;
                    if (element.tagName.toLocaleLowerCase() !== "select") {
                        return;
                    }
                    e.preventDefault();
                    var filterString = window.prompt("xFilta", "");
                    if (filterString) {
                        XFILTA.filterSelectContent(filterString, element);
                    } else {
                        XFILTA.resetFilteredContent(element);
                    }
                };

                var iframes = el.getElementsByTagName('iframe');
                if (iframes && iframes.length) {
                    var iframeDocument = iframes[0].contentDocument || iframes[0].contentWindow.document;
                    if (typeof cb == 'function') {
                        cb(iframeDocument, XFILTA.findFrames);
                    }
                }

                var frames = el.getElementsByTagName("frame");
                if (frames && frames.length) {
                    var frameDocument = frames[0].contentDocument || frames[0].contentWindow.document;
                    if (typeof cb == 'function') {
                        cb(frameDocument, XFILTA.findFrames);
                    }
                }

            }, 100);
        },
        resetFilteredContent: function (select) {
            var option;
            for (var optionIdx = 0; optionIdx < select.length; optionIdx++) {
                option = select[optionIdx];
                option.style.display = ""; //"none"
                option.disabled = false;
            }
        },
        filterSelectContent: function (f_word, select) {
            var option, optionValue;
            f_word = f_word.toLowerCase();
            if (!f_word) {
                XFILTA.resetFilteredContent(select);
            } else {
                for (var optionIdx = 0; optionIdx < select.length; optionIdx++) {
                    option = select[optionIdx];
                    optionValue = option.textContent;
                    optionValue = optionValue.toLowerCase();

                    if (optionValue.indexOf(f_word) === -1) {
                        option.style.display = "none";
                        option.disabled = "disabled";
                    } else {
                        option.style.display = "";
                        option.disabled = false;
                    }
                }
            }
        },
        start: function () {
            setInterval(function() {
                console.log("XFILTA searching for frames");
                XFILTA.findFrames(document, XFILTA.findFrames);
            }, 10000);
            console.log("XFILTA start");
        }
    };

    XFILTA.start();
})();