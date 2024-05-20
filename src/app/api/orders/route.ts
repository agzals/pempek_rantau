import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// FETCH ALL ORDERS
export const GET = async (req: NextRequest) => {
  const session = await getAuthSession();

  if (session) {
    try {
      let orders;
      if (session.user.isAdmin) {
        orders = await prisma.order.findMany();
      } else {
        orders = await prisma.order.findMany({
          where: {
            userEmail: session.user.email!,
          },
        });
      }
      return new NextResponse(JSON.stringify(orders), { status: 200 });
    } catch (err) {
      console.log(err);
      return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
  } else {
    return new NextResponse(JSON.stringify({ message: "You are not authenticated" }), { status: 401 });
  }
};

// CREATE ORDER
export const POST = async (req: NextRequest) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(JSON.stringify({ message: "You are not authenticated" }), { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate the incoming data
    const { price, products, status, userEmail, address, city, pos } = body;
    if (!price || !products || !status || !userEmail || !address || !city || !pos) {
      return new NextResponse(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    // Create order for both admin and non-admin users
    const order = await prisma.order.create({
      data: body,
    });

    return new NextResponse(JSON.stringify(order), { status: 201 });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
  }
};
