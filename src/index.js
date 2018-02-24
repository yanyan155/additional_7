module.exports = function solveSudoku(matrix) {
	function findSquare(matrix, index) {   
	   	var col = Math.floor(index/3);
	   	var row = index%3;
	   	var piece = matrix.slice(col*3, col*3 + 3);
	   	var lastpiece = piece.map(elem => elem = elem.slice(row*3, row*3 + 3));
	   	var line = lastpiece.reduce(function(prev, curr) {
  			return prev.concat(curr);
		});
	   	return line;
   }

    function fullTheLine(line) { 
    	var unknownCheck = line.some(elem => elem === 0 || Array.isArray(elem));
    	if(line.some(elem => elem === 0)) {
    		ChangesCount++;
    	}
		if (!unknownCheck) {
			return line;
		}

		var allVariation = [1,2,3,4,5,6,7,8,9];
		var knownVariation = line.filter(elem => elem != 0 && !Array.isArray(elem));

		var unknowVariation = []; 
		for(var i = 1; i<10; i++) {
			if(!knownVariation.some(elem=> elem === i)) {
				unknowVariation.push(i);
			}
		}
		for (var i = 0; i< line.length; i++) {
			var elem = line[i];
			if(Array.isArray(elem)) {
				var filteredArrI = []; 
				for(var j = 0; j<line[i].length; j++) {
					if(!knownVariation.some( elem => elem === line[i][j])) {
						filteredArrI.push(line[i][j]);
					}
				}
				line[i] = filteredArrI;
			}
			if(elem === 0) {
				line[i] = unknowVariation;
			}
		}
		return line;
    }

    function findAloneUnknown (line) {
    	var newLine = line.map(function(num) {
    		if(Array.isArray(num) && num.length === 1) {
		  		return num[0];
		  		ChangesCount++;
    		} else {
    			return num;
    		}
		});
    	return newLine;
    }
    function lastHero (line) {
    	var valuesCount = [[1, []],[2, []],[3, []],[4, []],[5, []],[6, []],[7, []],[8, []],[9, []]];
    	var arrList = [];
    	for (var i=0; i<line.length; i++) {
    		if(Array.isArray(line[i])) {
    			arrList.push([line[i], i]);
    		}
    	}
    	for (var i=0; i<arrList.length; i++) {
    		for (var j=0; j<arrList[i][0].length; j++) {
    			var number = arrList[i][0][j];
    			valuesCount[number-1][1].push(arrList[i][1]);
    		}
    	}
    	var res = valuesCount.filter(elem => elem[1].length === 1); // [1, [4]], [2, [7]];
    	if(res.length>0) {
    		for(var k = 0; k<res.length; k++) {
    			var index = res[k][1][0];
    			var value = res[k][0];
    			line[index] = value;

    			ChangesCount++;
    		}
    	}

    	return line;
    }
    function convertColtoRow (matrix, colIndex) {
    	var res = matrix.map(function(elem) {
    		return elem[colIndex];
		});
		return res;
    }
    function addChangesToMatrix (matrix, line, index, type) { 
    	if(type === 'square') {
    		var col = Math.floor(index/3);
	   		var row = index%3;
	   		var count = 0;
	   		for (var i = 3*col; i< 3*col+3; i++) {
	   			for (var j = 3*row; j< 3*row+3; j++) {
	   				matrix[i][j] = line[count];
	   				count++;
	   			}
	   		}
    	}
    	if (type === 'col') {
    		for(var i = 0; i<matrix.length; i++) {
    			matrix[i][index] = line[i];
    		}
    	}
    	if (type === 'row') {
    		matrix[index] = line;
    	}
    	return matrix;
    }
    function isCorrectLine(line) {
    	var isCorrect = true; 
    	var numbers = [];
    	var someError = line.some(elem => elem === null);
    	if (someError) {
    		return false;
    	}
    	for (var i = 0; i<line.length; i++) {

    		var isArr = Array.isArray(line[i]);
    		if(!isArr) {
    			numbers.push(line[i]);
	    	} else if(isArr.length === 0) {
	    		isCorrect = false;
	    		return isCorrect;
	    	}

    	}
    	if(numbers.length > 1) {
	    	numbers = numbers.sort();
	    	for (var i = 1; i<numbers.length; i++) {
	    		if (numbers[i] === numbers[i-1]) {
					isCorrect = false;
					return isCorrect;
	    		}
	    	}
	    }
    	return isCorrect;
    }
    function  isCorrectMatrix(matrix){

    	var isCorrect = true;

    	for(var i = 0; i < matrix.length; i++) {
    		
    		var row = matrix[i];
    		var correctRow = isCorrectLine(row);
    		if(!correctRow) {
    			isCorrect = false;
    			return isCorrect;
    		}
    		
    		var col = convertColtoRow(matrix, i);
    		var correctCol = isCorrectLine(col);
    		if(!correctCol) {
    			isCorrect = false;
    			return isCorrect;
    		}
    		
    		var squareLine = findSquare(matrix, i);
    		var correctSquare = isCorrectLine(squareLine);
    		if(!correctSquare) {
    			isCorrect = false;
    			return isCorrect;
    		}
    	}
     	return isCorrect;
    }

    function isFullMatrix(matrix) {
    	var res = true;
    	for(var i=0; i<9 ;i++) {
    		for(var j=0; j<9 ;j++) {
    			if( Array.isArray(matrix[i][j]) ) {
    				res = false;
    				return false;
    			} 
    		}
    	}
    	return res;
    }

    function startGuessing (isCorrect, isFull) {
    	if(!isFull  && isCorrect) {
    		var titlesAndValues = unknownTitlesAndValues(matrix);
    		var res = guessingNewTitle(matrix, titlesAndValues);
    		return res;
    	}
    	if (changesMatrix.length>0 && !isCorrect) {
    		if(changesMatrix[changesMatrix.length -1].numberCount >=
    		changesMatrix[changesMatrix.length -1].unknownArr.length - 1) {

    			var res = returnGuessingPreviousTitle();
    		return res;
    		} else {
    			var res = continueGuessingThisTitle();
    			return res;
    		}
    	}
    	return new Error('indalid startGuessing fuction result');
    }

    function  unknownTitlesAndValues(matrix){ 
    	var arr = [];
    	for(var i = 0; i<9; i++) {
    		for(var j = 0; j<9; j++) {
    			if(Array.isArray(matrix[i][j])) {
    				var position = i*9+j;
    				arr.push({
    					unknowNum: matrix[i][j],
    					position:position
    				})
    			}
    		}
    	}
    	var res = arr.sort(function(a,b) {
    		return a.unknowNum.length - b.unknowNum.length;
    	});
     	return res;
    }

    function guessingNewTitle(matrix, titlesAndValuesArr){ 

    	var guessArr = titlesAndValuesArr[0].unknowNum;
    	var guessPosition = titlesAndValuesArr[0].position;
    	var copyMatrix = JSON.parse(JSON.stringify(matrix));

    	var changesObj = {
    		matrix: copyMatrix,
    		unknownArr: guessArr,
    		numberCount: 0, 
    		position: guessPosition
    	}
    	changesMatrix.push(changesObj);

    	var guessNumber = titlesAndValuesArr[0].unknowNum[0];
    	var col = Math.floor(guessPosition/9);
    	var row = guessPosition%9;
    	matrix[col][row] = guessNumber;

    	return matrix;

    }
    function continueGuessingThisTitle(){ 

    	var lastObjInfo = changesMatrix[changesMatrix.length-1];
    	lastObjInfo.numberCount++;
    	var number = lastObjInfo.unknownArr[lastObjInfo.numberCount];
    	var col = Math.floor(lastObjInfo.position/9);
    	var row = lastObjInfo.position%9;
    	lastObjInfo.matrix[col][row] = number;

    	return lastObjInfo.matrix;

    }
    function returnGuessingPreviousTitle(){ 

    	while(changesMatrix.length>0 && changesMatrix[changesMatrix.length -1].numberCount >=
    		changesMatrix[changesMatrix.length -1].unknownArr.length - 1)  {
    		changesMatrix.pop();
    	}
    	if(changesMatrix.length>0) {
    		var res = continueGuessingThisTitle();
    		return res;
    	}
    	return new Error('indalid returnGuessingPreviousTitle fuction result');
    	
    }

    var ChangesCount = 1; 
    
    var changesMatrix = [];
    var stop = 0;
    while(ChangesCount > 0) {

    	ChangesCount = 0;
    	for(var i = 0; i<9; i++) {
    		
    		var squareLine = findSquare(matrix, i);
    		var squareFull = fullTheLine(squareLine);
    		var squareNewLine= lastHero (squareFull);
    		matrix = addChangesToMatrix (matrix, squareNewLine, i, 'square');

    		var findRowLine = matrix[i];
    		var rowLine = fullTheLine(findRowLine);
    		var rowNewLine = lastHero (rowLine);
    		matrix = addChangesToMatrix (matrix, rowNewLine, i, 'row');

    		var findColLine = convertColtoRow(matrix, i);
    		var colLine = fullTheLine(findColLine);
    		var colNewLine = lastHero(colLine)
    		matrix = addChangesToMatrix (matrix, colNewLine, i, 'col');

    		for (var j = 0; j<9; j++) {
    			var row = matrix[j];
    			var findAlone = findAloneUnknown(row);
    			matrix = addChangesToMatrix (matrix, findAlone, j, 'row');
    		}
    	}

    	var isCorrect = isCorrectMatrix(matrix);
    	var isFull = isFullMatrix(matrix);
    	if(isFull && isCorrect) {
    		return matrix;
    	}
    	if(!isCorrect && changesMatrix.length === 0) {
    		return false;
    	}
    	if(ChangesCount === 0) {

    		var guessmatrix = startGuessing(isCorrect, isFull);
    		var copyGuess = JSON.parse(JSON.stringify(guessmatrix));
    		matrix = copyGuess;
    		ChangesCount++;

    	};
    }	
    return matrix;
}
