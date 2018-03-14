/**
 * Copyright 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var isChallenged = false;
var securityCheckName, userLoginChallengeHandler;

define(['plugins/cordova-plugin-mfp/worklight/ibmmfpf.js'], function(WL) {
    function init() {
        isChallenged = false;
        securityCheckName = 'UserLogin';
        var userLoginChallengeHandler = WL.Client.createSecurityCheckChallengeHandler(securityCheckName);

        // document.getElementById("submit-login").addEventListener("click", login);
        // document.getElementById("logout").addEventListener("click", logout);

        userLoginChallengeHandler.securityCheckName = securityCheckName;

        userLoginChallengeHandler.handleChallenge = function(challenge) {
            WL.Logger.debug("handleChallenge");
            isChallenged = true;
            var statusMsg = "Remaining Attempts: " + challenge.remainingAttempts;
            if (challenge.errorMsg !== null) {
                statusMsg = statusMsg + "<br/>" + challenge.errorMsg;
            }
            document.getElementById("statusMsg").innerHTML = statusMsg;
        };

        userLoginChallengeHandler.handleSuccess = function(data) {
            WL.Logger.debug("handleSuccess");
            isChallenged = false;
            // redirect to home page
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
            document.getElementById('loginPage').hide();
            document.getElementById('homePage').show();
            document.getElementById("homePage").innerHTML = "Hello, " + data.user.displayName;
        };

        userLoginChallengeHandler.handleFailure = function(error) {
            WL.Logger.debug("handleFailure: " + error.failure);
            isChallenged = false;
            if (error.failure !== null) {
                if (error.failure == "Account blocked") {
                    document.getElementById("blockedDiv").style.display = "block";
                    document.getElementById("blockedMsg").innerHTML = "Your account is blocked. Try again later.";
                }
                alert(error.failure);
            } else {
                alert("Failed to login.");
            }
        };


        // function login() {
        //     const username = $('#username').val();
        //     const password = $('#password').val();
        //     if (username === "" || password === "") {
        //         alert("Username and password are required");
        //         return;
        //     }
        //     if (isChallenged) {
        //         userLoginChallengeHandler.submitChallengeAnswer({ 'username': username, 'password': password });
        //     } else {
        //         WLAuthorizationManager.login(securityCheckName, { 'username': username, 'password': password }).then(
        //             function() {
        //                 WL.Logger.debug("login onSuccess");
        //                 alert('success');
        //             },
        //             function(response) {
        //                 WL.Logger.debug("login onFailure: " + JSON.stringify(response));
        //             }
        //         );
        //     }
        // }

        // function logout() {
        //     WLAuthorizationManager.logout(securityCheckName).then(
        //         function() {
        //             WL.Logger.debug("logout onSuccess");
        //             location.reload();
        //         },
        //         function(response) {
        //             WL.Logger.debug("logout onFailure: " + JSON.stringify(response));
        //         });
        // }
    }

    return {
        init: init
    };
});