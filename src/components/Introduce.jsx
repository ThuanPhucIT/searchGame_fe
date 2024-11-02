const Introduce = () => {
  return (
    <div className="flex flex-col items-center text-center my-8">
      <img src="bg.png" alt="describe" className="mb-10" />

      <h1 className="text-4xl font-extrabold  bg-gradient-to-r from-cyan-500 via-sky-300 to-blue-500 inline-block text-transparent bg-clip-text">
        Ares Adventure
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto  font-semibold">
        Welcome to Ares Adventure, where you embark on a thrilling journey
        filled with quests, challenges, and battles. Explore mythical lands,
        gather resources, and become a legendary hero!
      </p>
    </div>
  );
};

export default Introduce;
