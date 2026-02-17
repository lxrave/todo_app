/**
 * Проверяем, что приложение доступно (npm run dev запущен).
 * Иначе тесты зависают на первом page.goto без понятной ошибки.
 */
async function globalSetup(): Promise<void> {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173'
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(baseURL, { signal: controller.signal })
    clearTimeout(t)
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`)
    }
  } catch (e) {
    clearTimeout(t)
    const msg =
      e instanceof Error && e.name === 'AbortError'
        ? 'Таймаут 5 с'
        : e instanceof Error
          ? e.message
          : String(e)
    throw new Error(
      `[E2E] Приложение не доступно по адресу ${baseURL} (${msg}). Запустите в другом терминале: npm run dev`
    )
  }
}

export default globalSetup
