import { Router } from 'express';
import {
  getAllBirthdays,
  getTodayBirthdays,
  createBirthday,
  updateBirthday,
  deleteBirthday,
  birthdayValidation,
} from '../controllers/birthdayController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getAllBirthdays);
router.get('/today', getTodayBirthdays);
router.post('/', birthdayValidation, createBirthday);
router.patch('/:id', birthdayValidation, updateBirthday);
router.delete('/:id', deleteBirthday);

export default router;
