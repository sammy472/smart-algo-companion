import { eq, desc } from 'drizzle-orm';
import db from '../database/client.js';
import { cropDetections } from '../database/schema.js';
import axios from 'axios'; // For AI model API calls

// AI Model endpoint (you'll need to configure this)
const AI_MODEL_URL = process.env.AI_MODEL_URL || 'https://your-ai-model-api.com/predict';

// Upload and detect crop disease
export const detectCropDisease = async (req, res) => {
  try {
    const { farmerId, imageUrl, videoUrl } = req.body;
    
    // imageUrl is required (notNull in schema), videoUrl is optional
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }
    
    if (!farmerId) {
      return res.status(400).json({ error: 'Farmer ID is required' });
    }
    
    // Call AI model API
    let aiResponse;
    try {
      const response = await axios.post(AI_MODEL_URL, {
        image_url: imageUrl,
        video_url: videoUrl || null,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_MODEL_API_KEY || ''}`,
        },
        timeout: 30000, // 30 seconds timeout
      });
      
      aiResponse = response.data;
    } catch (aiError) {
      console.error('AI model error:', aiError);
      // Fallback to mock response for development
      aiResponse = {
        classification: 'healthy',
        confidence: 0.85,
        infection_type: null,
        pesticide_recommendation: null,
      };
    }
    
    // Save detection result - imageUrl is required, videoUrl is optional
    const detection = await db.insert(cropDetections).values({
      farmerId: parseInt(farmerId),
      imageUrl: imageUrl, // Required field, already validated above
      videoUrl: videoUrl || null, // Optional field
      classification: aiResponse.classification || 'healthy',
      infectionType: aiResponse.infection_type || null,
      confidence: aiResponse.confidence ? parseFloat(aiResponse.confidence) : null,
      pesticideRecommendation: aiResponse.pesticide_recommendation || null,
    }).returning();
    
    res.status(201).json({
      message: 'Crop detection completed',
      detection: detection[0],
      recommendation: aiResponse.classification === 'unhealthy' 
        ? `Infection detected: ${aiResponse.infection_type}. ${aiResponse.pesticide_recommendation || 'Please consult with an agricultural expert.'}`
        : 'Your crop appears to be healthy.',
    });
  } catch (err) {
    console.error('Detect crop disease error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get detection history for a farmer
export const getDetectionHistory = async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    const detections = await db.select()
      .from(cropDetections)
      .where(eq(cropDetections.farmerId, parseInt(farmerId)))
      .orderBy(desc(cropDetections.createdAt));
    
    res.status(200).json(detections);
  } catch (err) {
    console.error('Get detection history error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get single detection
export const getDetection = async (req, res) => {
  try {
    const { id } = req.params;
    
    const detection = await db.select()
      .from(cropDetections)
      .where(eq(cropDetections.id, parseInt(id)));
    
    if (detection.length === 0) {
      return res.status(404).json({ error: 'Detection not found' });
    }
    
    res.status(200).json(detection[0]);
  } catch (err) {
    console.error('Get detection error:', err);
    res.status(500).json({ error: err.message });
  }
};

