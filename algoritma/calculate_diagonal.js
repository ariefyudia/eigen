function calculateDiagonalSum(matrix) {
    const size = matrix.length;
    let mainSum = 0;
    let secondarySum = 0;
  
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i === j) {
          mainSum += matrix[i][j];
        }
        if (i + j === size - 1) {
          secondarySum += matrix[i][j];
        }
      }
    }
      var result = mainSum - secondarySum;
    return {
      mainSum,
      secondarySum,
      result
    };
  }
  
  const Matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]
  console.log(calculateDiagonalSum(Matrix))