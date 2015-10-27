$(document).ready(function () {
    var taskCompute = $('#compute');
    var taskText = $('#task-text');
    var taskTitle = $('.task h3');
    var taskButton = $('.task button');
    var i = 1;
    var ops = ['+', '-', '*', '/'];
    var tasks = [];
    var parenthesis = 'keep';

    function createTasks() {
        tasks[0] = '';

        tasks[1] = '( 10 + 25 ) / 5';
        tasks[2] = '1 + (10 + 10) / 100';

        tasks[3] = 'sqrt(75 / 3) + det([[-1, 2], [3, 1]]) - sin(pi / 4)^2';


    }

    createTasks();

    taskButton.click(function () {
        taskTitle.text('Task ' + i);
        taskCompute.text('Compute: ');


        var latex = math.parse(tasks[i]).toTex({parenthesis: parenthesis});
        var elem = MathJax.Hub.getAllJax('task-text')[0];
        MathJax.Hub.Queue(['Text', elem, latex]);

        //taskText.text(latex);
        taskButton.text('Next task');
        i++;
    });
});
