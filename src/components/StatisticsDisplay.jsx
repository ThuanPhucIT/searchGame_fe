import PropTypes from "prop-types";

const StatisticsDisplay = ({ stepCount, weight }) => {
  return (
    <div className="flex items-center text-white mt-3 justify-around">
      <p className="text-md flex items-center">
        <p className="mr-3">Step Count:</p>
        <span className="text-2xl mr-24 font-extrabold  bg-gradient-to-r from-cyan-500 via-sky-300 to-blue-500 inline-block text-transparent bg-clip-text">
          {stepCount}
        </span>
      </p>
      <p className="text-md flex items-center">
        <p className="mr-3">Weight Being Pushed:</p>
        <span className="text-2xl font-extrabold  bg-gradient-to-r from-cyan-500 via-sky-300 to-blue-500 inline-block text-transparent bg-clip-text">
          {weight}
        </span>
      </p>
    </div>
  );
};

export default StatisticsDisplay;

StatisticsDisplay.propTypes = {
  stepCount: PropTypes.number.isRequired,
  weight: PropTypes.number.isRequired,
};
