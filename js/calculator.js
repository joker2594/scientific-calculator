$(document).ready(function () {

    var operators = ["+", "-", "*", "/", "("];
    var special_operators = ["+", "*", "/"];
    // var mathFunctions = ['sin(', 'cos(', 'tan(', 'log(', 'sqrt(', '^('];
    // var brackets = ["(", ")"];
    var expression = "";
    var openBrackets = 0;
    var closeBrackets = 0;
    var textBox = $("#calc-textbox");
    var degSwitch = $("[name='rad-checkbox']");
    var radians = true;
    var lastResult = null;

    function allowSpecialOperators(expr) {
        return !((expr.length == 0) || ($.inArray(expr[expr.length - 1], operators) > -1));

    }

    function allowMinus(expr) {
        return !((expr[expr.length - 1] == "-") || (($.inArray(expr[expr.length - 1], operators) > -1) && ($.inArray(expr[expr.length - 2], operators) > -1)));
    }

    degSwitch.on('switchChange.bootstrapSwitch', function(event, state) {
        radians = state;
    });

    degSwitch.bootstrapSwitch();

    $('.normal-btn').click(function () {
        var value = $(this).val();

        //if (value.indexOf("(") > -1) openBrackets++;
        //else if (value.indexOf(")") > -1) closeBrackets++;
        if (value == "-" && !allowMinus(expression)) value = "";
        if (($.inArray(value, special_operators) > -1) && !allowSpecialOperators(expression)) value = "";

        expression += value;
        textBox.val( function( index, val ) {
            return val + value;
        });

    });

    $('.log-btn').click(function () {
        // mathjs is SHIT
    });

    $('.deg-btn').click(function () {
        // same problem as above
    });

    $('.ob-btn').click(function () {
        openBrackets++;
        expression += '(';
        textBox.val( function( index, val ) {
            return val + '(';
        });
    });

    $('.cb-btn').click(function () {
        closeBrackets++;
        expression += ')';
        textBox.val( function( index, val ) {
            return val + ')';
        });
    });

    $('.evaluate').click(function () {
        //check brackets
        // write algorithm for replacing logs and trig functions for degrees
        var answer = math.eval(expression);
        expression = "";
        lastResult = answer;
        textBox.val("");
        $('.display-result h2').text('Ans: ' + lastResult);
    });

    $('.undo').click(function () {
        if (expression.length > 0 && expression[expression.length - 1] == '(') {
            if (expression.length > 1) {
                switch (expression[expression.length - 2]) {
                    case 'g':
                    case 's':
                    case 'n':
                        if (expression[expression.length - 3] == "l") expression = expression.substring(0, expression.length - 3);
                        else expression = expression.substring(0, expression.length - 4);
                        textBox.val(expression);
                        break;
                    case 't':
                        expression = expression.substring(0, expression.length - 5);
                        textBox.val(expression);
                        break;
                    case '^':
                        expression = expression.substring(0, expression.length - 2);
                        textBox.val(expression);
                        break;
                    case '(':
                    case ')':
                        expression = expression.substring(0, expression.length - 1);
                        textBox.val(expression);
                        break;
                }
            } else {
                    expression = "";
                    textBox.val(expression);
                }
        } else {
            expression = expression.substring(0, expression.length - 1);
            textBox.val(expression);
        }
    });

    $('.clear').click(function () {
        textBox.val("");
        expression = "";
    });

    $('.ans').click(function () {
        if (lastResult != null) {
            expression += lastResult;
            textBox.val(function (index, val) {
                return val + lastResult;
            });
        }

    });

    $('a').click(function () {

    });

    $('b').click(function () {

    });

    $('c').click(function () {

    });




});
