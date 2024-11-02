import mazesData from "../datas/mazeData";
import PropTypes from "prop-types";

const Maze = ({ index, aresPosition, stonePosition }) => {
  const cellSize = 40;
  let defaultMaze = mazesData[index];

  const mazeWithArec = defaultMaze.map((row, rowIndex) => {
    const newRow = row.split("");

    stonePosition.forEach((stone) => {
      if (stone.x === rowIndex && newRow[stone.y] !== ".") {
        newRow[stone.y] = `$`;
      }
    });

    if (rowIndex === aresPosition.x) {
      newRow[aresPosition.y] = "@";
    }
    return newRow.join("");
  });

  return (
    <svg
      width={mazeWithArec[0].length * cellSize}
      height={mazeWithArec.length * cellSize}
      className="border border-black"
    >
      {mazeWithArec.map((row, rowIndex) =>
        row.split("").map((cell, colIndex) => {
          const cellColor = getCellColor(cell);
          return cell === "#" ? (
            <rect
              key={`${rowIndex}-${colIndex}`}
              x={colIndex * cellSize}
              y={rowIndex * cellSize}
              width={cellSize}
              height={cellSize}
              fill={cellColor}
            />
          ) : (
            <g key={`${rowIndex}-${colIndex}`}>
              {cell === "@" ? (
                <image
                  href="ares.png"
                  x={colIndex * cellSize + (cellSize - (cellSize - 10)) / 2} // Centering the image
                  y={rowIndex * cellSize + (cellSize - (cellSize - 10)) / 2} // Centering the image
                  width={cellSize - 10}
                  height={cellSize - 10}
                />
              ) : cell === "." ? (
                // Rendering the hole image
                <image
                  href="hole.jpg"
                  x={colIndex * cellSize + (cellSize - (cellSize - 10)) / 2}
                  y={rowIndex * cellSize + (cellSize - (cellSize - 10)) / 2}
                  width={cellSize - 10}
                  height={cellSize - 10}
                />
              ) : (
                <circle
                  cx={colIndex * cellSize + cellSize / 2}
                  cy={rowIndex * cellSize + cellSize / 2}
                  r={cell === "$" ? cellSize / 4 : cellSize / 6}
                  fill={cellColor}
                />
              )}
              {stonePosition.map((stone, index) =>
                stone.x === rowIndex && stone.y === colIndex ? (
                  <text
                    key={`stone-${index}`}
                    x={stone.y * cellSize + cellSize / 2}
                    y={stone.x * cellSize + cellSize / 2 + 5}
                    textAnchor="middle"
                    fill="yellow"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {stone.w}
                  </text>
                ) : null
              )}
            </g>
          );
        })
      )}
    </svg>
  );
};

const getCellColor = (cell) => {
  switch (cell) {
    case "#":
      return "#7B4B3A"; // Màu nâu cho tường
    case ".":
      return "#38B2AC"; // Màu xanh cho cánh cửa
    case "@":
      return "#F56565"; // Màu đỏ cho Arec
    case "$":
      return "#696969"; // Màu cho đá
    default:
      return "#050119"; // Màu cho ô trống
  }
};

export default Maze;

Maze.propTypes = {
  index: PropTypes.number.isRequired, // Change this line
  aresPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  stonePosition: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    })
  ),
};
