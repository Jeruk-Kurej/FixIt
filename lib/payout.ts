import { iris } from "@/lib/midtrans";
import prisma from "@/lib/prisma";

export async function processTechnicianPayout(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        technician: true,
        payments: true
      }
    });

    if (!order || !order.technician) {
      throw new Error("Order or Technician not found");
    }

    if (order.status !== "DONE") {
      throw new Error("Order is not yet DONE");
    }

    if (!order.technician.bank_account || !order.technician.bank_name) {
      throw new Error("Technician bank details not provided");
    }

    // Calculate total to payout (e.g., total paid minus platform fee, assuming 0 fee for now)
    const amountToPayout = order.final_cost || order.estimated_cost; 
    // Usually you verify they actually paid `amountToPayout` via the payments list

    // Check if payout already created (to avoid double payout)
    // You might want to track payout_id in Order or Payment.
    
    // Iris requires you to create Beneficiaries and then Create Payout.
    // For simplicity, using createPayout directly (depends on Midtrans Iris API version/method).
    
    // 1. Create Beneficiary (if not exists)
    const beneficiaryData = {
      name: order.technician.bank_owner || "Technician",
      account: order.technician.bank_account,
      bank: order.technician.bank_name,
      alias_name: `tech_${order.technician.id}`,
      email: "tech@example.com"
    };

    // Note: Creating beneficiary is typically done once per technician, or just send it directly if supported.
    await iris.createBeneficiaries(beneficiaryData).catch((e: any) => console.log("Beneficiary might exist", e.message));

    // 2. Create Payout
    const payoutData = {
      payouts: [
        {
          beneficiary_name: beneficiaryData.name,
          beneficiary_account: beneficiaryData.account,
          beneficiary_bank: beneficiaryData.bank,
          beneficiary_email: beneficiaryData.email,
          amount: amountToPayout.toString(),
          notes: `Payout for Order ${order.id}`
        }
      ]
    };

    const payoutResult = await iris.createPayouts(payoutData);
    
    // You should save payoutResult.reference_no in your DB to track
    console.log("Payout created:", payoutResult);

    return { success: true, reference: payoutResult };
  } catch (error: any) {
    console.error("Payout Error:", error);
    return { success: false, error: error.message };
  }
}
