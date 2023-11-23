import React from "react";

export const CampaignDataContext = React.createContext<{ fetchCampaignData: () => Promise<void>; } | null>(null);