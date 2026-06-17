import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { Birthday } from '../models/Birthday';
import { AuthenticatedRequest } from '../types';

export const birthdayValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('birthDate')
    .isISO8601().withMessage('Valid birth date is required')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        const formatted = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        throw new Error(`Birth date cannot be after ${formatted}`);
      }
      return true;
    }),
  body('note').optional().trim().isLength({ max: 500 }),
];

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const todayMonthDay = () => {
  const now = new Date();
  return { month: now.getMonth() + 1, day: now.getDate() };
};

export const getAllBirthdays = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query['limit'] as string) || 10));
  const search = (req.query['search'] as string) || '';

  const filter: mongoose.FilterQuery<typeof Birthday> = { createdBy: req.userId };
  if (search) {
    // Escape regex metacharacters to prevent ReDoS from user-supplied input.
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter['name'] = { $regex: escaped, $options: 'i' };
  }

  const [birthdays, total] = await Promise.all([
    Birthday.find(filter)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Birthday.countDocuments(filter),
  ]);

  const { month, day } = todayMonthDay();
  const birthdaysWithToday = birthdays.map((b) => ({
    ...b,
    isToday:
      new Date(b.birthDate).getMonth() + 1 === month &&
      new Date(b.birthDate).getDate() === day,
  }));

  res.json({
    birthdays: birthdaysWithToday,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

export const getTodayBirthdays = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { month, day } = todayMonthDay();

  const birthdays = await Birthday.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.userId) } },
    { $addFields: { month: { $month: '$birthDate' }, day: { $dayOfMonth: '$birthDate' } } },
    { $match: { month, day } },
  ]);

  res.json({ birthdays });
};

export const createBirthday = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, birthDate, note } = req.body;

  const birthday = await Birthday.create({
    name,
    birthDate: new Date(birthDate),
    note,
    createdBy: req.userId,
  });

  res.status(201).json({ birthday });
};

export const updateBirthday = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const id = req.params['id'] as string;
  if (!isValidId(id)) {
    res.status(400).json({ message: 'Invalid birthday ID' });
    return;
  }

  const { name, birthDate, note } = req.body;

  const birthday = await Birthday.findOneAndUpdate(
    { _id: id, createdBy: req.userId },
    { $set: { name, birthDate, note } },
    { new: true, runValidators: true }
  );

  if (!birthday) {
    res.status(404).json({ message: 'Birthday not found' });
    return;
  }

  res.json({ birthday });
};

export const deleteBirthday = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = req.params['id'] as string;
  if (!isValidId(id)) {
    res.status(400).json({ message: 'Invalid birthday ID' });
    return;
  }

  const birthday = await Birthday.findOneAndDelete({ _id: id, createdBy: req.userId });

  if (!birthday) {
    res.status(404).json({ message: 'Birthday not found' });
    return;
  }

  res.status(204).send();
};
