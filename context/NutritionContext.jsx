"use client";

import { createContext, useState, useContext } from "react";

const NutritionContext = createContext();

export const NutritionProvider = ({ children }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  return (
    <NutritionContext.Provider value={{ refreshFlag, setRefreshFlag }}>
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => useContext(NutritionContext);