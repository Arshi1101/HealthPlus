import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid"); // get user id from query
    const date = searchParams.get("date"); // format: YYYY-MM-DD

    if (!uid || !date) {
      return NextResponse.json({ error: "Missing uid or date" }, { status: 400 });
    }

    const dayCollectionRef = collection(db, "nutritionLogs", uid, date);
    const snapshot = await getDocs(dayCollectionRef);

    if (snapshot.empty) {
      return NextResponse.json({
        water: 0,
        calories: 0,
        protein_g: 0,
        carbohydrates_total_g: 0,
        fat_total_g: 0,
        sugar_g: 0,
        fiber_g: 0,
        cholesterol_mg: 0,
        sodium_mg: 0,
        potassium_mg: 0,
      });
    }

    // Aggregate all logs for that day
    let summary = {
      water: 0,
      calories: 0,
      protein_g: 0,
      carbohydrates_total_g: 0,
      fat_total_g: 0,
      sugar_g: 0,
      fiber_g: 0,
      cholesterol_mg: 0,
      sodium_mg: 0,
      potassium_mg: 0,
    };

    snapshot.forEach(doc => {
      const data = doc.data();
      summary.calories += data.calories || 0;
      summary.protein_g += data.protein || 0;
      summary.carbohydrates_total_g += data.carbs || 0;
      summary.fat_total_g += data.fat || 0;
      summary.sugar_g += data.sugar || 0;
      summary.fiber_g += data.fiber || 0;
      summary.cholesterol_mg += data.cholesterol || 0;
      summary.sodium_mg += data.sodium || 0;
      summary.potassium_mg += data.potassium || 0;
      summary.water += data.water || 0;
    });

    return NextResponse.json(summary);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}