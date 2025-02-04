import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { x1, y1, x2, y2, id, keterangan } = body; // Pastikan ini sesuai dengan field di database

    const data = await prisma.koordinat.create({
      data: {
        x1,
        y1,
        x2,
        y2,
        id,
        keterangan, // Pastikan ini sesuai dengan field di database
      },
    });

    return new Response(JSON.stringify({ status: "success", data }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message || "An unknown error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
