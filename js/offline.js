//offline

(function() {
    'use strict';
    //After DOM Loaded
    const app_container = document.querySelector('.think-app');
    const login_btn = document.getElementById('submit-login');
    document.addEventListener('DOMContentLoaded', function(event) {
        //On initial load to check connectivity
        if (!navigator.onLine) {
            updateNetworkStatus();
            getTasks();

        }

        window.addEventListener('online', updateNetworkStatus, false);
        window.addEventListener('offline', updateNetworkStatus, false);
    });

    //To update network status
    function updateNetworkStatus() {
        if (navigator.onLine) {
            if (app_container.classList.hasClass('app__offline'))
                app_container.classList.remove('app__offline');
            if (login_btn.classList.hasClass('disabled'))
                login_btn.classList.remove('disabled');
        } else {
            // toast('You are now offline..');
            app_container.classList.add('app__offline');
            login_btn.classList.add('disabled');
            const statusMessage = document.getElementById('statusMsg');
            statusMessage.innerHTML = "Uh oh! You're offline";
        }
    }

    function getTasks() {
        var DBOpenRequest = window.indexedDB.open("tasksList", 1);
        var db;
        DBOpenRequest.onerror = function(event) {
            alert('db not opening');
        };
        DBOpenRequest.onsuccess = function(event) {
            console.log('db loaded successfully.');
            db = DBOpenRequest.result;
            var transaction = db.transaction("tasksList", "readonly");
            transaction.oncomplete = function(event) {
                console.log('Transaction completed.');
            };
            transaction.onerror = function(event) {
                console.log('Transaction not completed :' + transaction.error);
            };
            var objectStore = transaction.objectStore("tasksList");
            var objectStoreRequest = objectStore.getAll();
            objectStoreRequest.onsuccess = function(event) {
                console.log('object store request success');
                $('#loginPage').hide();
                $('#homePage').show();
                $('.header').css('display', 'flex');
                renderTasksList(objectStoreRequest.result);
            }
        }

        DBOpenRequest.onupgradeneeded = function(event) {
            var db = event.target.result;
            db.onerror = function(event) {
                console.log('Error loading database');
            };
        };
    }
})();