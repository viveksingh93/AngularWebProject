
import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export const msalConfig: Configuration = {
    
    auth: {
        
        clientId: '03389307-2b49-463d-986d-61bac87aeae9', // This is the ONLY mandatory field that you need to supply.
        authority: 'https://login.microsoftonline.com/c556ab28-fc5f-4ab3-a39a-bcaade975f10', // Defaults to "https://login.microsoftonline.com/common"
        redirectUri: '/', // Points to window.location.origin. You must register this URI on Azure portal/App Registration.
        postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
        navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback(logLevel: LogLevel, message: string) {
                //console.log(message);
            },
            logLevel: LogLevel.Verbose,
            piiLoggingEnabled: false
        }
    }
}

export const silentRequest = {
    scopes: ["openid", "profile"],
    loginHint: "example@domain.net"
};