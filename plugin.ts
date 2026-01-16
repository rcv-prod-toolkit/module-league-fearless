import type { PluginContext } from '@rcv-prod-toolkit/types'
import Ban from './types/Ban'

module.exports = async (ctx: PluginContext) => {
  const namespace = ctx.plugin.module.getName()

  // Register new UI page
  ctx.LPTE.emit({
    meta: {
      type: 'add-pages',
      namespace: 'ui',
      version: 1
    },
    pages: [
      {
        name: `LoL: Fearless`,
        frontend: 'frontend',
        id: `op-${namespace}`
      }
    ]
  })

  let state: Ban[] = []
  let lastUpdate: number

  ctx.LPTE.on(namespace, 'request', (e) => {
    ctx.LPTE.emit({
      meta: {
        type: e.meta.reply as string,
        namespace: 'reply',
        version: 1
      },
      state: state
    })
  })

  ctx.LPTE.on('module-league-state', 'champselect-update', async (e) => {
    if (e.order === undefined || e.order.blueTeam.picks.length === 0) return

    if (lastUpdate !== undefined && Date.now() - lastUpdate < 4 * 60 * 1000) return

    if (e.data.phase !== 'GAME_STARTING') return

    if (state.findIndex(s => s.championId === e.order.blueTeam.picks[0].champion.id) !== -1) return

    state.push(...e.order.blueTeam.picks.map((p: any) => {
      return {
        championId: p.champion.id,
        tileURL: p.champion.squareImg
      }
    }))
    state.push(...e.order.redTeam.picks.map((p: any) => {
      return {
        championId: p.champion.id,
        tileURL: p.champion.squareImg
      }
    }))

    lastUpdate = Date.now()

    ctx.LPTE.emit({
      meta: {
        type: 'insertOne',
        namespace: 'plugin-database',
        version: 1
      },
      collection: 'fearless',
      data: {
        bans: state
      }
    })
  })

  ctx.LPTE.on(namespace, 'reset', async () => {
    state = []

    await ctx.LPTE.request({
      meta: {
        type: 'delete',
        namespace: 'plugin-database',
        version: 1
      },
      collection: 'fearless',
      limit: 1
    })
  })

  const res = await ctx.LPTE.request({
    meta: {
      type: 'request',
      namespace: 'plugin-database',
      version: 1
    },
    collection: 'fearless',
    limit: 1
  })

  state = res?.data[0]?.bans ?? []

  // Emit event that we're ready to operate
  ctx.LPTE.emit({
    meta: {
      type: 'plugin-status-change',
      namespace: 'lpt',
      version: 1
    },
    status: 'RUNNING'
  })
}
