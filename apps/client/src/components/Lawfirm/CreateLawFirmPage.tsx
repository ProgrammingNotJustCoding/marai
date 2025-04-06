import React, { useState } from "react";
import instance from "../../api/axios";

interface FormData {
  name: string;
  address: string;
  phone: string;
  email: string;
}

const LawFirmRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await instance.post(`/lawfirms`, formData, {
        headers: {
          "Content-Type": "application/json",
          withCredentials: true,
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Error: ${response.status}`);
      }

      setSuccess(true);
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 bg-neutral-900 rounded-lg shadow-lg border border-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-200">
            Register Your Law Firm
          </h1>
          <p className="text-gray-400 mt-2">
            Complete the form below to create your law firm profile
          </p>
        </div>

        {success ? (
          <div className="bg-gray-800 p-4 rounded-md text-center">
            <p className="text-green-400 font-semibold">
              Your law firm has been successfully registered!
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition duration-300"
            >
              Register Another Firm
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Firm Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter law firm name"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-300"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter full address"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-300"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter email address"
              />
            </div>

            {error && (
              <div className="bg-gray-800 p-3 rounded-md">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-md transition duration-300 flex justify-center items-center"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                "Register Law Firm"
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2025 Marai Legal Registration Portal | All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default LawFirmRegistrationForm;
