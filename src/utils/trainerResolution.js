import { trainerAPI } from '../services/api';

const normalizeName = (value) => (value || '').toLowerCase().replace(/\s+/g, ' ').trim();

const matchesUserId = (trainer, currentUser) => {
  if (trainer?.userId == null || currentUser?.userId == null) {
    return false;
  }

  return String(trainer.userId) === String(currentUser.userId);
};

export const resolveTrainerIdentity = async (currentUser) => {
  if (currentUser?.trainerId != null) {
    return {
      trainerId: currentUser.trainerId,
      trainerName: currentUser.trainerName || currentUser.name || '',
    };
  }

  const trainers = await trainerAPI.getTrainers();
  const trainerList = Array.isArray(trainers) ? trainers : [];
  const matchedTrainer = trainerList.find((trainer) => matchesUserId(trainer, currentUser))
    || trainerList.find((trainer) => normalizeName(trainer.name) === normalizeName(currentUser?.name));

  if (!matchedTrainer) {
    return null;
  }

  return {
    trainerId: matchedTrainer.trainerId,
    trainerName: matchedTrainer.name || currentUser?.name || '',
  };
};