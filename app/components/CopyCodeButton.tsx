import { useParams } from "next/navigation";
import { Params } from "../types";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";

const CopyCodeButton: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const params = useParams<Params>();

  const copyCode = () => {
    navigator.clipboard.writeText(params.code);
    setIsCopied(true);
  };

  useEffect(() => {
    if (!isCopied) return;

    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <button
      onClick={copyCode}
      className="flex items-center gap-1 text-xl font-bold bg-gray-100 py-2 px-12 rounded uppercase drop-shadow-lg transition-colors duration-200 hover:bg-gray-300"
    >
      {isCopied ? (
        <>
          <FaCheck className="text-green-600" /> Copied
        </>
      ) : (
        "Copy code"
      )}
    </button>
  );
};

export default CopyCodeButton;
