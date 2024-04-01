import { Application, Request, Response, NextFunction } from 'express'
import { withPg } from '../../pg'

export default function setUpApi(app: Application) {
  // Useful things you might want:
  //app.use('/api', express.urlencoded({ extended: true }))

  app.get('/api/test/ping', (_req, res) => {
    res.send({ message: 'Pong.' })
  })

  app.get('/api/test/pg', withPg(async (client, _req, res) => {
    const { rows } = await client.query(`select 1 as one`)
    res.send({ message: 'Okay.', data: rows })
  }))

  // 2nd to last handler!
  app.use('/api', (_req, res) => {
    res.status(404).send({ message: 'Not found.' })
  })

  // Last handler!
  app.use('/api', (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    console.error(err)
    res.status(500).send({ message: 'Internal server error.' })
  })
}
