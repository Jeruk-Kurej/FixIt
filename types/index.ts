export type ApplianceType = "AC" | "Kulkas" | "Mesin Cuci";
export type ProblemType = "Mati Total" | "Kurang Dingin" | "Bocor" | "Suara Kasar" | "Error Code" | "Lainnya";

export interface CostEstimate {
  minCost: number;
  maxCost: number;
  description: string;
}

export type ServiceType = "HOME_SERVICE" | "WORKSHOP_VISIT";
