import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    const body = await req.json();
    const { status, trackingNumber } = body; // Ambil status dan trackingNumber dari body

    await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: status,
        trackingNumber: trackingNumber, // Perbarui trackingNumber di database
      },
    });

    return new NextResponse(JSON.stringify({ message: "Order Sudah di Update!" }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
  }
};
