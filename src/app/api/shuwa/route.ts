import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prismaClient";

export async function GET() {
    const shuwa = await prisma?.shuwa.findMany();
    return NextResponse.json(shuwa);
}