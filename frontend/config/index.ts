const required = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }

  return value
}

export const env = {
  API_URL: required(process.env.NEXT_PUBLIC_API_URL, "NEXT_PUBLIC_API_URL"),
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "Quiz Platform",
  NODE_ENV: process.env.NODE_ENV ?? "development",
}
