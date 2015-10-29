$(document).ready(function () {
    var taskCompute = $('#compute');
    var taskText = $('#compute2');
    var taskText2 = $('#compute3');
    var taskTitle = $('.task h3');
    var taskButton = $('.task button');
    var undoCount = 0;
    var clearCount = 0;
    var missClickCount = 0;
    var buttonsPressed = [];
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
        tasks[1] = '10 + 25 * 4 + log(100)';
        tasks[2] = 'sin(5) - cos(180 deg)';
        tasks[3] = '(cos(180))^2 + (sin(90))^2 + 4!';
    }

    function recordTaskData() {
        data.push({'buttons': buttonsPressed, 'clicks': clicks_coordinates, 'times': clicks_times, 'errors': undoCount + clearCount + missClickCount});
    }

    function showDataJson() {
        var datajson = JSON.stringify(data);
        console.log(datajson);
    }

    createTasks();


    $('button').click(function () {
        buttonPressed = true;
    });

    $('.scientific-calculator').click(function (event) {
        var x = event.clientX;
        var y = event.clientY;

        if (!buttonPressed) {
            missClickCount++;

        }


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

        if (buttonPressed) {
            clicks_coordinates.push([x, y]);
            var coords = 'Coords: ' + x + ', ' + y;
            $('.display-coords').text(coords);
            $('.display-coords-array').text('All coords: ' + clicks_coordinates);
        }
        buttonPressed = false;

    });

    $('.scientific-calculator button').click(function () {
        var value = $(this).val();
        if (i > 0) if (value != 'undo' && value != 'c') buttonsPressed.push(value);
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
        buttonsPressed = [];

        taskText.text("");
        taskTitle.text('Task ' + i);
        taskCompute.text('Compute: ');
        if (i < 4) {
            var latex = math.parse(tasks[i]).toTex();
            var elem = MathJax.Hub.getAllJax('task-text')[0];
            MathJax.Hub.Queue(['Text', elem, latex]);
        }

        if (i < 2) taskButton.text('Next task');
        else if (i==3) {
            taskButton.text("Show results");
        }
        else if (i==4) showDataJson();
        i++;
    });
});
