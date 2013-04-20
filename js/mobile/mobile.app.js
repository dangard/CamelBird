var Mobile = (function(){
    var config = {
        debug: false
    },
    setConfig = function (k,v) {
        config[k] = v;
        common.log("config: ", config);
    },
    common = (function(){
        isUndefined = function (v) {
            if ( typeof(v) === 'undefined' ) {
                return true;
            }
            return false;
        },
        isEmpty = function (v) {
            if (isUndefined(v) || v === "" || v.length === 0) {
                return true;
            }
            return false;
        },
        log = function (msg,obj) {
            if (config.debug) {
                if (!isUndefined(console)) {
                    if (!isEmpty(msg) && !isUndefined(obj)) {
                        console.log(msg,obj);
                    } else if (!isEmpty(msg)) {
                        console.log(msg);
                    } else {
                        console.log("Generic error!");
                    }
                } else {
                    // Console id undefined!
                }
            }
        },
/*      Setup a JQuery Mobile Page event callbacks
        Paramaters:
        pageName - Id of the page in them dom.
        createCb - The pagecreate callback function.
        showCb - The pageshow callback function.
        hideCb - The pagehide callback function.*/
        pageSetup = function (pageName, createCb, showCb, hideCb) {
            if (!isEmpty(pageName)) {
                log("Setting up page: ", pageName);
                $(pageName).on("pagecreate", function(evt){
                    if (!isUndefined(createCb)) {
                        createCb(pageName);
                    } else {
                        log("Page create called for ", pageName);
                    }
                });
                $(pageName).on("pageshow", function(evt){
                    if (!isUndefined(showCb)) {
                        showCb(pageName);
                    } else {
                        log("Page show called for ", pageName);
                    }
                });
                $(pageName).on("pagehide", function(evt){
                    if (!isUndefined(hideCb)) {
                        hideCb(pageName);
                    } else {
                        log("Page hide called for ", pageName);
                    }
                });
            }
        };
        return {
            isUndefined: isUndefined,
            isEmpty: isEmpty,
            log: log,
            pageSetup: pageSetup
        }
    })(),
    init = function (pages) {
        common.log("Initializing....");
        var pages = pages;
        // Setup page and page callbacks map.
        if (common.isUndefined) {
            pages = {
                '#welcome': {},
                '#about': {},
                '#sample_form': {
                    create: function (pageName) {
                        $("#formButton").click(function(evt){
                            common.log("Click event, target: ", evt.currentTarget);
                            $('input[name="first_name"]', pageName).val("Snoopy!");
                            evt.preventDefault();
                        });
                    }
                }
            };
        }

        common.log("Pages map: ", pages);
        // Iterate over pages map and setup the callbacks.
        for ( var i in pages) {
            var page = i, pageCbs = pages[page],
            createCb = (common.isUndefined(pageCbs.create)) ? undefined : pageCbs.create,
            showCb = (common.isUndefined(pageCbs.show)) ? undefined : pageCbs.show,
            hideCb = (common.isUndefined(pageCbs.hide)) ? undefined : pageCbs.hide;

            common.log("Page: ", page);
            common.log("Page callbacks: ", pageCbs);

            // Invoke the pagesetup method for each page.
            common.pageSetup(page,createCb,showCb,hideCb);
        }1
    };
    return {
        common: common,
        init: init,
        setConfig: setConfig
    }
})();