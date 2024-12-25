import React from 'react';
import type { ShippingRegistrationData } from '../../../types/shipping';

interface RegistrationFieldsProps {
  data: ShippingRegistrationData;
  onChange: (field: keyof ShippingRegistrationData, value: any) => void;
}

export default function RegistrationFields({
  data,
  onChange
}: RegistrationFieldsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof ShippingRegistrationData, value);
  };

  return (
    <>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={data.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={data.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter any password you'd like to use
        </p>
      </div>
    </>
  );
}