import { baseApi } from "./baseApi"

import { ApiResponse, PdfImport } from "../types/pdfImport.types"

interface UploadPdfPayload {
  file: File
}

export const pdfImportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Upload PDF
     */
    uploadPdf: builder.mutation<ApiResponse<PdfImport>, UploadPdfPayload>({
      query: ({ file }) => {
        const formData = new FormData()

        formData.append("pdf", file)

        return {
          url: "/pdf-import/upload",
          method: "POST",
          body: formData,
        }
      },

      invalidatesTags: ["PdfImport"],
    }),

    /**
     * Get All Uploaded PDFs
     */
    getPdfImports: builder.query<ApiResponse<PdfImport[]>, void>({
      query: () => ({
        url: "/pdf-import",
        method: "GET",
      }),

      providesTags: ["PdfImport"],
    }),

    /**
     * Get Single Uploaded PDF
     */
    getPdfImportById: builder.query<ApiResponse<PdfImport>, string>({
      query: (id) => ({
        url: `/pdf-import/${id}`,
        method: "GET",
      }),

      providesTags: (result, error, id) => [
        {
          type: "PdfImport",
          id,
        },
      ],
    }),
  }),
})

export const {
  useUploadPdfMutation,
  useGetPdfImportsQuery,
  useGetPdfImportByIdQuery,
} = pdfImportApi
