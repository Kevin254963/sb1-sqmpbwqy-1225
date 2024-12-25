import React from 'react';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What's included in the total price?",
    answer: "The total price includes the product cost, shipping fee, and estimated customs tax. The final customs charges may vary slightly based on your local customs authority's assessment. We handle all customs clearance procedures to ensure a smooth import process."
  },
  {
    question: "How are customs taxes calculated?",
    answer: "We calculate customs taxes based on the HS codes of the products and your destination country's import duty rates. Our experienced team ensures accurate customs declarations and tax calculations to avoid any delays or additional charges."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept wire transfers (T/T) and letters of credit (L/C) for international transactions. Payment terms and details will be provided after inquiry confirmation."
  },
  {
    question: "Do you provide commercial documentation?",
    answer: "Yes, we provide all necessary commercial documentation including commercial invoice, packing list, certificate of origin, and customs declaration forms. Our team handles all documentation required for smooth customs clearance."
  }
];

export default function FAQ() {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-6">
      <div className="flex items-center mb-4">
        <HelpCircle className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="font-medium">Important Information About Your Order</h3>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="group">
            <summary className="list-none flex justify-between items-center cursor-pointer">
              <span className="text-sm font-medium">{faq.question}</span>
              <span className="ml-6 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}