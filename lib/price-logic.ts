export type ApplianceType = "AC" | "Kulkas" | "Mesin Cuci";
export type ProblemType = "Mati Total" | "Kurang Dingin" | "Bocor" | "Suara Kasar" | "Error Code" | "Lainnya";

export interface CostEstimate {
  minCost: number;
  maxCost: number;
  description: string;
}

export function calculateEstimatedCost(
  appliance: ApplianceType | "",
  problem: ProblemType | ""
): CostEstimate | null {
  if (!appliance || !problem) return null;

  const baseServiceFee = 100000; // Biaya kedatangan & pengecekan dasar

  let minCost = baseServiceFee;
  let maxCost = baseServiceFee;
  let description = "Estimasi belum termasuk penggantian sparepart berat.";

  switch (appliance) {
    case "AC":
      if (problem === "Kurang Dingin") {
        minCost += 150000; // Tambah freon
        maxCost += 350000; // Cuci besar + freon
        description = "Termasuk biaya cuci dan penambahan freon standar.";
      } else if (problem === "Bocor") {
        minCost += 100000;
        maxCost += 250000;
        description = "Pembersihan saluran pembuangan atau perbaikan insulasi pipa.";
      } else if (problem === "Mati Total") {
        minCost += 200000;
        maxCost += 800000;
        description = "Pengecekan modul PCB atau masalah kompresor.";
      } else {
        minCost += 50000;
        maxCost += 200000;
      }
      break;

    case "Kulkas":
      if (problem === "Kurang Dingin") {
        minCost += 200000;
        maxCost += 500000;
        description = "Pengecekan jalur freon, evaporator, atau kipas kulkas.";
      } else if (problem === "Mati Total") {
        minCost += 250000;
        maxCost += 1200000;
        description = "Kemungkinan perbaikan kompresor atau modul utama.";
      } else {
        minCost += 100000;
        maxCost += 300000;
      }
      break;

    case "Mesin Cuci":
      if (problem === "Mati Total") {
        minCost += 150000;
        maxCost += 600000;
        description = "Pengecekan modul elektronik, kabel, atau dinamo penggerak.";
      } else if (problem === "Suara Kasar") {
        minCost += 200000;
        maxCost += 700000;
        description = "Pengecekan bearing, gearbox, atau suspensi tabung.";
      } else if (problem === "Error Code") {
        minCost += 100000;
        maxCost += 400000;
        description = "Perbaikan sensor pintu, water inlet, atau water level.";
      } else {
        minCost += 100000;
        maxCost += 300000;
      }
      break;
  }

  return { minCost, maxCost, description };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
