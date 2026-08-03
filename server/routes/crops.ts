import { Router } from 'express'
import { prisma } from '../../lib/prisma'

const router = Router()

router.get('/', async (req, res) => {
  const crops = await prisma.crop.findMany({
    where: { farm: { userId: req.user!.id } },
    include: { farm: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json({ crops })
})

router.post('/', async (req, res) => {
  const { name, variety, plantedAt, health, notes, farmId } = req.body ?? {}
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Crop name is required.' })
  }

  let targetFarmId = farmId
  if (typeof targetFarmId !== 'string' || !targetFarmId) {
    const first = await prisma.farm.findFirst({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' },
    })
    targetFarmId = first?.id
  }
  if (!targetFarmId) {
    const farm = await prisma.farm.create({
      data: { name: 'My Farm', userId: req.user!.id },
    })
    targetFarmId = farm.id
  }

  const owned = await prisma.farm.findFirst({
    where: { id: targetFarmId, userId: req.user!.id },
  })
  if (!owned) {
    return res.status(404).json({ error: 'Farm not found.' })
  }

  const crop = await prisma.crop.create({
    data: {
      name: name.trim(),
      variety: typeof variety === 'string' && variety.trim() ? variety.trim() : null,
      plantedAt: plantedAt ? new Date(plantedAt) : null,
      health: typeof health === 'string' && health.trim() ? health.trim() : null,
      notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
      farmId: targetFarmId,
    },
  })
  res.status(201).json({ crop })
})

router.patch('/:id', async (req, res) => {
  const crop = await prisma.crop.findFirst({
    where: { id: req.params.id, farm: { userId: req.user!.id } },
  })
  if (!crop) {
    return res.status(404).json({ error: 'Crop not found.' })
  }
  const { name, variety, plantedAt, health, notes } = req.body ?? {}
  const updated = await prisma.crop.update({
    where: { id: crop.id },
    data: {
      name: typeof name === 'string' && name.trim() ? name.trim() : undefined,
      variety: typeof variety === 'string' ? (variety.trim() ? variety.trim() : null) : undefined,
      plantedAt:
        plantedAt === null ? null : plantedAt ? new Date(plantedAt) : undefined,
      health: typeof health === 'string' ? (health.trim() ? health.trim() : null) : undefined,
      notes: typeof notes === 'string' ? (notes.trim() ? notes.trim() : null) : undefined,
    },
  })
  res.json({ crop: updated })
})

router.delete('/:id', async (req, res) => {
  const crop = await prisma.crop.findFirst({
    where: { id: req.params.id, farm: { userId: req.user!.id } },
  })
  if (!crop) {
    return res.status(404).json({ error: 'Crop not found.' })
  }
  await prisma.crop.delete({ where: { id: crop.id } })
  res.status(204).end()
})

export default router
