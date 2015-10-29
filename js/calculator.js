$(document).ready(function () {

    var basic_operators = ["+", "*", "/", "-"];
    var operators = ["+", "-", "*", "/", "("];
    var special_operators = ["+", "*", "/"];
    // var mathFunctions = ['sin(', 'cos(', 'tan(', 'log(', 'sqrt(', '^('];
    // var brackets = ["(", ")"];
    var expression = "";
    var textBox = $("#calc-textbox");
    var degSwitch = $("[name='rad-checkbox']");
    var radians = true;
    var lastResult = null;
    var removeLastResult = false;

    textBox.val("");

    function allowSpecialOperators(expr) {
        return !((expr.length == 0) || ($.inArray(expr[expr.length - 1], operators) > -1));
    }

    function allowMinus(expr) {
        return !((expr[expr.length - 1] == "-") || (($.inArray(expr[expr.length - 1], operators) > -1) && ($.inArray(expr[expr.length - 2], operators) > -1)));
    }

    function allowPoint(expr) {
        if (!$.isNumeric(expr[expr.length - 1])) return false;
        for (var i = expr.length - 1; i >= 0; i--) {
            if (expr[i] == '.') {
                var subExpr = expr.substring(i + 1, expr.length - 1);
                for (var j = 0; j < subExpr.length; j++) {
                    if (!$.isNumeric(subExpr[j])) return true;
                }
                return false;

            }
        }
        return true;
    }

    function checkBrackets(expr) {
        var bracketsBalance = 0;
        for (var i = 0; i < expr.length; i++) {
            if (expr.charAt(i) == '(') bracketsBalance += 1;
            if (expr.charAt(i) == ')') bracketsBalance -= 1;
        }
        return bracketsBalance == 0;
    }

    degSwitch.on('switchChange.bootstrapSwitch', function(event, state) {
        radians = state;
    });

    degSwitch.bootstrapSwitch();

    $('button').click(function () {
        var value = $(this).val();
        if (removeLastResult) {
            if (($.inArray(value, basic_operators) == -1)) {
                expression = "";
                textBox.val("");

            }
            removeLastResult = false;

        }
    });

    $('.normal-btn').click(function () {
        var value = $(this).val();

        if (value == "-" && !allowMinus(expression)) value = "";
        if (($.inArray(value, special_operators) > -1) && !allowSpecialOperators(expression)) value = "";

        expression += value;
        textBox.val( function( index, val ) {
            return val + value;
        });

    });

    $('.func-btn').click(function () {
        var value = $(this).val();
        switch (value) {
            case 'sin(':
                if (!radians) value = 'sindeg(';
                break;
            case 'cos(':
                if (!radians) value = 'cosdeg(';
                break;
            case 'tan(':
                if (!radians) value = 'tandeg(';
                break;
            case 'log(':
                value = 'log10(';
                break;
            case 'ln(':
                value = 'log(';
                break;
        }
        expression += value;
        textBox.val( function( index, val ) {
            return val + value;
        });
    });

    $('.ob-btn').click(function () {
        expression += '(';
        textBox.val( function( index, val ) {
            return val + '(';
        });
    });

    $('.cb-btn').click(function () {
        expression += ')';
        textBox.val( function( index, val ) {
            return val + ')';
        });
    });

    $('.point').click(function () {
        if (allowPoint(expression)) {
            expression += '.';
            textBox.val( function( index, val ) {
                return val + '.';
            });
        }
    });

    $('.evaluate').click(function () {
        if (checkBrackets(expression)) {
            var parser = math.parser();

            // add trig functions for degrees
            parser.eval('sindeg(x) = sin(x deg)');
            parser.eval('cosdeg(x) = cos(x deg)');
            parser.eval('tandeg(x) = tan(x deg)');

            lastResult = parser.eval(expression);
            $('.display-result h4').text(expression + ' = ' + lastResult);
            expression = lastResult;
            textBox.val(expression);
            removeLastResult = true;
        } else alert('brackets error');

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
