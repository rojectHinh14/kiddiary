// ============================================
// AI TAGGING SERVICE - Backend Integration
// File: src/services/aiTaggingService.js
// ============================================

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// AI API URL from Colab (set in .env)
const AI_API_URL = process.env.AI_TAGGING_URL || "http://localhost:5000";

/**
 * Generate AI tags for an image
 * @param {string} imageBase64 - Base64 encoded image
 * @param {number} mediaId - Optional media ID
 * @returns {Promise<Array>} Array of Vietnamese tags
 */
const generateTags = async (imageBase64, mediaId = null) => {
  try {
    console.log(`🤖 Calling AI API for mediaId: ${mediaId}...`);

    const response = await axios.post(
      `${AI_API_URL}/generate-tags`,
      {
        image: imageBase64,
        mediaId: mediaId,
      },
      {
        timeout: 30000, // 30 seconds timeout
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      const tags = response.data.tags || [];
      const caption = response.data.caption || "";
      const processingTime = response.data.metadata?.processing_time || 0;

      console.log(`✅ AI Tags generated in ${processingTime}s`);
      console.log(`   Tags: ${tags.join(", ")}`);

      return {
        success: true,
        tags,
        caption,
        metadata: response.data.metadata,
      };
    } else {
      console.error("❌ AI API returned error:", response.data.error);
      return {
        success: false,
        error: response.data.error,
        tags: [],
      };
    }
  } catch (error) {
    console.error("❌ Error calling AI API:", error.message);

    // Return empty tags if AI fails (don't block upload)
    return {
      success: false,
      error: error.message,
      tags: [],
    };
  }
};

/**
 * Batch generate tags for multiple images
 * @param {Array} images - Array of {id, imageBase64}
 * @returns {Promise<Array>} Results array
 */
const batchGenerateTags = async (images) => {
  try {
    const response = await axios.post(
      `${AI_API_URL}/batch-generate`,
      {
        images: images.map((img) => ({
          id: img.id,
          image: img.imageBase64,
        })),
      },
      { timeout: 60000 } // 60s for batch
    );

    if (response.data.success) {
      return response.data.results;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error) {
    console.error("Batch AI tagging error:", error.message);
    throw error;
  }
};

/**
 * Check if AI service is online
 * @returns {Promise<boolean>}
 */
const checkAIHealth = async () => {
  try {
    const response = await axios.get(`${AI_API_URL}/health`, {
      timeout: 5000,
    });
    return response.data.status === "online";
  } catch (error) {
    console.warn("⚠️  AI service is offline:", error.message);
    return false;
  }
};

export default {
  generateTags,
  batchGenerateTags,
  checkAIHealth,
};