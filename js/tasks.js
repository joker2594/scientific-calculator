$(document).ready(function () {
    var taskCompute = $('#compute');
    var taskText = $('#task-text');
    var taskTitle = $('.task h3');
    var taskButton = $('.task button');
    var undoCount = 0;
    var clearCount = 0;
    var i = 1;
    var tasks = [];
    var buttonPressed = false;

    var data = [];
    var clicks_coordinates = [];
    var clicks_times = [];
    var startTime = null;
    var timerStart = true;

    function createTasks() {
        tasks[0] = '';
        tasks[1] = '10 + 25 * 4';
        tasks[2] = '(12 - 35) * 50 / (-5 + 15)';
        tasks[3] = 'log(100) * 12.5';
        tasks[4] = 'sin(5 rad) - cos(5 rad)';
        tasks[5] = '(cos(180 deg))^2 + (sin(90 deg))^2';
        tasks[6] = 'ln(5*e) + sqrt(2025)';
        tasks[7] = '34.5 * ans + 6!';
        tasks[8] = '2^(2 * (5 + 3))/2^(5*2)';
    }

    function recordTaskData() {
        data.push({'clicks': clicks_coordinates, 'times': clicks_times, 'undo': undoCount, 'clear': clearCount});
    }

    function showDataJson() {
        var datajson = JSON.stringify(data);
        console.log(datajson);
    }

    createTasks();

    $('button').click(function () {
        buttonPressed = true;
    });

    $('#start').click(function () {
        startTime = Date.now();
    });

    $('#stop').click(function () {
        startTime = null;
        timerStart = true;
    });

    $('.scientific-calculator').click(function (event) {
        var x = event.clientX;
        var y = event.clientY;

        if (!buttonPressed) {
            alert("no button pressed");
        }
        buttonPressed = false;

        // calculate the time difference since last click
        if (startTime) {
            var endTime = Date.now();
            var difference = endTime - startTime;
            clicks_times.push(difference);
            startTime = Date.now();
        }

        if(timerStart) {
            startTime = Date.now();
            timerStart = false;
        }

        clicks_coordinates.push([x, y]);
        var coords = 'Coords: ' + x + ', ' + y;
        $('.display-coords').text(coords);
        $('.display-coords-array').text('All coords: ' + clicks_coordinates);
    });

    $('#log-array').click(function () {
        showDataJson();
    });

    $('.undo').click(function () {
        undoCount++;
    });

    $('.clear').click(function () {
        clearCount++;
    });

    taskButton.click(function () {
        if (i > 1) {
            recordTaskData();
        }

        clicks_coordinates = [];
        clicks_times = [];
        undoCount = 0;
        clearCount = 0;

        taskTitle.text('Task ' + i);
        taskCompute.text('Compute: ');
        var latex = math.parse(tasks[i]).toTex();
        var elem = MathJax.Hub.getAllJax('task-text')[0];
        MathJax.Hub.Queue(['Text', elem, latex]);

        //taskText.text('`' + tasks[i] + '`');
        taskButton.text('Next task');
        i++;
    });
});
