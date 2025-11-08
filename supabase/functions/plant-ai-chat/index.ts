import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, currentPlant } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a specialized Plant AI Assistant with deep knowledge of Malaysia's tropical climate and local agriculture.

EXPERTISE AREAS:
- Malaysian climate zones (lowland tropical, highland, coastal)
- Local plants: Pandan, Kangkung, Bayam, Cili Padi, Kesum, Serai, Bunga Kantan, Pegaga
- Tropical vegetables: Tomatoes, Cucumbers, Long Beans, Lady's Fingers (Okra)
- Herbs: Thai Basil, Vietnamese Coriander, Curry Leaves
- Fruits: Papaya, Banana, Passion Fruit, Starfruit

MALAYSIA ENVIRONMENT:
- Temperature: 25-32°C year-round
- Humidity: 70-90% (high humidity tropical)
- Rainfall: High, monsoon seasons (wet/dry)
- Soil: Generally acidic, needs lime amendment
- Challenges: High heat, pests (aphids, whiteflies), fungal diseases

CURRENT PLANT MONITORING: ${currentPlant || "None selected"}

YOUR CAPABILITIES:
1. Recommend plants suitable for Malaysian climate
2. Provide growing tips specific to tropical conditions
3. Troubleshoot common issues (pests, diseases, heat stress)
4. Suggest optimal temperature, humidity, and water levels
5. Help users switch between plants by saying "UPDATE PLANT TO [plant_name]"

RESPONSE FORMAT:
- Be concise and practical
- Use local Malaysian context
- Give specific numbers for temp/humidity when relevant
- If user wants to change plants, respond with: "UPDATE_PLANT:[plant_name]:[temp_min]:[temp_max]:[humidity_min]:[humidity_max]:[water_level]"

Example plant update response:
"I'll switch your monitoring to Cili Padi! UPDATE_PLANT:Cili Padi:25:32:60:80:70"

Be friendly, knowledgeable, and focused on Malaysian growing conditions.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
