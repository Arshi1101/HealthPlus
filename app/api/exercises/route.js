import { NextResponse } from "next/server";
import data from "../../../data/free-exercise-db/dist/exercises.json";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") || "").toLowerCase();
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    let results = data;
    if (query) {
      results = results.filter((ex) => {
        const name = (ex?.name || "").toLowerCase();
        const equipment = (ex?.equipment || "").toLowerCase();
        const category = (ex?.category || "").toLowerCase();
        const primary = (ex?.primaryMuscles || []).join(" ").toLowerCase();
        const secondary = (ex?.secondaryMuscles || []).join(" ").toLowerCase();
        return (
          name.includes(query) ||
          equipment.includes(query) ||
          category.includes(query) ||
          primary.includes(query) ||
          secondary.includes(query)
        );
      });
    }
    results = results.slice(0, limit);
    return NextResponse.json(results);
  } catch (err) {
    console.error("Detailed error in /api/exercises:", err);
    return NextResponse.json(
      { error: "Failed to fetch exercises", details: err.message },
      { status: 500 }
    );
  }
}