import PropTypes from "prop-types";

const StatisticsDisplay = ({ stepCount, weight, time, memory }) => {
  return (
    <div className="flex  text-white mt-3 ">
      <p className="text-md flex items-center">
        <p className="mr-3">Steps:</p>
        <span className="text-2xl mr-4 font-extrabold  bg-gradient-to-r from-cyan-500 via-sky-300 to-blue-500 inline-block text-transparent bg-clip-text">
          {stepCount}
        </span>
      </p>
      <p className="text-md flex items-center">
        <p className="mr-3">Weight:</p>
        <span className="text-2xl mr-4  font-extrabold  bg-gradient-to-r from-cyan-500 via-sky-300 to-blue-500 inline-block text-transparent bg-clip-text">
          {weight}
        </span>
      </p>
      <p className="text-md flex items-center">
        <p className="mr-3">Time(ms):</p>
        <span className="text-2xl mr-4 font-extrabold  bg-gradient-to-r from-cyan-500 via-sky-300 to-blue-500 inline-block text-transparent bg-clip-text">
          {time}
        </span>
      </p>
      <p className="text-md flex items-center">
        <p className="mr-3">Memory(MB):</p>
        <span className="text-2xl font-extrabold  bg-gradient-to-r from-cyan-500 via-sky-300 to-blue-500 inline-block text-transparent bg-clip-text">
          {memory}
        </span>
      </p>
    </div>
  );
};

export default StatisticsDisplay;

StatisticsDisplay.propTypes = {
  stepCount: PropTypes.number.isRequired,
  weight: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  memory: PropTypes.number.isRequired,
};
