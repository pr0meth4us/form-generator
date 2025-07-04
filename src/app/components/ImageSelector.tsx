"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const DEFAULT_REASONS = [
  "Clarity", "Concise", "Simplicity", "Professional",
  "Informative", "Intuitive", "More Technical", "Less Technical"
];

interface ImageSelectorProps {
  title?: string;
  instructions: string;
  options: string[];
  reasons?: string[];
  singleSelect?: boolean;
  labels?: string[];
  onSelectionComplete?: (selection: {
    image: string | null;
    reasons: string[];
    customReason?: string;
  }) => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
                                                              title,
                                                              instructions,
                                                              options,
                                                              reasons: customReasonsProp,
                                                              onSelectionComplete,
                                                              singleSelect = false,
                                                              labels
                                                            }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState<string>("");

  // MODIFIED: More specific logic for rendering UI elements
  const isCustomReasonsProvided = customReasonsProp !== undefined;
  // Use custom reasons if they exist (even if empty), otherwise use default
  const displayReasonsAsButtons = isCustomReasonsProvided ? customReasonsProp : DEFAULT_REASONS;
  // The free-text input should only show if the creator did NOT provide a custom list.
  const showFreeTextInput = !isCustomReasonsProvided;

  const sendCompleteSelection = (
    image: string | null = selectedImage,
    reasons: string[] = selectedReasons,
    custom: string = customReason
  ) => {
    onSelectionComplete?.({
      image,
      reasons,
      customReason: custom
    });
  };

  const handleImageSelect = (option: string) => {
    const newSelectedImage = singleSelect
      ? (option === selectedImage ? null : option)
      : option;
    setSelectedImage(newSelectedImage);
    sendCompleteSelection(newSelectedImage);
  };

  const handleReasonToggle = (reason: string) => {
    const updatedReasons = selectedReasons.includes(reason)
      ? selectedReasons.filter((r) => r !== reason)
      : [...selectedReasons, reason];
    setSelectedReasons(updatedReasons);
    sendCompleteSelection(undefined, updatedReasons);
  };

  const handleCustomReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCustomReason = e.target.value;
    setCustomReason(newCustomReason);
    sendCompleteSelection(undefined, undefined, newCustomReason);
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-6">
      {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}
      <p className="text-gray-600">{instructions}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {options.map((option, index) => (
          <motion.div
            key={`${option}-${index}`}
            className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out ${
              selectedImage === option
                ? "border-blue-500 ring-4 ring-blue-200"
                : "border-gray-200 hover:border-blue-300"
            } flex flex-col`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleImageSelect(option)}
          >
            <div className="relative w-full h-[300px]">
              <Image
                src={option}
                alt={labels && labels[index] ? labels[index] : `Option ${index + 1}`}
                fill
                style={{
                  objectFit: "contain",
                  objectPosition: "center",
                }}
                priority
                unoptimized
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/400x300/eee/ccc?text=Image+Not+Found`;
                }}
              />
            </div>
            {selectedImage === option && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                <Check size={20} />
              </div>
            )}
            {labels && labels[index] && (
              <div className="p-2 text-center bg-gray-50 mt-auto">
                <span className="text-sm font-medium text-gray-700">
                  {labels[index]}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {selectedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          {/* MODIFIED: Conditionally render the "Why" section based on button presence */}
          {displayReasonsAsButtons && displayReasonsAsButtons.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-gray-800">
                Why did you choose this option?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {displayReasonsAsButtons.map((reason, index) => (
                  <motion.button
                    key={`${reason}-${index}`}
                    type="button"
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ease-in-out ${
                      selectedReasons.includes(reason)
                        ? "bg-blue-100 text-blue-800 ring-2 ring-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReasonToggle(reason)}
                  >
                    <span className="text-sm font-medium">{reason}</span>
                    {selectedReasons.includes(reason) ? (
                      <Check size={18} className="text-blue-600" />
                    ) : (
                      <X size={18} className="text-gray-400" />
                    )}
                  </motion.button>
                ))}
              </div>
            </>
          )}

          {/* MODIFIED: This block now handles all cases for the free-text input */}
          {showFreeTextInput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Why?
              </h3>
              <textarea
                className="w-full p-3 border rounded-lg text-sm"
                placeholder="Optional but a thought out paragraph on why you chose what you chose is very appreciated"
                value={customReason}
                onChange={handleCustomReasonChange}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};