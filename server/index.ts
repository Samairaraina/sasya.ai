import 'dotenv/config'
import { app } from './app'

const port = Number(process.env.PORT ?? 3001)

app.listen(port, () => {
  console.log(`Sasya API listening on http://localhost:${port}`)
})
