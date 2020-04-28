var Microsoft;
(function (Microsoft) {
    var Omnichannel;
    (function (Omnichannel) {
        var LiveChatWidget;
        (function (LiveChatWidget) {
            var HTMLConstants = (function () {
                function HTMLConstants() {
                }
                HTMLConstants.Script = "script";
                HTMLConstants.Head = "head";
                HTMLConstants.Body = "body";
                HTMLConstants.SRC = "src";
                HTMLConstants.DataLcwVersion = "data-lcw-version";
                HTMLConstants.ScriptSelector = "script#";
                HTMLConstants.MicrosoftOmnichannelLCWidget = "Microsoft_Omnichannel_LCWidget";
                return HTMLConstants;
            }());
            LiveChatWidget.HTMLConstants = HTMLConstants;
        })(LiveChatWidget = Omnichannel.LiveChatWidget || (Omnichannel.LiveChatWidget = {}));
    })(Omnichannel = Microsoft.Omnichannel || (Microsoft.Omnichannel = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var Omnichannel;
    (function (Omnichannel) {
        var LiveChatWidget;
        (function (LiveChatWidget) {
            var BootstrapperConstants = (function () {
                function BootstrapperConstants() {
                }
                BootstrapperConstants.BootstrapperIEPolyfillsBaseURL = 'https://polyfill.io/v3/polyfill.min.js';
                BootstrapperConstants.BootstrapperIEPolyfillsFeatures = ["Array.prototype.find", "Array.prototype.findIndex", "Element.prototype.append", "Promise", "Promise.prototype.finally", "Symbol", "fetch", "Event", "Element.prototype.append"];
                return BootstrapperConstants;
            }());
            LiveChatWidget.BootstrapperConstants = BootstrapperConstants;
        })(LiveChatWidget = Omnichannel.LiveChatWidget || (Omnichannel.LiveChatWidget = {}));
    })(Omnichannel = Microsoft.Omnichannel || (Microsoft.Omnichannel = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var Omnichannel;
    (function (Omnichannel) {
        var LiveChatWidget;
        (function (LiveChatWidget) {
            var LiveChatBootstrapper = (function () {
                function LiveChatBootstrapper() {
                    this.InitializerScriptDownloadTriggeredFlag = "isOmniChannelBootstrapperDownloadTriggered";
                }
                LiveChatBootstrapper.prototype.initializeLiveChat = function () {
                    var _this = this;
                    if (!window[this.InitializerScriptDownloadTriggeredFlag] || window[this.InitializerScriptDownloadTriggeredFlag] != true) {
                        window[this.InitializerScriptDownloadTriggeredFlag] = true;
                        var self_1 = this;
                        var onerror_1 = function (e) {
                            console.error("Error loading the Live Chat Initializer Script");
                        };
                        var onload_1 = function () {
                            console.log("Live Chat Initializer Script downloaded");
                        };
                        var bootScript = document.querySelector(LiveChatWidget.HTMLConstants.ScriptSelector + LiveChatWidget.HTMLConstants.MicrosoftOmnichannelLCWidget);
                        var liveChatScriptVersion = bootScript.getAttribute(LiveChatWidget.HTMLConstants.DataLcwVersion);
                        if (!liveChatScriptVersion || liveChatScriptVersion.trim().length === 0) {
                            liveChatScriptVersion = "prod";
                        }
                        var useMinifiedInitializer = !(liveChatScriptVersion !== null && liveChatScriptVersion !== undefined && liveChatScriptVersion.trim().toLowerCase() == "test");
                        var liveChatScriptRoot_1 = bootScript.getAttribute(LiveChatWidget.HTMLConstants.SRC);
                        liveChatScriptRoot_1 = liveChatScriptRoot_1.substring(0, liveChatScriptRoot_1.lastIndexOf("/") + 1);
                        var liveChatInitializerFileNameWithExtension_1 = this.getLiveChatInitializerFileNameWithExtension(useMinifiedInitializer);
                        var useWebChat_1 = false;
                        fetch(liveChatScriptRoot_1.trim().replace("scripts/", "configs/") + liveChatScriptVersion + ".json")
                            .then(function (config) { return config.json(); })
                            .then(function (config) { return useWebChat_1 = config["useWebChat"]; })
                            .then(function () {
                            if (window.location.search.toLowerCase().indexOf("usewebchat=true") !== -1 || (useWebChat_1 && window.location.search.toLowerCase().indexOf("usewebchat=false") === -1)) {
                                liveChatScriptRoot_1 = liveChatScriptRoot_1.replace("scripts", "WebChatControl/scripts");
                                self_1.loadJSResource(liveChatScriptRoot_1.trim() + "LiveChatBootstrapper.js", function () { return new window["Microsoft"]["Omnichannel"]["LiveChatWidget"].LiveChatBootstrapperWebChat().initializeLiveChat(); }, null);
                            }
                            else {
                                var libRoot = liveChatScriptRoot_1.trim().replace("scripts/", "lib/");
                                var liveChatAllLIbsPath = libRoot.trim() + "LiveChatWidgetLibs.min.js";
                                var libsResourceOnload = function () {
                                    console.log("Downloaded Libs successfully");
                                    var liveChatInitializerPath = liveChatScriptRoot_1.trim() + liveChatInitializerFileNameWithExtension_1;
                                    var scriptResource = document.createElement(LiveChatWidget.HTMLConstants.Script);
                                    self_1.loadJSResource(liveChatInitializerPath, onload_1, onerror_1);
                                };
                                var libsResourceOnerror = function () {
                                    console.log("Failed downloading Libs");
                                };
                                _this.loadJSResource(liveChatAllLIbsPath, libsResourceOnload, libsResourceOnerror);
                            }
                        });
                    }
                    else {
                        console.log("Live Chat Initializer download is already triggered");
                    }
                };
                LiveChatBootstrapper.prototype.getLiveChatInitializerFileNameWithExtension = function (useMinifiedInitializer) {
                    if (useMinifiedInitializer) {
                        return "LiveChatWidgetScripts.min.js";
                    }
                    return "LiveChatInitializer.js";
                };
                LiveChatBootstrapper.prototype.loadJSResource = function (path, onload, onerror) {
                    var scriptResource = document.createElement("script");
                    scriptResource.src = path;
                    scriptResource.type = "text/javascript";
                    scriptResource.onload = onload;
                    scriptResource.onerror = onerror;
                    try {
                        document.getElementsByTagName("head")[0].appendChild(scriptResource);
                    }
                    catch (_a) {
                        document.getElementsByTagName("body")[0].appendChild(scriptResource);
                    }
                };
                LiveChatBootstrapper.prototype.checkIfBrowserIE = function () {
                    var userAgent = window.navigator.userAgent;
                    return userAgent.indexOf('Trident') > -1;
                };
                LiveChatBootstrapper.prototype.getPolyfills = function () {
                    var jQueryScript = document.createElement('script');
                    jQueryScript.setAttribute(LiveChatWidget.HTMLConstants.SRC, this.generatePolyfillsURL());
                    document.head.appendChild(jQueryScript);
                };
                LiveChatBootstrapper.prototype.generatePolyfillsURL = function () {
                    var url = LiveChatWidget.BootstrapperConstants.BootstrapperIEPolyfillsBaseURL + "?features=";
                    for (var feature in LiveChatWidget.BootstrapperConstants.BootstrapperIEPolyfillsFeatures) {
                        url = url + "%2C" + LiveChatWidget.BootstrapperConstants.BootstrapperIEPolyfillsFeatures[feature];
                    }
                    return url;
                };
                LiveChatBootstrapper.prototype.onAppend = function (elem, callback) {
                    var observer = new MutationObserver(function (mutations) {
                        mutations.forEach(function (m) {
                            if (m.addedNodes[0]['attributes'][0]['nodeValue'].indexOf(LiveChatWidget.BootstrapperConstants.BootstrapperIEPolyfillsBaseURL) > -1) {
                                var timer_1 = setInterval(function () {
                                    if (window.fetch) {
                                        clearInterval(timer_1);
                                        callback();
                                    }
                                }, 200);
                            }
                        });
                    });
                    observer.observe(elem, { childList: true });
                };
                return LiveChatBootstrapper;
            }());
            LiveChatWidget.LiveChatBootstrapper = LiveChatBootstrapper;
        })(LiveChatWidget = Omnichannel.LiveChatWidget || (Omnichannel.LiveChatWidget = {}));
    })(Omnichannel = Microsoft.Omnichannel || (Microsoft.Omnichannel = {}));
})(Microsoft || (Microsoft = {}));
(function (funcName, baseObj) {
    var bootstrapper = new Microsoft.Omnichannel.LiveChatWidget.LiveChatBootstrapper();
    var isBrowserIE = bootstrapper.checkIfBrowserIE();
    if (isBrowserIE) {
        bootstrapper.onAppend(document.head, bootstrapper.initializeLiveChat.bind(bootstrapper));
        bootstrapper.getPolyfills();
    }
    else {
        bootstrapper.initializeLiveChat();
    }
})("docReady", window);
