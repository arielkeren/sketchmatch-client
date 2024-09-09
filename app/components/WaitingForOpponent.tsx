import { useParams } from "next/navigation";
import { Params } from "../types";

const WaitingForOpponent: React.FC = () => {
  const params = useParams<Params>();

  const copyCode = () => navigator.clipboard.writeText(params.code);

  return (
    <div className="flex flex-col justify-center flex-1 items-center gap-3 bg-gray-900">
      <h1 className="font-bold text-4xl text-white">Waiting for opponent</h1>
      <button
        onClick={copyCode}
        className="text-xl font-bold bg-gray-100 py-2 px-12 rounded uppercase drop-shadow-lg transition-colors duration-200 hover:bg-gray-300"
      >
        Copy Code
      </button>
    </div>
  );
};

export default WaitingForOpponent;
