export interface PreviewImage {
  page: number
  imagePath: string
}

export interface UploadedPdfInfo {
  originalName: string
  filename: string
  path: string
  size: number
  totalPages: number
}

export interface PdfImport {
  id: string

  pdf: UploadedPdfInfo

  previews: PreviewImage[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
