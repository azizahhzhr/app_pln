import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { x1, y1, x2, y2, keterangan } = body; // Pastikan ini sesuai dengan field di database

    const updated = await prisma.koordinat.update({
      where: { id },
      data: {
        x1,
        y1,
        x2,
        y2,
        keterangan, // Pastikan ini sesuai dengan field di database
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengupdate data" },
      { status: 500 }
    );
  }
}
