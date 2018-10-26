var MyApp = angular.module('json-app', ['ngCookies']);

MyApp.factory('socket', function ($rootScope) {
    let server = "localhost:82";
    var socket = io.connect(server, {
        'forceNew': true
    });

    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

MyApp.controller("Tree", function ($scope, $location, $http, socket) {
    socket.emit('Hello', {
        Hellou: "DER"
    });
    
    $scope.Homicides = () => {
        socket.emit('Homicides', null, (Homicides) => {
            console.log(Homicides);
            Tree(Homicides, 'Homicides');
        });
    }

    $scope.Autos = () => {
        socket.emit('Autos', null, (Autos) => {
            console.log(Autos);
            Tree(Autos, 'Autos Tree');
        });
    }

    $scope.Filter = () => {
        socket.emit('Gender', null, (Filter) => {
            console.log(Filter);
        });
    }

    socket.on('SetTree', (data) => {
        let keys = Object.keys(data);
        let childs = Rama(data);
        console.log(childs);
        tree.children = childs;
        simple_chart_config = {
            chart: {
                container: "#tree-simple",
                levelSeparation: 20,
                siblingSeparation: 15,
                subTeeSeparation: 15,
                rootOrientation: "NORTH",

                connectors: {
                    type: "straight",
                    style: {
                        "stroke-width": 2,
                        "stroke": "#ccc"
                    }
                }
            },
            nodeStructure: tree
        };
        console.log(simple_chart_config)
        var my_chart = new Treant(simple_chart_config);
    });

    function Tree(data, name) {
        var tree = {
            text: {
                name: name + ' - ' + ' Entropy:'+ ' ' + data.entropy
            },
            children: []
        };
        let childs = Rama(data.trees[ data.index ]);
        tree.children = childs;
        simple_chart_config = {
            chart: {
                container: "#tree-simple",
                //rootOrientation: "NORTH",
                levelSeparation: 20,
                siblingSeparation: 15,
                subTeeSeparation: 15,
                rootOrientation: "NORTH",

                connectors: {
                    type: "straight",
                    style: {
                        "stroke-width": 2,
                        "stroke": "#ccc"
                    }
                }
            },
            nodeStructure: tree
        };
        // console.log(simple_chart_config)
        var my_chart = new Treant(simple_chart_config);
    }

    function Rama(tree) {
        let children = [];
        for (let index in tree) {
            // console.log(tree[index].branches);

            if (tree[index].branches) {
                if (tree[index].cont > 0) {
                    children.push({
                        text: {
                            name: index,
                            title: tree[index].cont
                        },
                        children: Rama(tree[index].branches)
                    });
                }
            } else {
                if (tree[index].cont > 0) {
                    children.push({
                        text: {
                            name: index,
                            title: tree[index].cont
                        },
                    });
                }

            }
        }
        // console.log(children);
        return children;

    }
    function Ramaolddd(json) {
        let children = [];
        for (let index in json) {
            if (Object.keys(json[index]).length > 0) {
                children.push({
                    text: {
                        name: index,
                        title: json[index].length
                    },
                    children: Rama(json[index])
                });
            }
        }
        return children;

    }
});