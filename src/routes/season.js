import { Router } from 'express'
import {
  getSeason,
  getSeasonType,
  refreshSeason,
  updateSeason,
  updateSeasonType
} from '../middleware/season'
import { requireAuthorisation } from '../middleware'

export default (db) => {
  const router = Router()

  // Get all seasonal anime for a given year/season
  router.get('/:year/:season', (req, res, next) => {
    getSeason(req, res, next, db)
  }, (req, res) => {
    res.status(200).json({ id: req.id, data: req.data })
  })

  // Get seasonal anime for a given year/season with type (New, Continuing, OVA etc)
  router.get('/:year/:season/:type', (req, res, next) => {
    getSeasonType(req, res, next, db)
  }, (req, res) => {
    res.status(200).json({
      id: req.id,
      type: req.params.type,
      data: req.data
    })
  })

  // Get the current seasonal anime (Not just airing)
  router.get('/current', (req, res, next) => {
    getSeasonLatest(req, res, next, db)
  }, (req, res) => {
    res.status(200).json({ id: req.id, data: req.data })
  })

  // Update current db with fresh data for each season with type
  router.post('/:year/:season/:type', requireAuthorisation, refreshSeason, (req, res, next) => {
    updateSeasonType(req, res, next, db)
  }, (req, res) => {
    res.status(200).json({
      id: req.id,
      status: `Updated season for ${req.params.season} ${req.params.year}.`,
      type: req.params.type,
      data: req.data
    })
  })

  // Update current db with fresh data for each season
  router.post('/:year/:season', requireAuthorisation, refreshSeason, (req, res, next) => {
    updateSeason(req, res, next, db)
  }, (req, res) => {
    res.status(200).json({
      id: req.id,
      status: `Updated season for ${req.params.season} ${req.params.year}`,
      season: req.data
    })
  })

  return router
}
