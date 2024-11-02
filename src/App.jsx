import { useState, useEffect } from "react";
import Maze from "./components/Maze";
import Select from "react-select";
import Introduce from "./components/Introduce";
import initPosition from "./datas/initPosition";
import mazesData from "./datas/mazeData";
import MazeSymbols from "./components/MazeSymbols";
import StatisticsDisplay from "./components/StatisticsDisplay";
import API from "./datas/api";
const App = () => {
  const [selectedMazeIndex, setSelectedMazeIndex] = useState(7);

  const initialAresPosition = { ...initPosition[selectedMazeIndex].Ares };
  const initialStones = [...initPosition[selectedMazeIndex].Stones];

  const [aresPosition, setAresPosition] = useState(initialAresPosition);

  const [stones, setStones] = useState(initialStones);

  const [currentStep, setCurrentStep] = useState(0);
  const [weight, setWeight] = useState(0);
  const [time, setTime] = useState(0);
  const [memory, setMemory] = useState(0);

  const [restart, setRestart] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);

  const [aresPathStep, setAresPathStep] = useState([]);
  const [currentPathTemplate, setCurrentPathTemplate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleButtonClick = async (buttonName) => {
    setSelectedButton(buttonName);

    setLoading(true);
    setError(null);

    try {
      setAresPosition(initialAresPosition);
      setStones(initialStones);

      const response = await fetch(`${API}/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          algorithm: buttonName,
          input_file: `input-${(selectedMazeIndex + 1)
            .toString()
            .padStart(2, "0")}.txt`,
          output_file: `output-${(selectedMazeIndex + 1)
            .toString()
            .padStart(2, "0")}.txt`,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setCurrentStep(0);
      setWeight(0);

      const data = await response.json();
      const output = data.output;

      const outputLines = output.split("\n");

      const line = outputLines[1];

      const regex =
        /Steps: (\d+), Weight: (\d+), Node: (\d+), Time \(ms\): ([\d.]+), Memory \(MB\): ([\d.]+)/;

      const match = line.match(regex);

      if (match) {
        setTime(match[4]);
        setMemory(match[5]);
      }

      const path = outputLines[outputLines.length - 2];
      setAresPathStep(path.split(""));
      setCurrentPathTemplate(selectedMazeIndex);
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePosition = (action, number = 0) => {
    let nextPosition;

    if (number !== 0) {
      nextPosition = { ...stones[number - 1] };
      setWeight(weight + nextPosition.w);
      switch (action.toLowerCase()) {
        case "l":
          nextPosition.y -= 1;
          break;
        case "r":
          nextPosition.y += 1;
          break;
        case "u":
          nextPosition.x -= 1;
          break;
        case "d":
          nextPosition.x += 1;
          break;
      }
    } else {
      nextPosition = { ...aresPosition };
      switch (action.toLowerCase()) {
        case "l":
          nextPosition.y -= 1;
          break;
        case "r":
          nextPosition.y += 1;
          break;
        case "u":
          nextPosition.x -= 1;
          break;
        case "d":
          nextPosition.x += 1;
          break;
        default:
          console.log("Invalid action");
          return aresPosition;
      }
    }
    return nextPosition;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStep < aresPathStep.length) {
        const nextAresPosition = updatePosition(aresPathStep[currentStep], 0);
        let nextStones = [...stones];

        for (let i = 0; i < stones.length; i++) {
          let stone = { ...stones[i] };
          if (
            nextAresPosition.x === stone.x &&
            nextAresPosition.y === stone.y
          ) {
            stone = updatePosition(aresPathStep[currentStep], i + 1);

            nextStones[i] = stone;
            setStones(nextStones);
            break;
          }
        }

        setAresPosition(nextAresPosition);
        setCurrentStep(currentStep + 1);
      } else {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [restart, currentStep, aresPathStep]);

  useEffect(() => {
    const initialAresPosition = initPosition[selectedMazeIndex].Ares;
    const initialStones = initPosition[selectedMazeIndex].Stones;

    setAresPosition(initialAresPosition);
    setStones(initialStones);
    setCurrentStep(0);
    setWeight(0);
    setAresPathStep([]);
    setTime(0);
    setMemory(0);
  }, [selectedMazeIndex]);

  const handleMazeChange = (value) => {
    setSelectedMazeIndex(Number(value));
    setSelectedButton(null);
  };

  const handleRestart = () => {
    setAresPosition(initPosition[selectedMazeIndex].Ares);
    setStones(initPosition[selectedMazeIndex].Stones);
    if (currentPathTemplate === selectedMazeIndex) {
      setRestart(!restart);
      setCurrentStep(0);
      setWeight(0);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          algorithm: "ALL",
          input_file: `input-${(selectedMazeIndex + 1)
            .toString()
            .padStart(2, "0")}.txt`,
          output_file: `output-${(selectedMazeIndex + 1)
            .toString()
            .padStart(2, "0")}.txt`,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `output-0${selectedMazeIndex + 1}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up the URL object after download
    } catch (error) {
      setError(error.message || "Failed to download file");
    } finally {
      setLoading(false); // Always turn off loading state here
    }
  };

  const options = mazesData.map((_, index) => ({
    value: index,
    label: `Template ${index + 1}`,
  }));

  return (
    <div className="p-4 flex w-screen h-screen justify-between items-center bg-myDark">
      <div className=" h-screen w-full  flex-col justify-center hidden md:block lg:flex">
        <Introduce />
      </div>

      <div className="p-4 flex justify-end mr-10">
        <div className="flex flex-col items-center mr-7 mt-20">
          <button
            className={` text-white font-bold py-2 px-4 rounded my-5 hover:scale-105 hover:duration-500 transition-transform duration-500 ease-in-out w-24 border-2 hover:shadow-lg hover:shadow-blue-500/50 ${
              selectedButton === "BFS" ? " border-cyan-400 " : " border-white"
            }`}
            onClick={() => handleButtonClick("BFS")}
          >
            BFS
          </button>
          <button
            className={` text-white font-bold py-2 px-4 rounded my-5 hover:scale-105 hover:duration-500 transition-transform duration-500 ease-in-out w-24 border-2 hover:shadow-lg hover:shadow-blue-500/50 ${
              selectedButton === "DFS" ? " border-cyan-400 " : " border-white"
            }`}
            onClick={() => handleButtonClick("DFS")}
          >
            DFS
          </button>
          <button
            className={` text-white font-bold py-2 px-4 rounded my-5 hover:scale-105 hover:duration-500 transition-transform duration-500 ease-in-out w-24 border-2 hover:shadow-lg hover:shadow-blue-500/50 ${
              selectedButton === "UCS" ? " border-cyan-400 " : " border-white"
            }`}
            onClick={() => handleButtonClick("UCS")}
          >
            UCS
          </button>
          <button
            className={` text-white font-bold py-2 px-4 rounded my-5 hover:scale-105 hover:duration-500 transition-transform duration-500 ease-in-out w-24 border-2 hover:shadow-lg hover:shadow-blue-500/50 ${
              selectedButton === "A*" ? " border-cyan-400 " : " border-white"
            }`}
            onClick={() => handleButtonClick("A*")}
          >
            A*
          </button>
        </div>
        <div>
          <div className="flex justify-between items-center mb-7">
            <div className="flex">
              <button
                className="text-white font-bold py-1 px-4 rounded hover:scale-105 hover:duration-500 transition-transform duration-500 ease-in-out hover:bg-gradient-to-r from-cyan-500 via-sky-300 to-blue-500 hover:inline-block hover:text-transparent hover:bg-clip-text hover:shadow-lg hover:shadow-blue-500/50"
                onClick={handleRestart}
              >
                Restart
              </button>

              <button
                className="text-white font-bold py-1 px-4 rounded hover:scale-105 hover:duration-500 transition-transform duration-500 ease-in-out hover:bg-gradient-to-r from-cyan-500 via-sky-300 to-blue-500 hover:inline-block hover:text-transparent hover:bg-clip-text hover:shadow-lg hover:shadow-blue-500/50"
                onClick={handleDownload}
              >
                Downloads
              </button>
            </div>

            <Select
              options={options}
              onChange={(selectedOption) =>
                handleMazeChange(selectedOption.value)
              }
              className="react-select w-60"
              classNamePrefix="react-select"
              placeholder="Select template"
              defaultValue={options[7]}
            />
          </div>
          <div className="relative p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg hover:cursor-pointer flex-shrink-0 hover:scale-105 hover:duration-500  transition-transform duration-500 ease-in-out ">
            <div className="p-9 rounded-lg bg-myDark flex justify-center items-center">
              {/* Maze Component */}
              <Maze
                index={selectedMazeIndex}
                aresPosition={aresPosition}
                stonePosition={stones}
              />
              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <svg
                    className="animate-spin h-10 w-10 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M12 2a10 10 0 0 0-10 10h2a8 8 0 1 1 8 8v2a10 10 0 0 0 0-20z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div className="mt-7 flex flex-col justify-center items-center">
            <MazeSymbols />
            <StatisticsDisplay
              stepCount={currentStep}
              weight={weight}
              time={time}
              memory={memory}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}{" "}
        </div>
      </div>
    </div>
  );
};

export default App;
