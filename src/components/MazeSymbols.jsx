const MazeSymbols = () => {
  return (
    <div className="flex justify-start items-center">
      <div className="flex items-center mr-10">
        <img src="ares.png" alt="describe" className="h-10 w-10 mr-3" />

        <p className="text-red-500 font-bold">Ares</p>
      </div>

      <div className="flex items-center mr-10">
        <img src="hole.jpg" alt="describe" className="h-8 w-10 mr-3" />
        <p className="text-yellow-500 font-bold">Hole</p>
      </div>

      <div className="flex items-center">
        <div className="bg-gray-500 w-4 h-4 rounded-full flex items-center justify-center mr-3"></div>
        <p className="text-gray-500 font-bold">Stone</p>
      </div>
    </div>
  );
};

export default MazeSymbols;
