import express from 'express';
import { 
    addFarmer, 
    deleteFarmer, 
    modifyFarmer,
    getFarmer,
    getFarmers
} from '../controllers/controller.js';
const router = express.Router();

//Farmer Routes
router.post('/add', addFarmer);
router.delete('/:id', deleteFarmer);
router.put('/:id', modifyFarmer);
router.get('/farmer',getFarmer);
router.get('/farmers',getFarmers);

export default router;