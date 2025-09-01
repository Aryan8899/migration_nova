//new
import React from "react";
import TokenIcon from "./TokenIcon";
import ConversionRate from "./ConversionRate";
import TokenStats from "./TokenStats";
import LoadingButton from "./LoadingButton";

const ConversionCard = ({
  fromToken,
  toToken,
  rate,
  color,
  icon,
  isLoading,
  onClaimAndStake,
  canClaimToken,
}) => {
  return (
    <div className="bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-600 hover:border-gray-500 transition-colors">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <TokenIcon icon={icon} color={color} />
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">
              {fromToken} → {toToken}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">Conversion Rate</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <ConversionRate rate={rate} fromToken={fromToken} toToken={toToken} />

        <TokenStats rate={rate} />

        <div
          className={`${color.replace("bg-", "bg-")}/10 rounded-lg p-2 sm:p-3`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs sm:text-sm">
            <LoadingButton
              isLoading={isLoading}
              onClick={async () => {
                await onClaimAndStake(fromToken);
                window.location.reload(); // refresh page after success
              }}
              disabled={!canClaimToken}
              className={`w-full sm:w-auto ${
                !canClaimToken
                  ? "opacity-50 cursor-not-allowed bg-gray-600 hover:bg-gray-600"
                  : ""
              }`}
            >
              Claim & Stake
            </LoadingButton>

            <span
              className={`${color.replace(
                "bg-",
                "text-"
              )} font-semibold text-center sm:text-right`}
            >
              1 {fromToken} = {rate} {toToken}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionCard;
