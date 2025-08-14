"use client";

import FAQSection from "@/common-components/FAQSection";
import React, { useEffect, useMemo, useState } from "react";
import TokenHoldings from "./TokenHoldings";
import ConversionRates from "./ConversionRates";

const NOWAMigrationPage = () => {
  return ( 
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            NOWA Migration
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Migration !!!!
          </p>
        </div>

        {/* Migration Components - Responsive Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <TokenHoldings />
            <ConversionRates />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 sm:mt-12 md:mt-16 max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">FAQs</h2>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="border-b border-gray-700 pb-3 sm:pb-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 flex items-center">
                  What is the NOWA airdrop and how do I get it?
                  <span className="ml-2 text-gray-400">-</span>
                </h3>
              </div>
              
              <div className="border-b border-gray-700 pb-3 sm:pb-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 flex items-center">
                  What happens after claiming?
                  <span className="ml-2 text-gray-400">-</span>
                </h3>
              </div>
              
              <div className="border-b border-gray-700 pb-3 sm:pb-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 flex items-center">
                  When will new rewards claims?
                  <span className="ml-2 text-gray-400">-</span>
                </h3>
              </div>
              
              <div className="pb-3 sm:pb-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 flex items-center">
                  How much can I claim and how often?
                  <span className="ml-2 text-gray-400">-</span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Follow Us Section */}
        <div className="mt-8 sm:mt-12 text-center">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-4 sm:mb-6">Follow Us</h3>
          <div className="flex justify-center gap-3 sm:gap-4 md:gap-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
              <span className="text-white text-sm sm:text-base">📧</span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
              <span className="text-white text-sm sm:text-base">🐦</span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
              <span className="text-white text-sm sm:text-base">📱</span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
              <span className="text-white text-sm sm:text-base">🔗</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NOWAMigrationPage;