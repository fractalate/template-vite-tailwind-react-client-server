import express, { NextFunction, Request, Response } from 'express'
import { Pool, PoolClient } from 'pg'

export const pool = new Pool()

export function withPg(callback: (client: PoolClient, req: Request, res: Response, next: NextFunction) => void | Promise<void>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await pool.connect();
      try {
        await callback(client, req, res, next)
      } finally {
        client.release()
      }
    } catch (err) {
      next(err)
    }
  }
}

