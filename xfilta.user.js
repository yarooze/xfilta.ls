// ==UserScript==
// @name        Select Filta X
// namespace    https://github.com/yarooze/xfilta.ls
// @version     0.0.2
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
                    //alert(element.tagName);
                    if (["select"].indexOf(element.tagName.toLocaleLowerCase()) === -1) { //, "option"
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

                var i, iframes = el.getElementsByTagName('iframe');
                //console.log("iframes in ", el, iframes.length);
                if (iframes && iframes.length) {
                    for(i=0; i<iframes.length; i++) {
                        var iframeDocument = iframes[i].contentDocument || iframes[i].contentWindow.document;
                        if (typeof cb == 'function') {
                            cb(iframeDocument, XFILTA.findFrames);
                        }
                    }
                }
                var frames = el.getElementsByTagName("frame");
                //console.log("frames in ", el, frames.length);
                for(i=0; i<frames.length; i++) {
                    if (frames && frames.length) {
                        var frameDocument = frames[i].contentDocument || frames[i].contentWindow.document;
                        if (typeof cb == 'function') {
                            cb(frameDocument, XFILTA.findFrames);
                        }
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
                console.log("XFILTA searching for frames in", document);
                XFILTA.findFrames(document, XFILTA.findFrames);
            }, 10000);
            console.log("XFILTA start");
        }
    };

    XFILTA.start();
})();