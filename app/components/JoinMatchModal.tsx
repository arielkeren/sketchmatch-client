import { useRouter } from "next/navigation";
import { useRef } from "react";
import { IoMdClose } from "react-icons/io";
import useServer from "../hooks/useServer";
import { isMatchResponse } from "../types";
import useAuth from "../hooks/useAuth";

type Props = {
  close: () => void;
};

const JoinMatchModal: React.FC<Props> = ({ close }) => {
  const input = useRef<HTMLInputElement | null>(null);
  const server = useServer();
  const user = useAuth();
  const router = useRouter();

  const joinMatch = () => {
    if (!input.current || !server || server.readyState !== WebSocket.OPEN)
      return;

    server.send(
      JSON.stringify({
        type: "join",
        code: input.current.value,
        username: user.username,
      })
    );
    console.log("Joining match");
    server.onmessage = event => {
      if (!input.current) return;

      const data = JSON.parse(event.data);
      if (!isMatchResponse(data)) return;

      if (data.type === "join") {
        localStorage.setItem("username", data.username);
        return router.push(`match/${input.current.value}`);
      }
      if (data.type === "error") alert(data.message);
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative flex flex-col justify-center items-center h-1/3 w-2/3 bg-white p-4 rounded-lg">
        <h2 className="text-2xl font-bold">Join Match</h2>
        <input
          ref={input}
          placeholder="Enter match code"
          className="border-2 border-gray-300 p-2 rounded-lg w-72 outline-none transition-colors focus:border-gray-400"
        />
        <button onClick={joinMatch} className="">
          Join
        </button>
        <button onClick={close} className="absolute top-5 right-5 p-1">
          <IoMdClose className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default JoinMatchModal;
