if (typeof Aug == "undefined") {
    var Aug = {};
}
(function() {
    var SelectInput = { _containerClass: "augus-SelectInput-container", _tierClass: "augus-SelectInput-tier" };
    SelectInput.createSelectInputBuilder = function () {
        var result = {};
        var containerClass = SelectInput._containerClass + (new Date().getTime() % (1000 * 60 * 60));
        var containerClassArr = SelectInput._containerClass + " " + containerClass;
        var containerCss = {//框框的样式
            "display": "none",
            "position": "absolute",
            "background-color": "white",
            "max-height": "100px",
            "border":"1px solid #cccccc",
            "overflow": "auto"
        }
        var tierClass = SelectInput._tierClass + (new Date().getTime() % (1000 * 60 * 60));
        var tierClassArr = SelectInput._tierClass + " " + tierClass;
        var tierCss = {
            "outline": "0",
            "background-color": "white",
            "padding": "5px 10px",
            "color": "black"
        }
        result.addContainerCss = function (css) {
            for (var key in css) {
                containerCss[key] = css[key];
            }
        }

        result.addContainerClass = function (Class) {
            if (typeof Class == "string") {
                containerClass += " " + Class;
            }
        }
        result.addTierCss = function (css) {
            for (var key in css) {
                tierCss[key] = css[key];
            }
        }
        result.addTierClass = function (Class) {
            if (typeof Class == "string") {
                tierClass += " " + Class;
            }
        }
        var tierFocusCss = {
            "background-color": "blue",
            "color": "white"
        }
        var tierFocusCssBack = {}
        result.addtierFocusCss = function (css) {
            for (var key in css) {
                tierFocusCss[key] = css[key];
            }
        }
        function createContainer() {
            var tag = $("<ul>");
            tag.addClass(containerClassArr);
            tag.attr("hidefocus", "true")
            tag.css(containerCss);
            return tag;
        }
        function createTier(content) {
            var tag = $("<li>");
            tag.addClass(tierClassArr);
            tag.css(tierCss);
            tag.attr("tabindex", "0")
            tag.attr("hidefocus", "true")
            tag.html(content);
            return tag;
        }
        //覆盖input获得值的过程；
        var checkGet = null;
        result.checkGet = function (fun) {
            checkGet = fun;
        }
        result.installSelectInput = function (input) {
            input = $(input);
            var container = createContainer();
            input.after(container);
            var selectInput = {};
            function show() {
                container.show();
            }
            function hide() {
                container.hide();
            }
            selectInput.addContent = function (content, attr) {
                var tier = null;
                if (typeof content == "object") {
                    tier = createTier("");
                    tier.append(content)
                } else {
                    tier = createTier(content);
                }
                function inputGet(input, tier) {
                    if (checkGet) {
                        checkGet(input, tier);
                    } else {
                        input.val(tier.html());
                    }
                    hide();
                }
                tier.mousemove(function (e) {
                    if (!tier.is(":focus"))
                        tier.focus()
                });
                tier.focusin(function (e) {
                    show();
                    for (var key in tierFocusCss) {
                        tierFocusCssBack[key] = tier.css(key);
                    }
                    tier.css(tierFocusCss);
                });
                tier.focusout(function (e) {
                    tier.css(tierFocusCssBack);
                    tierFocusCssBack = {};
                });

                tier.click(function (e) {
                    inputGet(input, tier);
                });

                tier.keydown(function (e) {
                    if (e.keyCode == 13) {
                        inputGet(input, tier);
                    } else if (e.keyCode == 38) {
                        tier.prev().focus();
                    } else if (e.keyCode == 40) {
                        tier.next().focus();
                    }
                    return false;

                });

                for (var key in attr) {
                    tier.attr(key, attr[key]);
                }
                container.append(tier);
                return tier;
            }
            input.keyup(function (e) {
                show();
                if (e.keyCode == 38 || e.keyCode == 40) {
                    container.children(":first").focus();
                }
            })
            input.click(function (e) {
                show();
            })

            selectInput.clear = function () {
                container.html("");
            }
            container.css("left", input.position().left)

            $(document).click(function (e) {
                if (!$(e.target).is(input)) {
                    hide();
                }
            })
            return selectInput;
        }
        return result
    }
    Aug.SelectInput = SelectInput;
} )();