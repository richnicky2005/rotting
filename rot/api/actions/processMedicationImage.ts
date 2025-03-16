import { ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, logger, api, config }) => {
  try {
    const { imageBase64 } = params;
    const apiKey = config.GEMINI_API_KEY;

    if (!imageBase64) {
      throw new Error("No image data provided");
    }

    if (!apiKey) {
      logger.error("GEMINI_API_KEY is not configured");
      throw new Error("API key for Gemini is missing");
    }

    // Prepare the request to Gemini API
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent";
    const headers = {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    };

    // Prepare prompt with specific instructions
    const prompt = `
      Analyze this image of a medication label and extract the following information:
      1. Medication name
      2. Dosage (including units)
      3. Times per day to take
      4. Specific times to take (e.g., morning, evening, etc.)
      
      Return the information in JSON format with these exact keys:
      {
        "medication": "medication name",
        "dosage": "dosage with units",
        "timesPerDay": number,
        "timesToTake": "description of when to take"
      }
    `;

    // Prepare the request body
    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024
      }
    };

    // Call Gemini API
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({ status: response.status, error: errorText }, "Gemini API request failed");
      throw new Error(`Failed to analyze image: ${response.status}`);
    }

    const result = await response.json();

    // Extract the text response from Gemini
    const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      logger.error("No text response received from Gemini API");
      throw new Error("Failed to extract medication information from image");
    }

    // Try to extract JSON from the response
    // Sometimes Gemini includes the JSON with markdown code blocks or additional text
    let medicationData;
    try {
      // First try to find a JSON block with regex
      const jsonMatch = textResponse.match(/```json\s*({[\s\S]*?})\s*```/) || 
                         textResponse.match(/{[\s\S]*?"medication"[\s\S]*?}/);
      
      if (jsonMatch) {
        medicationData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        // If no JSON block found, try parsing the entire response
        medicationData = JSON.parse(textResponse);
      }
    } catch (error) {
      logger.error({ error, response: textResponse }, "Failed to parse JSON from Gemini response");
      throw new Error("Failed to parse medication data from response");
    }

    // Validate the extracted data
    const validatedData = {
      medication: medicationData.medication || "Unknown",
      dosage: medicationData.dosage || "Unknown",
      timesPerDay: parseInt(medicationData.timesPerDay) || 0,
      timesToTake: medicationData.timesToTake || "Unknown"
    };

    logger.info({ medicationData: validatedData }, "Successfully extracted medication information");
    
    return validatedData;
  } catch (error) {
    logger.error({ error }, "Error processing medication image");
    throw error;
  }
};

export const params = {
  imageBase64: { type: "string" }
};

export const options: ActionOptions = {
  returnType: true
};