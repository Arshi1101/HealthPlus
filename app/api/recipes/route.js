import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

async function loadRecipes() {
  const filePath = path.join(process.cwd(), "data", "recipes.csv");
  const file = fs.readFileSync(filePath, "utf8");

  // Parse CSV into JSON
  const { data } = Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
  });

  return data;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const cuisine = searchParams.get("cuisine")?.toLowerCase() || "";
    const course = searchParams.get("course")?.toLowerCase() || "";
    const diet = searchParams.get("diet")?.toLowerCase() || "";

    const recipes = await loadRecipes();

    const filtered = recipes.filter((r) => {
      const nameMatch = query
        ? r.name?.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query)
        : true;

      const cuisineMatch = cuisine ? r.cuisine?.toLowerCase() === cuisine : true;
      const courseMatch = course ? r.course?.toLowerCase() === course : true;
      const dietMatch = diet ? r.diet?.toLowerCase() === diet : true;

      return nameMatch && cuisineMatch && courseMatch && dietMatch;
    });

    return NextResponse.json(filtered);
  } catch (err) {
    return NextResponse.json(
      { error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}