import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const fileRouter = {
  imageUploader: f({ image: { maxFileSize: "5MB" } })
    .onUploadComplete(({ file }) => {
      console.log("[uploadthing] terminé:", file.url)
    }),
} satisfies FileRouter

export type UploadRouter = typeof fileRouter
