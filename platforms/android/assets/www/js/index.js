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
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.addPushMessageListener();

    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('deviceready', this.initPushwoosh, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    initPushwoosh: function() {
        var pushNotification = window.plugins.pushNotification;

        //set push notifications handler
        document.addEventListener('push-notification', function(event) {
            var title = event.notification.title;
            var userData = event.notification.userdata;

            if(typeof(userData) != "undefined") {
                console.warn('user data: ' + JSON.stringify(userData));
            }

            alert(title);
        });

        //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_NUMBER", pw_appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
        pushNotification.onDeviceReady({ projectid: "434909622645", pw_appid : "CC575-69298" });

        //register for pushes
        pushNotification.registerDevice(
            function(status) {
                var pushToken = status;
                console.warn('push token: ' + pushToken);
            },
            function(status) {
                console.warn(JSON.stringify(['failed to register ', status]));
            }
        );
    },
    addPushMessageListener: function () {
        document.addEventListener('push-notification', function(event) {
            var title = event.notification.title;
            var userData = event.notification.userdata;
            console.warn('user data: ' + JSON.stringify(userData));
            alert(title);
        });
    },
    getListOfEmployees: function () {



    }

};

app.initialize();


var angularApp = angular.module("turfApp", ['ngResource']);

angularApp.controller("employeesToday", function($scope, $http) {

    $scope.employee = {};
    $scope.employee.fetchEmployeeRecords = function() {
        $http.get('http://192.168.65.79/core/lunch').
            success(function (data, status, headers, config) {
                $scope.employeesTodayData = data.data;
                console.log(data.data);


            }).
            error(function (data, status, headers, config) {
                //console.log('kon het niet ophalen');// log error
                alert('kon het niet ophalen');// log error
            });
    };
    $scope.employee.fetchEmployeeRecords();
    setInterval(function () {
        $scope.employee.fetchEmployeeRecords();
    }, 3000);
});

angularApp.controller("listOfEmployees", function($scope, $http) {
    $http.get('http://192.168.65.79/core/employees').
        success(function(data, status, headers, config) {
            if (localStorage['currentEmployee']) {
                console.log("User was set", localStorage['currentEmployee']);
                var index;
                for (index = 0; index < data.data.length; index += 1) {
                    if (data.data[index].name === localStorage['currentEmployee']) {
                        data.data[index].isCurrentUser = 'true';
                    }
                }
            }
            console.log(data.data);
            $scope.listOfEmployeesData = data.data;

        }).
        error(function(data, status, headers, config) {
            //console.log('kon het niet ophalen');// log error
            alert('kon het niet ophalen');// log error
        });

    $scope.listOfEmployees = {};
    $scope.listOfEmployees.saveCurrentEmployee = function (item, event) {
        var currentEmployeeValue = item;
        if (window.localStorage) {
            if (localStorage['currentEmployee']) {
                console.log('Value exist on page load in localstorage for key testKey : ', localStorage['currentEmployee']);
            }
            localStorage['currentEmployee'] = currentEmployeeValue;
        }
        else {
            console.log('your browser dont support localstorage');
        }

        console.log(localStorage['currentEmployee']);
    }
});

var date = new Date();
var currentDate = date.toISOString().substring(0, 10);
console.log(currentDate);

angularApp.controller("MyController", function($scope, $http) {
    $scope.myForm = {};
    $scope.myForm.currentEmployee = "";
    $scope.myForm.hasLunched  = true;

    $scope.myForm.submitTheForm = function(item, event) {
        var dataObject = {
            date_time : currentDate,
            employee_name : $scope.myForm.currentEmployee,
            has_lunched  : $scope.myForm.hasLunched
        };

        dataObject = angular.toJson(dataObject, false)
        console.log(dataObject);

        var responsePromise = $http.post("http://192.168.65.79/core/lunch", dataObject, { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
        responsePromise.success(function(dataFromServer, status, headers, config) {
            console.log(dataFromServer.title);
        });
        responsePromise.error(function(data, status, headers, config) {
            alert("Submitting form failed!");
        });
    };

    $scope.updateEmployee = {};
    $scope.updateEmployee.submitTheForm = function(item, event) {
        var itemId = item.id;
        item = angular.toJson(item, false);
        console.log(itemId);
        console.log(item);

        var responsePromise = $http.put("http://192.168.65.79/core/lunch/"+itemId, item, { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
        responsePromise.success(function(dataFromServer, status, headers, config) {
            console.log(dataFromServer.title);
        });
        responsePromise.error(function(data, status, headers, config) {
            alert("Submitting form failed!");
        });
    }
});

//
//function saveCurrentEmployee(){
//
//
//
//    if (window.localStorage) {
//        if (localStorage['currentEmployee']) {
//            console.log('Value exist on page load in localstorage for key testKey : ', localStorage['currentEmployee']);
//        }
//        localStorage['currentEmployee'] = currentEmployeeValue;
//    }
//    else {
//        console.log('your browser dont support localstorage');
//    }
//}

