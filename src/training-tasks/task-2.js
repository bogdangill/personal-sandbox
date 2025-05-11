const solution = () => {
    function Calculator() {
        this.operator;
        this.operation;
        this.calculate = function(str) {
            const args = str.split(' ').map(item => Number(item)).filter(item => !isNaN(item));
            let operator = str.split(' ').filter(item => item === '+' || item === '-').join('');
            
            if (operator === '+') {
                return args.reduce((acc, item) => acc + item);
            } else if (operator === '-') {
                return args.reduce((acc, item) => Math.abs(acc) - item);
            } else {
                operator = this.operator;
                return this.operation(args[0], args[1]);
            }
        }
        this.addMethod = function(name, func) {
            this.operator = name;
            this.operation = func;
        }
    }
    
    let calc = new Calculator;
    console.log(calc.calculate("8 + 4"));
    console.log(calc.calculate("8 - 4"));
    calc.addMethod('*', (a, b) => a * b);
    console.log(calc.calculate("72 * 9"));
    
    /* alert( calc.calculate("3 + 7") ); // 10 */
} 

export default solution