import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prismaClient";

export async function GET() {
    const quiz = await prisma?.quiz.findMany();
    return NextResponse.json(quiz);
}