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
var doc = document,rgtClickContextMenu;
    doc.oncontextmenu = function(e) {
    var element = e.target;
        if (element.tagName.toLocaleLowerCase() !== "select") {
            return;
        }
        e.preventDefault();
        var filterString = window.prompt("xFilta", "");
        if (filterString) {
            filterSelectContent(filterString, element);
        } else {
            resetFilteredContent(element);
        }
};
    function resetFilteredContent(select) {
        var option;
        for (var optionIdx = 0; optionIdx < select.length; optionIdx++) {
            option = select[optionIdx];
            option.style.display = ""; //"none"
            option.disabled = false;
        }
    };
    function filterSelectContent(f_word, select) {
        var option, optionValue;
        f_word = f_word.toLowerCase();
        console.log("filterSelectContent", f_word, select);
        if (!f_word) {
            self.resetFilteredContent(select);
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
    };
})();