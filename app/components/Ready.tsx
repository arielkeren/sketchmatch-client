import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

type Props = {
  isReady: boolean;
  readyUp: (() => void) | null;
};

const Ready: React.FC<Props> = ({ isReady, readyUp }) => {
  if (readyUp)
    return (
      <button
        onClick={readyUp}
        disabled={isReady}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-gray-800 rounded-full p-5"
      >
        {isReady ? (
          <FaCheck className="text-green-500 text-6xl" />
        ) : (
          <IoMdClose className="text-red-500 text-6xl" />
        )}
      </button>
    );

  return (
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-gray-800 rounded-full p-5">
      {isReady ? (
        <FaCheck className="text-green-500 text-6xl" />
      ) : (
        <IoMdClose className="text-red-500 text-6xl" />
      )}
    </div>
  );
};

export default Ready;
