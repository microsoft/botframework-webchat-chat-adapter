var Microsoft;
(function (Microsoft) {
    var Omnichannel;
    (function (Omnichannel) {
        var LiveChatWidget;
        (function (LiveChatWidget) {
            var BootstrapperConstants = /** @class */ (function () {
                function BootstrapperConstants() {
                }
                BootstrapperConstants.Script = "script";
                BootstrapperConstants.Scripts = "/scripts/";
                BootstrapperConstants.WebChatVersionScripts = "/WebChatControl/scripts/";
                BootstrapperConstants.Lib = "/lib/";
                BootstrapperConstants.Head = "head";
                BootstrapperConstants.Body = "body";
                BootstrapperConstants.Meta = "meta";
                BootstrapperConstants.Viewport = "viewport";
                BootstrapperConstants.ViewportMetaContent = "width=device-width, initial-scale=1.0";
                BootstrapperConstants.HostName = "hostname";
                BootstrapperConstants.SRC = "src";
                BootstrapperConstants.ID = "id";
                BootstrapperConstants.Html = "html";
                BootstrapperConstants.Iframe = "iframe";
                BootstrapperConstants.ALLOW = "allow"; //PERMISSION
                BootstrapperConstants.DataLcwVersion = "data-lcw-version";
                BootstrapperConstants.ScriptSelector = "script#";
                BootstrapperConstants.MicrosoftOmnichannelLCWidget = "Microsoft_Omnichannel_LCWidget";
                BootstrapperConstants.JavascriptFlag = "text/javascript";
                BootstrapperConstants.InitializerScriptDownloadTriggeredFlag = "isOmniChannelBootstrapperWebChatDownloadTriggered";
                BootstrapperConstants.InitializerScriptPath = "LiveChatWidgetScripts.min.js";
                BootstrapperConstants.LibsScriptPath = "LiveChatWidgetLibs.min.js";
                BootstrapperConstants.MicrosoftOmnichannelLCWidgetChatIframePageId = "Microsoft_Omnichannel_LCWidget_Chat_Iframe_Window";
                BootstrapperConstants.MicrosoftOmnichannelLCWidgetChatIframePageStyleId = "Microsoft_Omnichannel_LCWidget_Chat_Iframe_Style";
                BootstrapperConstants.AllowValues = "microphone *; camera *; geolocation *;";
                BootstrapperConstants.DataAppId = "data-app-id";
                BootstrapperConstants.DataOrgUrl = "data-org-url";
                BootstrapperConstants.DataOrgId = "data-org-id";
                BootstrapperConstants.DisableTelemetry = "data-disable-telemetry";
                BootstrapperConstants.OpenChatInPopOutWindow = "data-open-in-window";
                BootstrapperConstants.URLDelimiter = "&";
                BootstrapperConstants.EndURLSeparator = "?";
                BootstrapperConstants.ChatHTMLPath = "/htmls/chat.html";
                BootstrapperConstants.Equal = "=";
                BootstrapperConstants.Class = "class";
                BootstrapperConstants.Style = "style";
                BootstrapperConstants.Link = "link";
                BootstrapperConstants.Href = "href";
                BootstrapperConstants.Rel = "rel";
                BootstrapperConstants.StyleSheet = "stylesheet";
                BootstrapperConstants.Type = "type";
                BootstrapperConstants.TextCss = "text/css";
                BootstrapperConstants.Title = "title";
                BootstrapperConstants.LiveChatWidgetHideChatButton = "data-hide-chat-button";
                BootstrapperConstants.RenderOnMobileDevice = "data-render-mobile";
                BootstrapperConstants.WidgetThemeColor = "data-color-override";
                BootstrapperConstants.SDK = "SDK";
                BootstrapperConstants.Return = "return";
                BootstrapperConstants.SPACE = " ";
                BootstrapperConstants.Microsoft = "Microsoft";
                BootstrapperConstants.Dynamic365 = "Dynamic365";
                BootstrapperConstants.Portal = "Portal";
                BootstrapperConstants.User = "User";
                BootstrapperConstants.ScriptBootstrapperPath = "scripts/LiveChatBootstrapper.js";
                BootstrapperConstants.FrameStyleCssPath = "WebChatControl/styles/LiveChatWidgetFrame.css";
                return BootstrapperConstants;
            }());
            LiveChatWidget.BootstrapperConstants = BootstrapperConstants;
            var StyleConstants = /** @class */ (function () {
                function StyleConstants() {
                }
                StyleConstants.Transparent = "transparent";
                StyleConstants.BackgroundColor = "background-color";
                StyleConstants.FrameBorder = "frameBorder";
                StyleConstants.AllowTransparency = "allowTransparency";
                StyleConstants.BorderWidth = "border-width";
                StyleConstants.ZIndex = "z-index";
                StyleConstants.Position = "position";
                StyleConstants.Right = "right";
                StyleConstants.Bottom = "bottom";
                StyleConstants.None = "none";
                return StyleConstants;
            }());
            LiveChatWidget.StyleConstants = StyleConstants;
            var DefaultCssValues = /** @class */ (function () {
                function DefaultCssValues() {
                }
                DefaultCssValues.FrameBorderWidth = "0px";
                DefaultCssValues.AllowTransparency = true;
                DefaultCssValues.IFramePosition = "fixed";
                DefaultCssValues.IFrameBackgroundColor = "transparent";
                DefaultCssValues.IFrameZIndex = "999999";
                return DefaultCssValues;
            }());
            LiveChatWidget.DefaultCssValues = DefaultCssValues;
            var EventConstants = /** @class */ (function () {
                function EventConstants() {
                }
                EventConstants.message = "message";
                EventConstants.keydown = "keydown";
                EventConstants.setContextProvider = "setContextProvider";
                EventConstants.getContextProvider = "getContextProvider";
                EventConstants.removeContextProvider = "removeContextProvider";
                EventConstants.setAuthTokenProvider = "setAuthTokenProvider";
                EventConstants.getAuthTokenProvider = "getAuthTokenProvider";
                EventConstants.removeAuthTokenProvider = "removeAuthTokenProvider";
                EventConstants.getContactInfoRequest = "getContactInfoRequest";
                EventConstants.getContactInfoResponse = "getContactInfoResponse";
                EventConstants.LcwReady = "lcw:ready";
                EventConstants.LcwStartChat = "lcw:startChat";
                EventConstants.LcwCloseChat = "lcw:closeChat";
                EventConstants.LcwThreadUpdate = "lcw:threadUpdate";
                EventConstants.LcwError = "lcw:error";
                EventConstants.startChat = "startChat";
                EventConstants.closeChat = "closeChat";
                EventConstants.startProactiveChat = "startProactiveChat";
                EventConstants.CustomEvent = "CustomEvent";
                EventConstants.LcwChangeTitle = "changeTitle";
                return EventConstants;
            }());
            LiveChatWidget.EventConstants = EventConstants;
            var IFrameBootstrapperValues = /** @class */ (function () {
                function IFrameBootstrapperValues() {
                }
                IFrameBootstrapperValues.resizeMSLcwIframe = "resizeMSLcwIframe";
                IFrameBootstrapperValues.authTokenRequest = "authTokenRequest";
                IFrameBootstrapperValues.authTokenResponse = "authTokenResponse";
                IFrameBootstrapperValues.removeKeyboardEventHandler = "removeKeyboardEventHandler";
                IFrameBootstrapperValues.repositionMSLcwIframe = "repositionMSLcwIframe";
                IFrameBootstrapperValues.webChatPanel = "web_chat_panel";
                IFrameBootstrapperValues.leftBottom = "BottomLeft";
                IFrameBootstrapperValues.rightBottom = "BottomRight";
                IFrameBootstrapperValues.hideIframe = "hide_iframe";
                IFrameBootstrapperValues.proactiveChatPanel = "proactive_chat_panel";
                IFrameBootstrapperValues.startChatButton = "start_chat_button";
                IFrameBootstrapperValues.defaultClassName = [IFrameBootstrapperValues.webChatPanel, IFrameBootstrapperValues.rightBottom, IFrameBootstrapperValues.hideIframe];
                IFrameBootstrapperValues.handleControlSlash = "handleControlSlash";
                IFrameBootstrapperValues.KEY_SLASH = 191;
                IFrameBootstrapperValues.iFrameTitle = "Microsoft Omnichannel Live Chat Widget";
                IFrameBootstrapperValues.inAppClassName = "inApp";
                return IFrameBootstrapperValues;
            }());
            LiveChatWidget.IFrameBootstrapperValues = IFrameBootstrapperValues;
        })(LiveChatWidget = Omnichannel.LiveChatWidget || (Omnichannel.LiveChatWidget = {}));
    })(Omnichannel = Microsoft.Omnichannel || (Microsoft.Omnichannel = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var Omnichannel;
    (function (Omnichannel) {
        var LiveChatWidget;
        (function (LiveChatWidget) {
            /*
             *The delegation to invoke the methods from LCW SDK configured in widget iframe
             *
             */
            var ClientSdkDelegation = /** @class */ (function () {
                function ClientSdkDelegation() {
                    this.settingUpDelegation();
                }
                /*
                 * Singleton method
                 * Return ClientSdkDelegation instance
                 */
                ClientSdkDelegation.getInstance = function () {
                    if (!ClientSdkDelegation._instance) {
                        ClientSdkDelegation._instance = new ClientSdkDelegation();
                    }
                    return ClientSdkDelegation._instance;
                };
                /*
                 * Initializing all the methods and namespaces
                 */
                ClientSdkDelegation.prototype.settingUpDelegation = function () {
                    if (!LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK]) {
                        LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK] = {};
                    }
                    this.setupStartChatFunc();
                    this.setupCloseChatFunc();
                    this.setupStartProactiveChatFunc();
                    this.initGetContextProviderFunc();
                    this.setupSetContextProviderFunc();
                    this.setupRemoveContextProviderFunc();
                    this.setupSetAuthTokenProviderFunc();
                    this.initGetAuthTokenProviderFunc();
                    this.setupRemoveAuthTokenProviderFunc();
                };
                /*
                 * Configure delegation function for Microsoft.Omnichannel.LiveChatWidget.SDK.startChat
                 * pass message to iframe window to invoke the startChat function
                 */
                ClientSdkDelegation.prototype.setupStartChatFunc = function () {
                    try {
                        LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK][LiveChatWidget.EventConstants.startChat] = function () {
                            var message = {
                                messageName: LiveChatWidget.EventConstants.startChat
                            };
                            LiveChatWidget.LiveChatBootstrapperWebChat.postIframeMessage(message);
                        };
                    }
                    catch (e) {
                        console.error("Failed to setup startChat: ", e);
                    }
                };
                /*
                 * Configure delegation function for Microsoft.Omnichannel.LiveChatWidget.SDK.closeChat
                 * pass message to iframe window to invoke the closeChat function
                 */
                ClientSdkDelegation.prototype.setupCloseChatFunc = function () {
                    try {
                        LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK][LiveChatWidget.EventConstants.closeChat] = function () {
                            var message = {
                                messageName: LiveChatWidget.EventConstants.closeChat
                            };
                            LiveChatWidget.LiveChatBootstrapperWebChat.postIframeMessage(message);
                        };
                    }
                    catch (e) {
                        console.error("Failed to setup closeChat: ", e);
                    }
                };
                /*
                 * Configure delegation function for Microsoft.Omnichannel.LiveChatWidget.SDK.startProactiveChat
                 * pass message to iframe window to invoke the startProactiveChat function
                 */
                ClientSdkDelegation.prototype.setupStartProactiveChatFunc = function () {
                    try {
                        LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK][LiveChatWidget.EventConstants.startProactiveChat] = function (notificationConfig, enablePreChat) {
                            if (enablePreChat === void 0) { enablePreChat = null; }
                            var message = {
                                messageName: LiveChatWidget.EventConstants.startProactiveChat,
                                notificationConfig: notificationConfig,
                                enablePreChat: enablePreChat
                            };
                            LiveChatWidget.LiveChatBootstrapperWebChat.postIframeMessage(message);
                        };
                    }
                    catch (e) {
                        console.error("Failed to setup proactiveChat: ", e);
                    }
                };
                /*
                * Configure delegation function for Microsoft.Omnichannel.LiveChatWidget.SDK.setContextProvider
                * pass message with contextVariables to iframe window for invoking the setContextProvider function
                */
                ClientSdkDelegation.prototype.setupSetContextProviderFunc = function () {
                    try {
                        LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK][LiveChatWidget.EventConstants.setContextProvider] = function (customerFunction) {
                            var contextVariables = customerFunction();
                            var message = {
                                messageName: LiveChatWidget.EventConstants.setContextProvider,
                                contextVariables: contextVariables
                            };
                            LiveChatWidget.LiveChatBootstrapperWebChat.postIframeMessage(message);
                            LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK][LiveChatWidget.EventConstants.getContextProvider] = function () { return customerFunction; };
                        };
                    }
                    catch (e) {
                        console.error("Failed to setup setContextProvider: ", e);
                    }
                };
                /*
                * Configure delegation function for Microsoft.Omnichannel.LiveChatWidget.SDK.setAuthTokenProvider
                * pass message with JWT to iframe window for invoking the setAuthTokenProvider function
                */
                ClientSdkDelegation.prototype.setupSetAuthTokenProviderFunc = function () {
                    try {
                        LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK][LiveChatWidget.EventConstants.setAuthTokenProvider] = function (customerFunction) {
                            customerFunction(function (token) { ClientSdkDelegation.jwtToken = token; });
                            var message = {
                                messageName: LiveChatWidget.EventConstants.setAuthTokenProvider,
                                jwtToken: ClientSdkDelegation.jwtToken,
                            };
                            LiveChatWidget.LiveChatBootstrapperWebChat.postIframeMessage(message);
                            LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK][LiveChatWidget.EventConstants.getAuthTokenProvider] = function () { return customerFunction; };
                        };
                    }
                    catch (e) {
                        console.error("Failed to setup setAuthTokenProvider: ", e);
                    }
                };
                /*
                * Configure delegation function for Microsoft.Omnichannel.LiveChatWidget.SDK.removeContextProvider
                * pass message to iframe window for invoking the removeContextProvider function
                */
                ClientSdkDelegation.prototype.setupRemoveContextProviderFunc = function () {
                    try {
                        LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK][LiveChatWidget.EventConstants.removeContextProvider] = function () {
                            var message = {
                                messageName: LiveChatWidget.EventConstants.removeContextProvider
                            };
                            LiveChatWidget.LiveChatBootstrapperWebChat.postIframeMessage(message);
                            LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK][LiveChatWidget.EventConstants.getContextProvider] = function () { return null; };
                        };
                    }
                    catch (e) {
                        console.error("Failed to setup removeContextProvider: ", e);
                    }
                };
                /*
                * Configure delegation function for Microsoft.Omnichannel.LiveChatWidget.SDK.removeAuthTokenProvider
                * pass message to iframe window for invoking the removeAuthTokenProvider function
                */
                ClientSdkDelegation.prototype.setupRemoveAuthTokenProviderFunc = function () {
                    try {
                        LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK][LiveChatWidget.EventConstants.removeAuthTokenProvider] = function () {
                            var message = {
                                messageName: LiveChatWidget.EventConstants.removeAuthTokenProvider
                            };
                            LiveChatWidget.LiveChatBootstrapperWebChat.postIframeMessage(message);
                            ClientSdkDelegation.getInstance().initGetAuthTokenProviderFunc();
                        };
                    }
                    catch (e) {
                        console.error("Failed to setup removeAuthTokenProvider: ", e);
                    }
                };
                /*
                * setup initial function for getContextProvider
                */
                ClientSdkDelegation.prototype.initGetContextProviderFunc = function () {
                    LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK][LiveChatWidget.EventConstants.getContextProvider] = function () { return null; };
                };
                /*
                * setup initial function for getAuthTokenProvider
                */
                ClientSdkDelegation.prototype.initGetAuthTokenProviderFunc = function () {
                    LiveChatWidget[LiveChatWidget.BootstrapperConstants.SDK][LiveChatWidget.EventConstants.getAuthTokenProvider] = function () { return null; };
                };
                return ClientSdkDelegation;
            }());
            LiveChatWidget.ClientSdkDelegation = ClientSdkDelegation;
        })(LiveChatWidget = Omnichannel.LiveChatWidget || (Omnichannel.LiveChatWidget = {}));
    })(Omnichannel = Microsoft.Omnichannel || (Microsoft.Omnichannel = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var Omnichannel;
    (function (Omnichannel) {
        var LiveChatWidget;
        (function (LiveChatWidget) {
            var LiveChatBootstrapperWebChat = /** @class */ (function () {
                function LiveChatBootstrapperWebChat() {
                }
                LiveChatBootstrapperWebChat.prototype.loadJSResource = function (path, onload, onerror) {
                    var scriptResource = document.createElement(LiveChatWidget.BootstrapperConstants.Script);
                    scriptResource.src = path;
                    scriptResource.type = LiveChatWidget.BootstrapperConstants.JavascriptFlag;
                    scriptResource.onload = onload;
                    scriptResource.onerror = onerror;
                    try {
                        document.getElementsByTagName(LiveChatWidget.BootstrapperConstants.Head)[0].appendChild(scriptResource);
                    }
                    catch (_a) {
                        document.getElementsByTagName(LiveChatWidget.BootstrapperConstants.Body)[0].appendChild(scriptResource);
                    }
                };
                LiveChatBootstrapperWebChat.attachLcwIframeStyle = function (scriptNode) {
                    var styleElement = document.createElement(LiveChatWidget.BootstrapperConstants.Link);
                    styleElement[LiveChatWidget.BootstrapperConstants.ID] = LiveChatWidget.BootstrapperConstants.MicrosoftOmnichannelLCWidgetChatIframePageStyleId;
                    styleElement[LiveChatWidget.BootstrapperConstants.Type] = LiveChatWidget.BootstrapperConstants.TextCss;
                    styleElement[LiveChatWidget.BootstrapperConstants.Rel] = LiveChatWidget.BootstrapperConstants.StyleSheet;
                    styleElement[LiveChatWidget.BootstrapperConstants.Href] = scriptNode.getAttribute(LiveChatWidget.BootstrapperConstants.SRC).replace(LiveChatWidget.BootstrapperConstants.ScriptBootstrapperPath, LiveChatWidget.BootstrapperConstants.FrameStyleCssPath);
                    var htmlElement = document.getElementsByTagName(LiveChatWidget.BootstrapperConstants.Html)[0];
                    var headElements = document.getElementsByTagName(LiveChatWidget.BootstrapperConstants.Head);
                    if (!headElements || !headElements[0]) {
                        htmlElement.appendChild(document.createElement(LiveChatWidget.BootstrapperConstants.Head));
                    }
                    var headElement = document.getElementsByTagName(LiveChatWidget.BootstrapperConstants.Head)[0];
                    headElement.appendChild(styleElement);
                };
                LiveChatBootstrapperWebChat.attachLcwIframe = function (scriptNode) {
                    var iframeElement = document.createElement(LiveChatWidget.BootstrapperConstants.Iframe);
                    var servicePageSrc = scriptNode.getAttribute(LiveChatWidget.BootstrapperConstants.SRC).replace("scripts/LiveChatBootstrapper.js", "WebChatControl");
                    servicePageSrc = servicePageSrc.concat(LiveChatWidget.BootstrapperConstants.ChatHTMLPath, LiveChatWidget.BootstrapperConstants.EndURLSeparator, LiveChatWidget.BootstrapperConstants.URLDelimiter, LiveChatWidget.BootstrapperConstants.ID, LiveChatWidget.BootstrapperConstants.Equal, scriptNode.getAttribute(LiveChatWidget.BootstrapperConstants.ID), LiveChatWidget.BootstrapperConstants.URLDelimiter, LiveChatWidget.BootstrapperConstants.DataAppId, LiveChatWidget.BootstrapperConstants.Equal, scriptNode.getAttribute(LiveChatWidget.BootstrapperConstants.DataAppId), LiveChatWidget.BootstrapperConstants.URLDelimiter, LiveChatWidget.BootstrapperConstants.DataOrgId, LiveChatWidget.BootstrapperConstants.Equal, scriptNode.getAttribute(LiveChatWidget.BootstrapperConstants.DataOrgId), LiveChatWidget.BootstrapperConstants.URLDelimiter, LiveChatWidget.BootstrapperConstants.DataOrgUrl, LiveChatWidget.BootstrapperConstants.Equal, scriptNode.getAttribute(LiveChatWidget.BootstrapperConstants.DataOrgUrl), LiveChatWidget.BootstrapperConstants.URLDelimiter, LiveChatWidget.BootstrapperConstants.HostName, LiveChatWidget.BootstrapperConstants.Equal, window.location.host);
                    if (scriptNode.hasAttribute(LiveChatWidget.BootstrapperConstants.DisableTelemetry)) {
                        servicePageSrc = servicePageSrc.concat(LiveChatWidget.BootstrapperConstants.URLDelimiter, LiveChatWidget.BootstrapperConstants.DisableTelemetry, LiveChatWidget.BootstrapperConstants.Equal, scriptNode.getAttribute(LiveChatWidget.BootstrapperConstants.DisableTelemetry));
                    }
                    if (scriptNode.hasAttribute(LiveChatWidget.BootstrapperConstants.LiveChatWidgetHideChatButton)) {
                        servicePageSrc = servicePageSrc.concat(LiveChatWidget.BootstrapperConstants.URLDelimiter, LiveChatWidget.BootstrapperConstants.LiveChatWidgetHideChatButton, LiveChatWidget.BootstrapperConstants.Equal, scriptNode.getAttribute(LiveChatWidget.BootstrapperConstants.LiveChatWidgetHideChatButton));
                    }
                    if (scriptNode.hasAttribute(LiveChatWidget.BootstrapperConstants.OpenChatInPopOutWindow)) {
                        servicePageSrc = servicePageSrc.concat(LiveChatWidget.BootstrapperConstants.URLDelimiter, LiveChatWidget.BootstrapperConstants.OpenChatInPopOutWindow, LiveChatWidget.BootstrapperConstants.Equal, scriptNode.getAttribute(LiveChatWidget.BootstrapperConstants.OpenChatInPopOutWindow));
                    }
                    if (scriptNode.hasAttribute(LiveChatWidget.BootstrapperConstants.DataLcwVersion)) {
                        servicePageSrc = servicePageSrc.concat(LiveChatWidget.BootstrapperConstants.URLDelimiter, LiveChatWidget.BootstrapperConstants.DataLcwVersion, LiveChatWidget.BootstrapperConstants.Equal, scriptNode.getAttribute(LiveChatWidget.BootstrapperConstants.DataLcwVersion));
                    }
                    // InApp
                    if (scriptNode.hasAttribute(LiveChatWidget.BootstrapperConstants.RenderOnMobileDevice)) {
                        servicePageSrc = servicePageSrc.concat(LiveChatWidget.BootstrapperConstants.URLDelimiter, LiveChatWidget.BootstrapperConstants.RenderOnMobileDevice, LiveChatWidget.BootstrapperConstants.Equal, scriptNode.getAttribute(LiveChatWidget.BootstrapperConstants.RenderOnMobileDevice));
                        if (scriptNode.getAttribute(LiveChatWidget.BootstrapperConstants.RenderOnMobileDevice.trim().toLowerCase()) === "true") {
                            LiveChatBootstrapperWebChat.renderOnMobileDevice = true;
                        }
                    }
                    if (scriptNode.hasAttribute(LiveChatWidget.BootstrapperConstants.WidgetThemeColor)) {
                        var widgetColor = scriptNode.getAttribute(LiveChatWidget.BootstrapperConstants.WidgetThemeColor);
                        // Encode the color parameter since it contains # which will be misinterpreted in the query URL.
                        servicePageSrc = servicePageSrc.concat(LiveChatWidget.BootstrapperConstants.URLDelimiter, LiveChatWidget.BootstrapperConstants.WidgetThemeColor, LiveChatWidget.BootstrapperConstants.Equal, encodeURIComponent(widgetColor));
                    }
                    //default properties of the iframe element. At this moment, none of the CSS has been loaded yet.
                    //those values could be overwritten by service page when the configurations are loaded.
                    iframeElement[LiveChatWidget.BootstrapperConstants.SRC] = servicePageSrc;
                    iframeElement[LiveChatWidget.BootstrapperConstants.ID] = LiveChatWidget.BootstrapperConstants.MicrosoftOmnichannelLCWidgetChatIframePageId;
                    (_a = iframeElement.classList).add.apply(_a, LiveChatWidget.IFrameBootstrapperValues.defaultClassName);
                    iframeElement[LiveChatWidget.BootstrapperConstants.Title] = LiveChatWidget.IFrameBootstrapperValues.iFrameTitle;
                    iframeElement[LiveChatWidget.StyleConstants.BackgroundColor] = LiveChatWidget.DefaultCssValues.IFrameBackgroundColor;
                    iframeElement[LiveChatWidget.StyleConstants.FrameBorder] = LiveChatWidget.DefaultCssValues.FrameBorderWidth;
                    iframeElement[LiveChatWidget.StyleConstants.AllowTransparency] = true;
                    iframeElement[LiveChatWidget.BootstrapperConstants.ALLOW] = LiveChatWidget.BootstrapperConstants.AllowValues; //PERMISSION
                    iframeElement.style[LiveChatWidget.StyleConstants.Position] = LiveChatWidget.DefaultCssValues.IFramePosition;
                    iframeElement.style[LiveChatWidget.StyleConstants.BorderWidth] = LiveChatWidget.DefaultCssValues.FrameBorderWidth;
                    iframeElement.style[LiveChatWidget.StyleConstants.ZIndex] = LiveChatWidget.DefaultCssValues.IFrameZIndex; //value used for SWC iframe div
                    document.getElementsByTagName(LiveChatWidget.BootstrapperConstants.Body)[0].appendChild(iframeElement);
                    LiveChatBootstrapperWebChat.addIframeEventListener(iframeElement);
                    var _a;
                };
                /**
                 * Reize the frame according to elements
                 * @param id : ID of the element
                 * @param className : class name assigned to the element
                 */
                LiveChatBootstrapperWebChat.resizeMSLcwIframe = function (id, className) {
                    var msLcwIframe = document.getElementById(id);
                    if (!msLcwIframe)
                        return;
                    msLcwIframe.classList = "";
                    if (className) {
                        var classArr = className.split(" ");
                        classArr.forEach(function (element) {
                            msLcwIframe.classList.add(element);
                        });
                    }
                    // InApp
                    if (LiveChatBootstrapperWebChat.renderOnMobileDevice) {
                        msLcwIframe.classList.add(LiveChatWidget.IFrameBootstrapperValues.inAppClassName);
                    }
                };
                LiveChatBootstrapperWebChat.createCustomEvent = function (eventName, payload) {
                    var eventDetails = (payload) ? {
                        detail: payload
                    } : undefined;
                    var event = null;
                    try {
                        // For non IE11 scenarios, customevent object can be dispatched
                        event = new CustomEvent(eventName, eventDetails);
                    }
                    catch (e) {
                        // Special handling for IE11 scenario, where customevent object cannot be dispatched
                        event = document.createEvent(LiveChatWidget.EventConstants.CustomEvent);
                        event.initCustomEvent(eventName, true, true, eventDetails);
                    }
                    return event;
                };
                /**
                 * The message handler for iframe element
                 * @param iframeElement the iframe element to be listened.
                 */
                LiveChatBootstrapperWebChat.addIframeEventListener = function (iframeElement) {
                    var _this = this;
                    window.addEventListener(LiveChatWidget.EventConstants.message, function (event) {
                        if (event.data) {
                            try {
                                var data = event.data;
                                var message = data.messageName;
                                switch (message) {
                                    case LiveChatWidget.IFrameBootstrapperValues.resizeMSLcwIframe:
                                        var id = data.id;
                                        _this.resizeMSLcwIframe(id, data.className);
                                        break;
                                    case LiveChatWidget.IFrameBootstrapperValues.authTokenRequest:
                                        var functionFullName = data.functionFullName;
                                        var authFunc = LiveChatBootstrapperWebChat.getMethodFromString(functionFullName);
                                        authFunc(function (token) {
                                            document
                                                .getElementById(LiveChatWidget.BootstrapperConstants.MicrosoftOmnichannelLCWidgetChatIframePageId)
                                                .contentWindow
                                                .postMessage({
                                                messageName: LiveChatWidget.IFrameBootstrapperValues.authTokenResponse,
                                                authToken: token
                                            }, '*');
                                        });
                                        break;
                                    case LiveChatWidget.EventConstants.LcwReady:
                                        var readyEvent = LiveChatBootstrapperWebChat.createCustomEvent(data.messageName, data.payload);
                                        window.dispatchEvent(readyEvent);
                                        break;
                                    case LiveChatWidget.EventConstants.LcwStartChat:
                                        var startChatEvent = LiveChatBootstrapperWebChat.createCustomEvent(data.messageName, data.payload);
                                        window.dispatchEvent(startChatEvent);
                                        break;
                                    case LiveChatWidget.EventConstants.LcwCloseChat:
                                        var closeChatEvent = LiveChatBootstrapperWebChat.createCustomEvent(data.messageName, data.payload);
                                        window.dispatchEvent(closeChatEvent);
                                        break;
                                    case LiveChatWidget.EventConstants.LcwThreadUpdate:
                                        var threadUpdateEvent = LiveChatBootstrapperWebChat.createCustomEvent(data.messageName, data.payload);
                                        window.dispatchEvent(threadUpdateEvent);
                                        break;
                                    case LiveChatWidget.EventConstants.LcwError:
                                        var errorEvent = LiveChatBootstrapperWebChat.createCustomEvent(data.messageName, data.payload);
                                        window.dispatchEvent(errorEvent);
                                        break;
                                    case LiveChatWidget.EventConstants.LcwChangeTitle:
                                        var count = data.payload;
                                        var currentTitle = document.title ? document.title : "";
                                        var title = count > 0 ? "(" + count + ") " + currentTitle.replace(/^\(\d*\)/, "") : currentTitle.replace(/^\(\d*\)/, "");
                                        window.document.title = title;
                                        break;
                                    default:
                                        break;
                                }
                            }
                            catch (e) {
                                //to add telementry later
                                console.error(e);
                            }
                        }
                    });
                    window.addEventListener(LiveChatWidget.EventConstants.LcwReady, function () {
                        if (window[LiveChatWidget.BootstrapperConstants.Microsoft]
                            && window[LiveChatWidget.BootstrapperConstants.Microsoft][LiveChatWidget.BootstrapperConstants.Dynamic365]
                            && window[LiveChatWidget.BootstrapperConstants.Microsoft][LiveChatWidget.BootstrapperConstants.Dynamic365][LiveChatWidget.BootstrapperConstants.Portal]
                            && window[LiveChatWidget.BootstrapperConstants.Microsoft][LiveChatWidget.BootstrapperConstants.Dynamic365][LiveChatWidget.BootstrapperConstants.Portal][LiveChatWidget.BootstrapperConstants.User]) {
                            var message = {
                                messageName: LiveChatWidget.EventConstants.getContactInfoResponse,
                                contactInfo: window[LiveChatWidget.BootstrapperConstants.Microsoft][LiveChatWidget.BootstrapperConstants.Dynamic365][LiveChatWidget.BootstrapperConstants.Portal][LiveChatWidget.BootstrapperConstants.User]
                            };
                            LiveChatBootstrapperWebChat.postIframeMessage(message);
                        }
                    });
                };
                LiveChatBootstrapperWebChat.prototype.initializeLiveChat = function () {
                    var target_window = window[Microsoft.Omnichannel.LiveChatWidget.BootstrapperConstants.MicrosoftOmnichannelLCWidgetChatIframePageId];
                    var existingIframeElement = document.getElementById(Microsoft.Omnichannel.LiveChatWidget.BootstrapperConstants.MicrosoftOmnichannelLCWidgetChatIframePageId);
                    LiveChatBootstrapperWebChat.appendViewportMeta();
                    LiveChatBootstrapperWebChat.addKeyboardEventHandler();
                    if (LiveChatBootstrapperWebChat.shouldRenderChatWidget(target_window, existingIframeElement)) {
                        if (!window[LiveChatWidget.BootstrapperConstants.InitializerScriptDownloadTriggeredFlag]) {
                            window[LiveChatWidget.BootstrapperConstants.InitializerScriptDownloadTriggeredFlag] = true;
                            var self_1 = this;
                            var bootScript = document.querySelector(LiveChatWidget.BootstrapperConstants.ScriptSelector + LiveChatWidget.BootstrapperConstants.MicrosoftOmnichannelLCWidget);
                            var liveChatScriptRoot_1 = bootScript.getAttribute(LiveChatWidget.BootstrapperConstants.SRC);
                            if (liveChatScriptRoot_1.indexOf(LiveChatWidget.BootstrapperConstants.WebChatVersionScripts) === -1) {
                                liveChatScriptRoot_1 = liveChatScriptRoot_1.replace(LiveChatWidget.BootstrapperConstants.Scripts, LiveChatWidget.BootstrapperConstants.WebChatVersionScripts);
                            }
                            liveChatScriptRoot_1 = liveChatScriptRoot_1.substring(0, liveChatScriptRoot_1.lastIndexOf("/") + 1);
                            var liveChatInitializerFileNameWithExtension_1 = LiveChatWidget.BootstrapperConstants.InitializerScriptPath;
                            var libRoot = liveChatScriptRoot_1.trim().replace(LiveChatWidget.BootstrapperConstants.Scripts, LiveChatWidget.BootstrapperConstants.Lib);
                            var liveChatAllLibsPath = libRoot.trim() + LiveChatWidget.BootstrapperConstants.LibsScriptPath;
                            var libsResourceOnload = function () {
                                var liveChatInitializerPath = liveChatScriptRoot_1.trim() + liveChatInitializerFileNameWithExtension_1;
                                self_1.loadJSResource(liveChatInitializerPath, null, null);
                            };
                            this.loadJSResource(liveChatAllLibsPath, libsResourceOnload, null);
                        }
                    }
                    else if (LiveChatBootstrapperWebChat.shouldAddIframe(target_window, existingIframeElement)) {
                        var bootScript = document.querySelector(LiveChatWidget.BootstrapperConstants.ScriptSelector + LiveChatWidget.BootstrapperConstants.MicrosoftOmnichannelLCWidget);
                        LiveChatBootstrapperWebChat.attachLcwIframeStyle(bootScript);
                        LiveChatBootstrapperWebChat.attachLcwIframe(bootScript);
                        LiveChatWidget.ClientSdkDelegation.getInstance().settingUpDelegation();
                    }
                };
                LiveChatBootstrapperWebChat.appendViewportMeta = function () {
                    var metas = document.getElementsByTagName(LiveChatWidget.BootstrapperConstants.Meta);
                    for (var i = 0; i < metas.length; i++) {
                        if (metas[i].name === LiveChatWidget.BootstrapperConstants.Viewport) {
                            return;
                        }
                    }
                    var viewportMeta = document.createElement(LiveChatWidget.BootstrapperConstants.Meta);
                    viewportMeta.name = LiveChatWidget.BootstrapperConstants.Viewport;
                    viewportMeta.content = LiveChatWidget.BootstrapperConstants.ViewportMetaContent;
                    document.getElementsByTagName(LiveChatWidget.BootstrapperConstants.Head)[0].appendChild(viewportMeta);
                };
                LiveChatBootstrapperWebChat.addKeyboardEventHandler = function () {
                    window.addEventListener(LiveChatWidget.EventConstants.keydown, this.handleKeydown);
                };
                LiveChatBootstrapperWebChat.handleKeydown = function (e) {
                    if (e.ctrlKey && e.keyCode === LiveChatWidget.IFrameBootstrapperValues.KEY_SLASH) {
                        var message = {
                            messageName: LiveChatWidget.IFrameBootstrapperValues.handleControlSlash
                        };
                        LiveChatBootstrapperWebChat.postIframeMessage(message);
                    }
                };
                LiveChatBootstrapperWebChat.postIframeMessage = function (message) {
                    var iframes = document.querySelectorAll(LiveChatWidget.BootstrapperConstants.Iframe);
                    for (var i = 0; i < iframes.length; i++) {
                        if (iframes[i].id === LiveChatWidget.BootstrapperConstants.MicrosoftOmnichannelLCWidgetChatIframePageId) {
                            iframes[i].contentWindow.postMessage(message, "*");
                        }
                    }
                };
                LiveChatBootstrapperWebChat.getMethodFromString = function (methodString) {
                    if (methodString) {
                        // select window as current scope
                        var scope = window;
                        var scopeSplit = methodString.split('.');
                        for (var i = 0; i < scopeSplit.length - 1; i++) {
                            // here we move forward in our scope util we get the one containing our func
                            // example: methodString = a.b.c.d
                            // 1 iteration: window.a.b.c.d -> a.b.c.d, 2: a.b.c.d -> b.c.d, 3: b.c.d -> c.d
                            scope = scope[scopeSplit[i]];
                            // if scope is undefied we return undefined
                            if (!scope) {
                                break;
                            }
                        }
                        // get the method from last outer scope
                        // example: scope = c
                        // theMethodName = [a,b,c,d][3] -> d
                        var theMethodName = scopeSplit[scopeSplit.length - 1];
                        // c[d]
                        var methodFromString = scope[theMethodName];
                        return methodFromString;
                    }
                };
                LiveChatBootstrapperWebChat.renderOnMobileDevice = false;
                LiveChatBootstrapperWebChat.shouldRenderChatWidget = function (target_window, existingIframeElement) {
                    return target_window && !existingIframeElement;
                };
                LiveChatBootstrapperWebChat.shouldAddIframe = function (target_window, existingIframeElement) {
                    return !target_window && !existingIframeElement;
                };
                return LiveChatBootstrapperWebChat;
            }());
            LiveChatWidget.LiveChatBootstrapperWebChat = LiveChatBootstrapperWebChat;
        })(LiveChatWidget = Omnichannel.LiveChatWidget || (Omnichannel.LiveChatWidget = {}));
    })(Omnichannel = Microsoft.Omnichannel || (Microsoft.Omnichannel = {}));
})(Microsoft || (Microsoft = {}));
(function (funcName, baseObj) {
    new Microsoft.Omnichannel.LiveChatWidget.LiveChatBootstrapperWebChat().initializeLiveChat();
})("docReady", window);
