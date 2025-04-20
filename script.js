const rowInput = document.getElementById("srtInput");
const colInput = document.getElementById("columnInput");
const endInput = document.getElementById("endVertex"); // ← новое поле
const generateBtn = document.getElementById("createbtn");
const matrixContainer = document.getElementById("output");
const startDijkstraBtn = document.getElementById("runDijkstra");
const outputResult = document.getElementById("result");

let rowCount, colCount;

generateBtn.addEventListener("click", () => {
  rowCount = parseInt(rowInput.value);
  colCount = parseInt(colInput.value);

  if (
    !rowCount ||
    !colCount ||
    isNaN(rowCount) ||
    isNaN(colCount) ||
    rowCount <= 0 ||
    colCount <= 0
  ) {
    alert("Введите корректные положительные значения");
    return;
  }

  matrixContainer.innerHTML = "";

  for (let i = 0; i < rowCount; i++) {
    const rowElem = document.createElement("div");
    rowElem.style.display = "flex";
    rowElem.style.marginBottom = "5px";

    for (let j = 0; j < colCount; j++) {
      const cellInput = document.createElement("input");
      cellInput.type = "number";
      cellInput.id = `input-${i}-${j}`;
      cellInput.style.width = "50px";
      rowElem.appendChild(cellInput);
    }

    matrixContainer.appendChild(rowElem);
  }
});

startDijkstraBtn.addEventListener("click", () => {
  const SIZE = rowCount;
  const matrix = [];
  const distances = new Array(SIZE).fill(Infinity);
  const visited = new Array(SIZE).fill(1);
  const startVertex = 0;

  const endVertex = parseInt(endInput.value) - 1;

  if (isNaN(endVertex) || endVertex < 0 || endVertex >= SIZE) {
    alert("Введите корректную конечную вершину от 1 до " + SIZE);
    return;
  }

  for (let i = 0; i < SIZE; i++) {
    const row = [];
    for (let j = 0; j < SIZE; j++) {
      const input = document.getElementById(`input-${i}-${j}`);
      let value = parseInt(input?.value || "0");
      if (isNaN(value)) value = 0;
      row.push(value);
    }
    matrix.push(row);
  }

  distances[startVertex] = 0;

  let currentIndex, minDist;
  let countVisited = 0;

  do {
    currentIndex = -1;
    minDist = Infinity;

    for (let i = 0; i < SIZE; i++) {
      if (visited[i] === 1 && distances[i] < minDist) {
        minDist = distances[i];
        currentIndex = i;
      }
    }

    if (currentIndex !== -1) {
      for (let i = 0; i < SIZE; i++) {
        if (matrix[currentIndex][i] > 0 && visited[i] === 1) {
          let tempDist = minDist + matrix[currentIndex][i];
          if (tempDist < distances[i]) {
            distances[i] = tempDist;
          }
        }
      }
      visited[currentIndex] = 0;
      countVisited++;
    }

    if (countVisited === SIZE) {
      break;
    }
  } while (currentIndex !== -1);

  let html = "<h3>Кратчайшие расстояния:</h3><p>";
  for (let i = 0; i < SIZE; i++) {
    html += `До ${i + 1}: ${
      distances[i] === Infinity ? "Нет пути" : distances[i]
    }<br>`;
  }
  html += "</p>";

  let target = endVertex;
  let path = [];
  path.push(target + 1);
  let weight = distances[target];

  while (target !== startVertex) {
    let found = false;
    for (let i = 0; i < SIZE; i++) {
      if (matrix[i][target] !== 0) {
        let temp = weight - matrix[i][target];
        if (temp === distances[i]) {
          weight = temp;
          target = i;
          path.push(i + 1);
          found = true;
          break;
        }
      }
    }

    if (!found) {
      break;
    }
  }

  html += `<h3>Кратчайший путь до вершины ${endVertex + 1}:</h3><p>`;
  for (let i = path.length - 1; i >= 0; i--) {
    html += `${path[i]} `;
  }
  html += "</p>";

  outputResult.innerHTML = html;
});
