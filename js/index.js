/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var db;

require.config({
    'paths': {
        'mfp': 'plugins/cordova-plugin-mfp/worklight/ibmmfpf',
        'challengehandler': 'js/challengeHandler'
    }
});

require(['mfp', 'challengehandler'], function(WL, CH) {
    var wlInitOptions = {
        mfpContextRoot: '/mfp', // "mfp" is the default context root in the MobileFirst Developer Kit
        applicationId: 'io.cordova.hellocordova'
    };

    WL.Client.init(wlInitOptions).then(
        function() {
            // getBalance();
            CH.init();
        });
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange


    var DBOpenRequest = window.indexedDB.open("tasksList", 1);

    DBOpenRequest.onerror = function(event) {
        alert('db not opening');
    };
    DBOpenRequest.onsuccess = function(event) {
        console.log('db loaded successfully.');
        db = DBOpenRequest.result;
    }

    DBOpenRequest.onupgradeneeded = function(event) {
        var db = event.target.result;
        db.onerror = function(event) {
            console.log('Error loading database');
        };
        var objectStore = db.createObjectStore("tasksList", { keyPath: "_id" });
        console.log('object store created.');
    };

    var app = {
        initialize: function() {
            // check if user is logged in and redirect to home

            const isLoggedIn = window.sessionStorage.getItem("isLoggedIn");
            if (isLoggedIn) {
                $('#loginPage').hide();
                $('#homePage').show();
                app.getTasks(isLoggedIn);
            } else {
                return;
            }

        },
        login: function() {
            const username = $('#username').val();
            const password = $('#password').val();
            if (username === "" || password === "") {
                alert("Username and password are required");
                return;
            }
            if (isChallenged) {
                userLoginChallengeHandler.submitChallengeAnswer({ 'username': username, 'password': password });
            } else {
                WLAuthorizationManager.login(securityCheckName, { 'username': username, 'password': password }).then(
                    function() {
                        WL.Logger.debug("login onSuccess");
                        alert('success');
                        window.sessionStorage.setItem('isLoggedIn', true);
                        app.getTasks('true');
                    },
                    function(response) {
                        WL.Logger.debug("login onFailure: " + JSON.stringify(response));
                        window.sessionStorage.setItem('isLoggedIn', false);
                    }
                );
            }
        },
        getTasks: function(userLoggedIn) {
            if (userLoggedIn == 'true') {
                var resourceRequest = new WLResourceRequest("/adapters/TasksList/getTasks", WLResourceRequest.GET);
                resourceRequest.send().then(
                    function(response) {
                        WL.Logger.debug("Balance: " + response.responseText);
                        $('#loginPage').hide();
                        $('#homePage').show();
                        $('.header').css('display', 'flex');
                        // app.renderTasksList(response.responseJSON);
                        renderTasksList(response.responseJSON);
                        app.addTodb(response.responseJSON);
                    },
                    function(response) {
                        WL.Logger.debug("Failed to get balance: " + JSON.stringify(response));
                        $('#loginPage').hide();
                        $('#homePage').show();
                        document.getElementById("homePage").innerHTML = "Failed to get balance.";
                    }
                );
            } else {
                $('#loginPage').show();
                $('#homePage').hide();
            }
        },
        // renderTasksList: function(tasksList) {
        //     var tasks = [];
        //     tasksList.map(function(task, index) {
        //         console.log(task);
        //         tasks.push(
        //             '<div class="row"><div class="col s12 m6"><div class="card blue-grey darken-1"><div class="card-content white-text"><span class="card-title">' +
        //             task.taskname + '</span><p>' +
        //             task.taskdescription + '</p></div></div></div></div>');
        //         document.getElementById("homePage").innerHTML = tasks;
        //     });

        // },
        addTodb: function(data) {
            var objectStore;
            var transaction = db.transaction("tasksList", 'readwrite');
            objectStore = transaction.objectStore("tasksList");
            for (i = 0; i < data.length; i++) {
                objectStore.put(data[i]);
            }
        }
    }
    document.getElementById("submit-login").addEventListener("click", app.login);
    app.initialize();
})();

function renderTasksList(tasksList) {
    var tasks = [];
    tasksList.map(function(task, index) {
        console.log(task);
        tasks.push(
            '<div class="row"><div class="col s12 m6"><div class="card"><div class="card-content"><span class="card-title">' +
            task.taskname + '</span><p>' +
            task.taskdescription + '</p></div></div></div></div>');
        document.getElementById("homePage").innerHTML = tasks;
    });
}
// var wlInitOptions = {
//     mfpContextRoot: '/mfp', // "mfp" is the default context root in the MobileFirst Development server
//     applicationId: 'io.cordova.hellocordova' // Replace with your own app id/package name.
// };

// var app = {
//     // Application Constructor
//     initialize: function() {
//         // document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
//     },
//     obtainToken: function() {
//         WLAuthorizationManager.obtainAccessToken(null)
//             .then(
//                 function(accessToken) {
//                     console.log('sucess');
//                 },
//                 function(error) {
//                     console.log(JSON.stringify(error));
//                 }
//             );
//     },
//     login: function() {
//         $('#submit-login').on('click', function(e) {
//             e.preventDefault();
//             const username = $('#username').val();
//             const pwd = $('#password').val();
//             const formVals = { 'username': username, 'pwd': password };
//             console.log(formVals);
//         });
//     }
// };


// app.initialize();